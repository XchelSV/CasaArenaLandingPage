import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { PaymentPreferenceStatusResponse } from 'src/app/shared/interfaces/payment-preference-status-response.interface';
import { CartItem } from 'src/app/shared/interfaces/cart-item.interface';
import { ShipmentDetails } from 'src/app/shared/interfaces/shipment-details.interface';
import { environment } from 'src/environments/environment';

interface PaymentPreferencePayload {
    order_id: string;
    shipment_details: ShipmentDetails;
}

interface PaymentPreferenceApiResponse {
    order_id?: unknown;
    preference_id?: unknown;
    init_point?: unknown;
    sandbox_init_point?: unknown;
    total_amount?: unknown;
}

interface PaymentPreferenceStatusApiResponse {
    status?: unknown;
    products?: unknown;
    shipment_cost?: unknown;
    shipment_details?: unknown;
}

export interface PaymentPreferenceResponse {
    orderId: string | null;
    preferenceId: string | null;
    initPoint: string | null;
    sandboxInitPoint: string | null;
    totalAmount: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentPreferenceService {
    private readonly preferenceEndpoint = `${environment.API_GATEWAY}/preference`;
    private readonly guestSessionEndpoint = `${environment.API_GATEWAY}/guest/session`;

    constructor(private readonly http: HttpClient) {}

    createPreference(orderId: string, shipmentDetails: ShipmentDetails): Observable<PaymentPreferenceResponse> {
        return this.createPreferenceRequest({
            order_id: orderId,
            shipment_details: shipmentDetails
        }).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.createPreferenceRequest({
                        order_id: orderId,
                        shipment_details: shipmentDetails
                    }))
                )
            )
        );
    }

    getPreference(externalReference: string, preferenceId: string): Observable<PaymentPreferenceStatusResponse> {
        return this.getPreferenceRequest(externalReference, preferenceId).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.getPreferenceRequest(externalReference, preferenceId))
                )
            )
        );
    }

    private createPreferenceRequest(payload: PaymentPreferencePayload): Observable<PaymentPreferenceResponse> {
        return this.http.post<PaymentPreferenceApiResponse>(this.preferenceEndpoint, payload, {
            withCredentials: true
        }).pipe(
            map((response) => {
                const rawTotalAmount = response?.total_amount;
                const totalAmount = typeof rawTotalAmount === 'number'
                    ? rawTotalAmount
                    : typeof rawTotalAmount === 'string'
                        ? Number(rawTotalAmount)
                        : NaN;

                return {
                    orderId: typeof response?.order_id === 'string' || typeof response?.order_id === 'number'
                        ? String(response.order_id)
                        : null,
                    preferenceId: typeof response?.preference_id === 'string' || typeof response?.preference_id === 'number'
                        ? String(response.preference_id)
                        : null,
                    initPoint: typeof response?.init_point === 'string' ? response.init_point : null,
                    sandboxInitPoint: typeof response?.sandbox_init_point === 'string' ? response.sandbox_init_point : null,
                    totalAmount: Number.isFinite(totalAmount) ? totalAmount : null
                };
            })
        );
    }

    private getPreferenceRequest(externalReference: string, preferenceId: string): Observable<PaymentPreferenceStatusResponse> {
        const params = new HttpParams()
            .set('external_reference', externalReference)
            .set('preference_id', preferenceId);

        return this.http.get<PaymentPreferenceStatusApiResponse>(this.preferenceEndpoint, {
            params,
            withCredentials: true
        }).pipe(
            map((response) => ({
                status: typeof response?.status === 'string' ? response.status : null,
                products: Array.isArray(response?.products)
                    ? response.products
                        .map((product) => this.normalizeCartItem(product))
                        .filter((product): product is CartItem => product !== null)
                    : [],
                shipmentCost: this.normalizeNumber(response?.shipment_cost),
                shipmentDetails: this.normalizeShipmentDetails(response?.shipment_details)
            }))
        );
    }

    private createGuestSession(): Observable<unknown> {
        return this.http.post(this.guestSessionEndpoint, null, {
            withCredentials: true,
            observe: 'response'
        });
    }

    private normalizeCartItem(item: unknown): CartItem | null {
        if (!item || typeof item !== 'object') {
            return null;
        }

        const cartItem = item as Partial<CartItem>;

        if (
            typeof cartItem.id !== 'string' ||
            typeof cartItem.cartKey !== 'string' ||
            typeof cartItem.title !== 'string' ||
            typeof cartItem.description !== 'string' ||
            typeof cartItem.imagePath !== 'string' ||
            typeof cartItem.price !== 'number' ||
            typeof cartItem.category !== 'string' ||
            typeof cartItem.presentationId !== 'string' ||
            typeof cartItem.presentationLabel !== 'string' ||
            typeof cartItem.quantity !== 'number'
        ) {
            return null;
        }

        return {
            id: cartItem.id,
            cartKey: cartItem.cartKey,
            title: cartItem.title,
            description: cartItem.description,
            imagePath: cartItem.imagePath,
            price: cartItem.price,
            category: cartItem.category,
            presentationId: cartItem.presentationId,
            presentationLabel: cartItem.presentationLabel,
            quantity: cartItem.quantity
        };
    }

    private normalizeShipmentDetails(shipmentDetails: unknown): ShipmentDetails | null {
        if (!shipmentDetails || typeof shipmentDetails !== 'object') {
            return null;
        }

        const details = shipmentDetails as Partial<ShipmentDetails>;
        const name = this.normalizeString(details.name);
        const phone = this.normalizeString(details.phone);
        const address = this.normalizeString(details.address);
        const neighborhood = this.normalizeString(details.neighborhood);
        const cp = this.normalizeString(details.cp);
        const state = this.normalizeString(details.state);
        const city = this.normalizeString(details.city);

        if (!name || !phone || !address || !neighborhood || !cp || !state || !city) {
            return null;
        }

        return {
            name,
            phone,
            address,
            neighborhood,
            cp,
            state,
            city
        };
    }

    private normalizeNumber(value: unknown): number | null {
        const normalizedValue = typeof value === 'number'
            ? value
            : typeof value === 'string'
                ? Number(value)
                : NaN;

        return Number.isFinite(normalizedValue) ? normalizedValue : null;
    }

    private normalizeString(value: unknown): string {
        if (typeof value === 'string') {
            return value.trim();
        }

        if (typeof value === 'number') {
            return String(value);
        }

        return '';
    }
}
