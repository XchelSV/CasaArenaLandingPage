import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MEXICO_STATES } from 'src/app/shared/constants/mexico-states';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
    selector: 'app-checkout-page',
    templateUrl: './checkout-page.component.html',
    styleUrls: ['./checkout-page.component.css'],
    standalone: false
})
export class CheckoutPageComponent {
    readonly cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
    readonly cartCount$: Observable<number> = this.cartService.cartCount$;
    readonly cartSubtotal$: Observable<number> = this.cartService.cartSubtotal$;
    readonly cdnUrl = environment.CDN_URL;
    readonly mexicoStates = MEXICO_STATES;

    readonly checkoutForm = this.formBuilder.group({
        fullName: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        neighborhood: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]]
    });

    constructor(
        private readonly cartService: CartService,
        private readonly formBuilder: FormBuilder
    ) {}
}
