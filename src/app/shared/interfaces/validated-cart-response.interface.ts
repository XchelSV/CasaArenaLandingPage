import { CartItem } from './cart-item.interface';

export interface ValidatedCartResponse {
    cart: CartItem[];
    orderId: string | null;
}
