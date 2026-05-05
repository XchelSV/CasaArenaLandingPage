import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItem } from '../interfaces/cart-item.interface';
import { ValidatedCartResponse } from '../interfaces/validated-cart-response.interface';

@Injectable({
    providedIn: 'root'
})
export class CartValidationService {
    private readonly validateCartEndpoint = `${environment.API_GATEWAY}/validate/cart`;
    private readonly guestSessionEndpoint = `${environment.API_GATEWAY}/guest/session`;

    constructor(private readonly http: HttpClient) {}

    validateCart(cartItems: CartItem[]): Observable<ValidatedCartResponse> {
        return this.validateCartRequest(cartItems).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.validateCartRequest(cartItems))
                )
            )
        );
    }

    private validateCartRequest(cartItems: CartItem[]): Observable<ValidatedCartResponse> {
        return this.http.post<CartItem[] | { cart?: CartItem[]; order_id?: unknown }>(this.validateCartEndpoint, cartItems, {
            withCredentials: true
        }).pipe(
            map((response) => {
                if (Array.isArray(response)) {
                    return {
                        cart: response,
                        orderId: null
                    };
                }

                return {
                    cart: Array.isArray(response?.cart) ? response.cart : [],
                    orderId: typeof response?.order_id === 'string' || typeof response?.order_id === 'number'
                        ? String(response.order_id)
                        : null
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
