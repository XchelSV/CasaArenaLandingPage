import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, finalize, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MEXICO_STATES } from 'src/app/shared/constants/mexico-states';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { PaymentPreferenceService } from 'src/app/shared/services/payment-preference.service';
import { ShipmentCalculationService } from 'src/app/shared/services/shipment-calculation.service';

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
    isCalculatingShipment = false;
    isCreatingPaymentPreference = false;
    shipmentCost: number | null = null;
    shipmentErrorMessage = '';
    paymentErrorMessage = '';

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
        private readonly formBuilder: FormBuilder,
        private readonly paymentPreferenceService: PaymentPreferenceService,
        private readonly shipmentCalculationService: ShipmentCalculationService
    ) {}

    get canCalculateShipment(): boolean {
        const state = this.checkoutForm.get('state')?.value;
        return typeof state === 'string' && !!state.trim();
    }

    resetShipmentCalculation(): void {
        this.shipmentCost = null;
        this.shipmentErrorMessage = '';
        this.paymentErrorMessage = '';
    }

    async onStateChange(): Promise<void> {
        this.resetShipmentCalculation();

        if (!this.canCalculateShipment) {
            return;
        }

        await this.calculateShipment();
    }

    async calculateShipment(): Promise<void> {
        if (this.isCalculatingShipment || !this.canCalculateShipment) {
            return;
        }

        const orderId = this.cartService.getOrderId();

        if (!orderId) {
            this.shipmentErrorMessage = 'No pudimos preparar el cálculo de envío. Regresa al carrito e inténtalo de nuevo.';
            return;
        }

        const state = this.checkoutForm.get('state')?.value;

        if (typeof state !== 'string' || !state.trim()) {
            return;
        }

        this.isCalculatingShipment = true;
        this.resetShipmentCalculation();

        try {
            const shipmentCalculation = await firstValueFrom(
                this.shipmentCalculationService.calculateShipment(orderId, state.trim()).pipe(
                    finalize(() => {
                        this.isCalculatingShipment = false;
                    })
                )
            );

            if (shipmentCalculation.shipmentCost === null) {
                this.shipmentErrorMessage = 'Recibimos una respuesta incompleta para el envío. Inténtalo de nuevo en unos segundos.';
                return;
            }

            this.shipmentCost = shipmentCalculation.shipmentCost;
        } catch {
            this.shipmentCost = null;
            this.shipmentErrorMessage = 'No pudimos calcular el envío por ahora. Inténtalo de nuevo en unos segundos.';
        }
    }

    async redirectToMercadoPago(): Promise<void> {
        if (this.isCreatingPaymentPreference || this.shipmentCost === null) {
            return;
        }

        const orderId = this.cartService.getOrderId();

        if (!orderId) {
            this.paymentErrorMessage = 'No pudimos preparar el pago. Regresa al carrito e inténtalo de nuevo.';
            return;
        }

        this.paymentErrorMessage = '';
        this.isCreatingPaymentPreference = true;

        try {
            const paymentPreference = await firstValueFrom(
                this.paymentPreferenceService.createPreference(orderId).pipe(
                    finalize(() => {
                        this.isCreatingPaymentPreference = false;
                    })
                )
            );

            const redirectUrl = environment.production
                ? paymentPreference.initPoint
                : paymentPreference.sandboxInitPoint;

            if (!redirectUrl) {
                this.paymentErrorMessage = 'No pudimos obtener el enlace de pago. Inténtalo de nuevo en unos segundos.';
                return;
            }

            window.location.assign(redirectUrl);
        } catch {
            this.paymentErrorMessage = 'No pudimos iniciar el pago por ahora. Inténtalo de nuevo en unos segundos.';
        }
    }
}
