import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { CartValidationService } from 'src/app/shared/services/cart-validation.service';

@Component({
    selector: 'app-cart-page',
    templateUrl: './cart-page.component.html',
    styleUrls: ['./cart-page.component.css'],
    standalone: false
})
export class CartPageComponent {
    readonly cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
    readonly cartCount$: Observable<number> = this.cartService.cartCount$;
    readonly cartSubtotal$: Observable<number> = this.cartService.cartSubtotal$;
    readonly cdnUrl = environment.CDN_URL;
    isContinuingToCheckout = false;
    checkoutErrorMessage = '';

    constructor(
        private readonly cartService: CartService,
        private readonly cartValidationService: CartValidationService,
        private readonly router: Router
    ) {}

    decreaseQuantity(cartKey: string): void {
        this.cartService.decreaseQuantity(cartKey);
    }

    increaseQuantity(item: CartItem): void {
        this.cartService.addToCart({
            id: item.id,
            title: item.title,
            description: item.description,
            imagePath: item.imagePath,
            price: item.price,
            category: item.category,
            presentationId: item.presentationId,
            presentationLabel: item.presentationLabel
        });
    }

    removeFromCart(cartKey: string): void {
        this.cartService.removeFromCart(cartKey);
    }

    clearCart(): void {
        this.cartService.clearCart();
    }

    async continueToCheckout(): Promise<void> {
        if (this.isContinuingToCheckout) {
            return;
        }

        const cartItems = await firstValueFrom(this.cartItems$);

        if (!cartItems.length) {
            return;
        }

        this.isContinuingToCheckout = true;
        this.checkoutErrorMessage = '';

        try {
            const validatedItems = await firstValueFrom(
                this.cartValidationService.validateCart(cartItems).pipe(
                    finalize(() => {
                        this.isContinuingToCheckout = false;
                    })
                )
            );

            this.cartService.replaceCart(validatedItems);
            await this.router.navigate(['/landing/checkout']);
        } catch {
            this.checkoutErrorMessage = 'No pudimos validar tu carrito por ahora. Inténtalo de nuevo más tarde.';
        }
    }
}
