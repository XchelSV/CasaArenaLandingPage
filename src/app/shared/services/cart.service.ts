import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../interfaces/cart-item.interface';

type CartProduct = Omit<CartItem, 'quantity' | 'cartKey'>;

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly storageKey = 'casa-arena-cart';
    private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.readCartFromStorage());

    readonly cartItems$ = this.cartItemsSubject.asObservable();
    readonly cartCount$ = this.cartItems$.pipe(
        map((items) => items.reduce((total, item) => total + item.quantity, 0))
    );
    readonly cartSubtotal$ = this.cartItems$.pipe(
        map((items) => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );

    addToCart(product: CartProduct): void {
        const cartItems = this.cartItemsSubject.getValue();
        const cartKey = this.buildCartKey(product.id, product.presentationId);
        const normalizedProduct: Omit<CartItem, 'quantity'> = {
            ...product,
            cartKey
        };
        const existingItem = cartItems.find((item) => item.cartKey === cartKey);

        const nextItems: CartItem[] = existingItem
            ? cartItems.map((item) =>
                item.cartKey === cartKey
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            : [...cartItems, { ...normalizedProduct, quantity: 1 }];

        this.updateCart(nextItems);
    }

    decreaseQuantity(cartKey: string): void {
        const nextItems = this.cartItemsSubject
            .getValue()
            .flatMap((item) => {
                if (item.cartKey !== cartKey) {
                    return [item];
                }

                if (item.quantity <= 1) {
                    return [];
                }

                return [{ ...item, quantity: item.quantity - 1 }];
            });

        this.updateCart(nextItems);
    }

    removeFromCart(cartKey: string): void {
        const nextItems = this.cartItemsSubject
            .getValue()
            .filter((item) => item.cartKey !== cartKey);

        this.updateCart(nextItems);
    }

    clearCart(): void {
        this.updateCart([]);
    }

    private updateCart(items: CartItem[]): void {
        this.cartItemsSubject.next(items);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(this.storageKey, JSON.stringify(items));
        }
    }

    private readCartFromStorage(): CartItem[] {
        if (typeof window === 'undefined') {
            return [];
        }

        const rawCart = window.localStorage.getItem(this.storageKey);

        if (!rawCart) {
            return [];
        }

        try {
            const parsedCart = JSON.parse(rawCart) as Partial<CartItem>[];
            return parsedCart.map((item) => this.normalizeCartItem(item)).filter((item): item is CartItem => item !== null);
        } catch {
            return [];
        }
    }

    private normalizeCartItem(item: Partial<CartItem>): CartItem | null {
        if (
            typeof item.id !== 'string' ||
            typeof item.title !== 'string' ||
            typeof item.description !== 'string' ||
            typeof item.imagePath !== 'string' ||
            typeof item.price !== 'number' ||
            typeof item.category !== 'string'
        ) {
            return null;
        }

        const presentationId = typeof item.presentationId === 'string' ? item.presentationId : '1l';
        const presentationLabel = typeof item.presentationLabel === 'string' ? item.presentationLabel : '1 L';
        const cartKey = typeof item.cartKey === 'string'
            ? item.cartKey
            : this.buildCartKey(item.id, presentationId);

        return {
            id: item.id,
            cartKey,
            title: item.title,
            description: item.description,
            imagePath: item.imagePath,
            price: item.price,
            category: item.category,
            presentationId,
            presentationLabel,
            quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
        };
    }

    private buildCartKey(productId: string, presentationId: string): string {
        return `${productId}-${presentationId}`;
    }
}
