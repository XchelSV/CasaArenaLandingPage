import { CartItem } from './cart-item.interface';
import { ShipmentDetails } from './shipment-details.interface';

export interface PaymentPreferenceStatusResponse {
    status: string | null;
    products: CartItem[];
    shipmentCost: number | null;
    shipmentDetails: ShipmentDetails | null;
}
