import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
    providedIn: 'root'
})
export class CartValidationService {
    private readonly validateCartEndpoint = `${environment.API_GATEWAY}/validate/cart`;
    private readonly guestSessionEndpoint = `${environment.API_GATEWAY}/guest/session`;

    constructor(private readonly http: HttpClient) {}

    validateCart(cartItems: CartItem[]): Observable<CartItem[]> {
        return this.validateCartRequest(cartItems).pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.validateCartRequest(cartItems))
                )
            )
        );
    }

    private validateCartRequest(cartItems: CartItem[]): Observable<CartItem[]> {
        return this.http.post<CartItem[]>(this.validateCartEndpoint, cartItems, {
            withCredentials: true
        }).pipe(
            map((items) => Array.isArray(items) ? items : [])
        );
    }

    private createGuestSession(): Observable<unknown> {
        return this.http.post(this.guestSessionEndpoint, null, {
            withCredentials: true,
            observe: 'response'
        });
    }
}
