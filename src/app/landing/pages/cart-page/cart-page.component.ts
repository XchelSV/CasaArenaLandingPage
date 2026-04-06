import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';

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

    constructor(private cartService: CartService) {}

    decreaseQuantity(productId: string): void {
        this.cartService.decreaseQuantity(productId);
    }

    increaseQuantity(item: CartItem): void {
        this.cartService.addToCart({
            id: item.id,
            title: item.title,
            description: item.description,
            imagePath: item.imagePath,
            price: item.price,
            category: item.category
        });
    }

    removeFromCart(productId: string): void {
        this.cartService.removeFromCart(productId);
    }

    clearCart(): void {
        this.cartService.clearCart();
    }
}
