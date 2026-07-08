import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';
import { PaymentPreferenceStatusResponse } from 'src/app/shared/interfaces/payment-preference-status-response.interface';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { PaymentPreferenceService } from 'src/app/shared/services/payment-preference.service';
import { environment } from 'src/environments/environment';

type PaymentOutcome = 'success' | 'pending' | 'failure';

@Component({
    selector: 'app-payment-status-page',
    templateUrl: './payment-status-page.component.html',
    styleUrls: ['./payment-status-page.component.css'],
    standalone: false
})
export class PaymentStatusPageComponent implements OnInit {
    readonly cdnUrl = environment.CDN_URL;
    isLoading = true;
    loadErrorMessage = '';
    outcome: PaymentOutcome = 'pending';
    preferenceStatus: PaymentPreferenceStatusResponse | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly cartService: CartService,
        private readonly paymentPreferenceService: PaymentPreferenceService
    ) {}

    ngOnInit(): void {
        this.outcome = this.resolveOutcome(this.activatedRoute.snapshot.data['outcome']);
        void this.loadPreferenceStatus();
    }

    get items(): CartItem[] {
        return this.preferenceStatus?.products ?? [];
    }

    get itemCount(): number {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    get subtotal(): number {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    get shipmentCost(): number {
        return this.preferenceStatus?.shipmentCost ?? 0;
    }

    get total(): number {
        return this.subtotal + this.shipmentCost;
    }

    get isFailureOutcome(): boolean {
        return this.outcome === 'failure';
    }

    get hasValidatedStatus(): boolean {
        const status = this.preferenceStatus?.status?.toUpperCase();
        return status === 'VALIDATED' || status === 'APPROVED';
    }

    get bannerClass(): string {
        if (this.isFailureOutcome) {
            return 'payment-status-banner--failure';
        }

        return this.hasValidatedStatus
            ? 'payment-status-banner--success'
            : 'payment-status-banner--pending';
    }

    get pageHeading(): string {
        switch (this.outcome) {
            case 'success':
                return 'Confirmación de pedido';
            case 'failure':
                return 'Resultado del pago';
            default:
                return 'Seguimiento de pago';
        }
    }

    get bannerEyebrow(): string {
        switch (this.outcome) {
            case 'success':
                return 'Pago en proceso';
            case 'failure':
                return 'Pago no completado';
            default:
                return 'Pago en proceso';
        }
    }

    get bannerTitle(): string {
        if (this.isFailureOutcome) {
            return 'Tuvimos problemas con el proveedor de pago';
        }

        if (this.hasValidatedStatus) {
            return 'Tu pedido estará siendo revisado';
        }

        return 'Estamos validando la referencia de tu pago';
    }

    get bannerDescription(): string {
        if (this.isFailureOutcome) {
            return 'No se realizó ningún cobro. Si tienes cualquier duda, nuestro equipo puede ayudarte desde la página de contacto.';
        }

        if (this.hasValidatedStatus) {
            return 'Tu pedido estará siendo revisado y te llegará una notificación a tu teléfono o email cuando sea confirmada.';
        }

        return 'Recibimos tu referencia de pago y estamos procesando la confirmación de tu pedido.';
    }

    private async loadPreferenceStatus(): Promise<void> {
        const externalReference = this.activatedRoute.snapshot.queryParamMap.get('external_reference');
        const preferenceId = this.activatedRoute.snapshot.queryParamMap.get('preference_id');

        if (!externalReference || !preferenceId) {
            this.isLoading = false;
            this.loadErrorMessage = 'No pudimos validar el resultado del pago porque faltan datos de la referencia.';
            return;
        }

        try {
            this.preferenceStatus = await firstValueFrom(
                this.paymentPreferenceService.getPreference(externalReference, preferenceId).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
            );

            if (!this.isFailureOutcome && this.shouldClearCart(this.preferenceStatus)) {
                this.cartService.clearCart();
            }
        } catch {
            this.loadErrorMessage = 'No pudimos consultar el estado de tu pedido por ahora. Inténtalo de nuevo en unos minutos.';
        }
    }

    private shouldClearCart(preferenceStatus: PaymentPreferenceStatusResponse): boolean {
        const cartItems = this.cartService.getCartItems();
        if (cartItems.length === 0 || preferenceStatus.products.length === 0) {
            return false;
        }

        const cartIds = new Set(cartItems.map((item) => item.id.trim()).filter((id) => id !== ''));
        const responseIds = new Set(preferenceStatus.products.map((item) => item.id.trim()).filter((id) => id !== ''));

        if (cartIds.size === 0 || cartIds.size !== responseIds.size) {
            return false;
        }

        for (const id of cartIds) {
            if (!responseIds.has(id)) {
                return false;
            }
        }

        return true;
    }

    private resolveOutcome(value: unknown): PaymentOutcome {
        return value === 'success' || value === 'failure' || value === 'pending'
            ? value
            : 'pending';
    }
}
