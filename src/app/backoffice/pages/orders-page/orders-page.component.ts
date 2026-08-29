import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ORDER_STATUSES, BackofficeOrder, OrderStatus } from '../../interfaces/orders.interface';
import { CognitoAuthService } from '../../services/cognito-auth.service';
import { OrdersService } from '../../services/orders.service';
import { environment } from 'src/environments/environment';

type OrderProduct = Record<string, unknown>;

interface ShipmentField {
  key: string;
  label: string;
}

@Component({
  selector: 'app-backoffice-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
  standalone: false,
})
export class OrdersPageComponent implements OnInit {
  readonly statuses = ORDER_STATUSES;
  readonly pageSize = 25;
  readonly cdnUrl = environment.CDN_URL;
  readonly shipmentFields: ShipmentField[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo electrónico' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'address', label: 'Dirección' },
    { key: 'neighborhood', label: 'Colonia' },
    { key: 'cp', label: 'Código postal' },
    { key: 'city', label: 'Ciudad' },
    { key: 'state', label: 'Estado' },
  ];
  private readonly hiddenColumns = new Set([
    'weight',
    'shipment_details',
    'products',
    'client',
    'total',
  ]);

  orders: BackofficeOrder[] = [];
  selectedStatus: OrderStatus = 'APPROVED';
  nextToken: string | null = null;
  isLoading = false;
  isLoadingMore = false;
  errorMessage = '';
  selectedOrder: BackofficeOrder | null = null;
  isOrderModalClosing = false;
  private loadedProductImages = new Set<string>();
  private modalCloseTimer?: number;

  constructor(
    private readonly auth: CognitoAuthService,
    private readonly ordersService: OrdersService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadOrders();
  }

  async onStatusChange(): Promise<void> {
    this.orders = [];
    this.nextToken = null;
    this.closeOrder();
    await this.loadOrders();
  }

  async loadMore(): Promise<void> {
    if (!this.nextToken || this.isLoading || this.isLoadingMore) {
      return;
    }

    await this.loadOrders(this.nextToken);
  }

  async signOut(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/backoffice/login']);
  }

  @HostListener('document:keydown.escape')
  closeOrder(): void {
    if (!this.selectedOrder || this.isOrderModalClosing) {
      return;
    }

    this.isOrderModalClosing = true;
    this.modalCloseTimer = window.setTimeout(() => {
      this.selectedOrder = null;
      this.isOrderModalClosing = false;
      this.loadedProductImages = new Set();
    }, 180);
  }

  openOrder(order: BackofficeOrder): void {
    if (this.modalCloseTimer !== undefined) {
      window.clearTimeout(this.modalCloseTimer);
      this.modalCloseTimer = undefined;
    }

    this.loadedProductImages = new Set();
    this.isOrderModalClosing = false;
    this.selectedOrder = order;
  }

  get columnNames(): string[] {
    const columns = new Set<string>();

    for (const order of this.orders) {
      Object.keys(order)
        .filter((key) => !this.hiddenColumns.has(key))
        .forEach((key) => columns.add(key));
    }

    const orderedColumns = [...columns];
    const statusIndex = orderedColumns.indexOf('status');
    const derivedColumns = ['client', 'products', 'total'];

    if (statusIndex >= 0) {
      orderedColumns.splice(statusIndex + 1, 0, ...derivedColumns);
      return orderedColumns;
    }

    return [...orderedColumns, ...derivedColumns];
  }

  getColumnLabel(column: string): string {
    if (column === 'client') {
      return 'Cliente';
    }

    if (column === 'products') {
      return 'Productos';
    }

    if (column === 'total') {
      return 'Total';
    }

    return column;
  }

  getColumnValue(order: BackofficeOrder, column: string): unknown {
    if (column === 'client') {
      return this.getCustomerName(order);
    }

    if (column === 'products') {
      return this.getProductsQuantity(order);
    }

    if (column === 'total') {
      return this.getOrderTotal(order);
    }

    return order[column];
  }

  formatCellValue(value: unknown, column: string): string {
    if (value === null || value === undefined) {
      return '—';
    }

    if (column === 'created_at') {
      return this.formatCreatedAt(value);
    }

    if (column === 'total' && typeof value === 'number') {
      return value.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  getOrderReference(order: BackofficeOrder, ...keys: string[]): string {
    for (const key of keys) {
      const value = order[key];

      if ((typeof value === 'string' && value.trim().length > 0) || typeof value === 'number') {
        return String(value);
      }
    }

    return '—';
  }

  getOrderProducts(order: BackofficeOrder): OrderProduct[] {
    const products = order['products'];

    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter((product): product is OrderProduct =>
      product !== null && typeof product === 'object' && !Array.isArray(product),
    );
  }

  getProductName(product: OrderProduct): string {
    const title = product['title'];
    return typeof title === 'string' && title.trim().length > 0 ? title : 'Producto sin nombre';
  }

  getProductImage(product: OrderProduct): string | null {
    const imagePath = product['imagePath'];
    return typeof imagePath === 'string' && imagePath.trim().length > 0
      ? `${this.cdnUrl}${imagePath}`
      : null;
  }

  isProductImageLoaded(imageUrl: string): boolean {
    return this.loadedProductImages.has(imageUrl);
  }

  onProductImageLoad(imageUrl: string): void {
    this.loadedProductImages = new Set(this.loadedProductImages).add(imageUrl);
  }

  getProductQuantity(product: OrderProduct): number {
    const quantity = this.toNumber(product['quantity']);
    return Number.isFinite(quantity) ? quantity : 0;
  }

  getProductPrice(product: OrderProduct): number {
    const price = this.toNumber(product['price']);
    return Number.isFinite(price) ? price : 0;
  }

  getProductPresentation(product: OrderProduct): string | null {
    const presentation = product['presentationLabel'];
    return typeof presentation === 'string' && presentation.trim().length > 0 ? presentation : null;
  }

  getShipmentFieldValue(order: BackofficeOrder, key: string): string {
    const shipmentDetails = order['shipment_details'];

    if (!shipmentDetails || typeof shipmentDetails !== 'object' || Array.isArray(shipmentDetails)) {
      return '—';
    }

    const value = (shipmentDetails as Record<string, unknown>)[key];
    return (typeof value === 'string' && value.trim().length > 0) || typeof value === 'number'
      ? String(value)
      : '—';
  }

  getOrderSubtotal(order: BackofficeOrder): number {
    return this.getOrderProducts(order).reduce(
      (total, product) => total + (this.getProductPrice(product) * this.getProductQuantity(product)),
      0,
    );
  }

  getShipmentCost(order: BackofficeOrder): number {
    const shipmentCost = this.toNumber(order['shipment_cost']);
    return Number.isFinite(shipmentCost) ? shipmentCost : 0;
  }

  formatAmount(value: number): string {
    return value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private async loadOrders(nextToken?: string): Promise<void> {
    const isFirstPage = !nextToken;
    this.errorMessage = '';

    if (isFirstPage) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    const session = await this.auth.getSession();
    if (!session) {
      this.errorMessage = 'La sesión expiró. Inicia sesión de nuevo.';
      this.isLoading = false;
      this.isLoadingMore = false;
      return;
    }

    this.ordersService.getOrders(session.accessToken, this.selectedStatus, nextToken).pipe(
      finalize(() => {
        this.isLoading = false;
        this.isLoadingMore = false;
      }),
    ).subscribe({
      next: (response) => {
        this.orders = isFirstPage ? response.orders : [...this.orders, ...response.orders];
        this.nextToken = response.nextToken;
      },
      error: () => {
        this.errorMessage = 'No fue posible obtener los pedidos. Intenta nuevamente.';
      },
    });
  }

  private getCustomerName(order: BackofficeOrder): string {
    const shipmentDetails = order['shipment_details'];

    if (!shipmentDetails || typeof shipmentDetails !== 'object' || Array.isArray(shipmentDetails)) {
      return '—';
    }

    const name = (shipmentDetails as Record<string, unknown>)['name'];
    return typeof name === 'string' && name.trim().length > 0 ? name : '—';
  }

  private getProductsQuantity(order: BackofficeOrder): number {
    const products = order['products'];

    if (!Array.isArray(products)) {
      return 0;
    }

    return products.reduce((quantity, product) => {
      if (!product || typeof product !== 'object' || Array.isArray(product)) {
        return quantity;
      }

      const rawQuantity = (product as Record<string, unknown>)['quantity'];
      const normalizedQuantity = this.toNumber(rawQuantity);

      return Number.isFinite(normalizedQuantity) ? quantity + normalizedQuantity : quantity;
    }, 0);
  }

  getOrderTotal(order: BackofficeOrder): number {
    return this.getOrderSubtotal(order) + this.getShipmentCost(order);
  }

  private formatCreatedAt(value: unknown): string {
    const timestamp = this.toNumber(value);
    const date = Number.isFinite(timestamp)
      ? new Date(timestamp * 1000)
      : value instanceof Date
        ? value
        : new Date(typeof value === 'string' ? value : '');

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Etc/GMT+6',
      hour12: false,
    }).format(date);
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return Number(value);
    }

    return NaN;
  }
}
