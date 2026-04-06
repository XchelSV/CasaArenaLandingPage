import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../interfaces/cart-item.interface';

type CartProduct = Omit<CartItem, 'quantity'>;

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
        const existingItem = cartItems.find((item) => item.id === product.id);

        const nextItems = existingItem
            ? cartItems.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            : [...cartItems, { ...product, quantity: 1 }];

        this.updateCart(nextItems);
    }

    decreaseQuantity(productId: string): void {
        const nextItems = this.cartItemsSubject
            .getValue()
            .flatMap((item) => {
                if (item.id !== productId) {
                    return [item];
                }

                if (item.quantity <= 1) {
                    return [];
                }

                return [{ ...item, quantity: item.quantity - 1 }];
            });

        this.updateCart(nextItems);
    }

    removeFromCart(productId: string): void {
        const nextItems = this.cartItemsSubject
            .getValue()
            .filter((item) => item.id !== productId);

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
            return JSON.parse(rawCart) as CartItem[];
        } catch {
            return [];
        }
    }
}
