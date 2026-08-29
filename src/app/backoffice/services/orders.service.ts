import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BackofficeOrder, OrdersResponse, OrderStatus } from '../interfaces/orders.interface';
import { environment } from 'src/environments/environment';

interface OrdersApiResponse {
  orders?: unknown;
  next_token?: unknown;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly ordersEndpoint = `${environment.API_GATEWAY}/orders`;

  constructor(private readonly http: HttpClient) {}

  getOrders(
    accessToken: string,
    status: OrderStatus,
    nextToken?: string,
  ): Observable<OrdersResponse> {
    let params = new HttpParams()
      .set('status', status)
      .set('limit', '25');

    if (nextToken) {
      params = params.set('next_token', nextToken);
    }

    return this.http.get<OrdersApiResponse>(this.ordersEndpoint, {
      params,
      headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }),
    }).pipe(
      map((response) => ({
        orders: this.normalizeOrders(response?.orders),
        nextToken: typeof response?.next_token === 'string' && response.next_token.length > 0
          ? response.next_token
          : null,
      })),
    );
  }

  private normalizeOrders(value: unknown): BackofficeOrder[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((order): order is BackofficeOrder =>
      order !== null && typeof order === 'object' && !Array.isArray(order),
    );
  }
}
