export const ORDER_STATUSES = [
  'VALIDATED',
  'APPROVED',
  'PENDING',
  'AUTHORIZED',
  'IN_PROCESS',
  'IN_MEDIATION',
  'REJECTED',
  'CANCELLED',
  'REFUNDED',
  'CHARGED_BACK',
  'SENT',
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export const DELIVERY_COMPANIES = ['DHL', 'FEDEX', 'UPS'] as const;

export type DeliveryCompany = typeof DELIVERY_COMPANIES[number];

export interface BackofficeOrder {
  [key: string]: unknown;
}

export interface OrdersResponse {
  orders: BackofficeOrder[];
  nextToken: string | null;
}
