import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ShipmentCalculationPayload {
    order_id: string;
    state: string;
}

export interface ShipmentCalculationResponse {
    shipmentCost: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class ShipmentCalculationService {
    private readonly calculateShipmentEndpoint = `${environment.API_GATEWAY}/calculate/shipment`;
    private readonly guestSessionEndpoint = `${environment.API_GATEWAY}/guest/session`;

    constructor(private readonly http: HttpClient) {}

    calculateShipment(orderId: string, state: string): Observable<ShipmentCalculationResponse> {
        return this.calculateShipmentRequest({
            order_id: orderId,
            state
        }).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.calculateShipmentRequest({
                        order_id: orderId,
                        state
                    }))
                )
            )
        );
    }

    private calculateShipmentRequest(payload: ShipmentCalculationPayload): Observable<ShipmentCalculationResponse> {
        return this.http.post<{ shipment_cost?: unknown }>(this.calculateShipmentEndpoint, payload, {
            withCredentials: true
        }).pipe(
            map((response) => {
                const rawShipmentCost = response?.shipment_cost;
                const shipmentCost = typeof rawShipmentCost === 'number'
                    ? rawShipmentCost
                    : typeof rawShipmentCost === 'string'
                        ? Number(rawShipmentCost)
                        : NaN;

                return {
                    shipmentCost: Number.isFinite(shipmentCost) ? shipmentCost : null
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
