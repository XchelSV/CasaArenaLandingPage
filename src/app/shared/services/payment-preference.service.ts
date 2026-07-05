import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface PaymentPreferencePayload {
    order_id: string;
}

interface PaymentPreferenceApiResponse {
    order_id?: unknown;
    preference_id?: unknown;
    init_point?: unknown;
    sandbox_init_point?: unknown;
    total_amount?: unknown;
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

    createPreference(orderId: string): Observable<PaymentPreferenceResponse> {
        return this.createPreferenceRequest({
            order_id: orderId
        }).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.createPreferenceRequest({
                        order_id: orderId
                    }))
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

    private createGuestSession(): Observable<unknown> {
        return this.http.post(this.guestSessionEndpoint, null, {
            withCredentials: true,
            observe: 'response'
        });
    }
}
