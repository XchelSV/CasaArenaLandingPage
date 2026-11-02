import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BackofficeOrder,
  DeliveryCompany,
  OrderEmail,
  OrderEmailsResponse,
  OrdersResponse,
  OrderStatus,
} from '../interfaces/orders.interface';
import { environment } from 'src/environments/environment';

interface OrdersApiResponse {
  orders?: unknown;
  next_token?: unknown;
}

interface OrderEmailsApiResponse {
  emails?: unknown;
  count?: unknown;
}

interface ShipmentCodePayload {
  order_id: string;
  shipment_code: string;
  delivery_company: DeliveryCompany;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly ordersEndpoint = `${environment.API_GATEWAY}/orders`;
  private readonly orderEmailsEndpoint = `${environment.API_GATEWAY}/orders/emails`;
  private readonly shipmentCodeEndpoint = `${environment.API_GATEWAY}/shipment/code`;

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

  saveShipmentCode(accessToken: string, payload: ShipmentCodePayload): Observable<unknown> {
    return this.http.post(this.shipmentCodeEndpoint, payload, {
      headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }),
    });
  }

  getOrderEmails(accessToken: string, orderId: string): Observable<OrderEmailsResponse> {
    const params = new HttpParams().set('order_id', orderId);

    return this.http.get<OrderEmailsApiResponse>(this.orderEmailsEndpoint, {
      params,
      headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }),
    }).pipe(
      map((response) => {
        const emails = this.normalizeOrderEmails(response?.emails);
        const count = typeof response?.count === 'number' && Number.isFinite(response.count)
          ? response.count
          : emails.length;

        return { emails, count };
      }),
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

  private normalizeOrderEmails(value: unknown): OrderEmail[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((email): email is Record<string, unknown> =>
        email !== null && typeof email === 'object' && !Array.isArray(email),
      )
      .map((email) => ({
        order_id: this.getStringValue(email['order_id']),
        created_at: this.getStringValue(email['created_at']),
        message_id: this.getStringValue(email['message_id']),
        type: this.getStringValue(email['type']),
        subject: this.getStringValue(email['subject']),
        status: this.getNullableStringValue(email['status']),
      }));
  }

  private getStringValue(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private getNullableStringValue(value: unknown): string | null {
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
  }
}
