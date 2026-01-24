import { ShippingAddress, ShippingItem, ShippingRate, ShippingLabel, TrackingInfo } from './types';

export interface ShippingProvider {
    /**
     * Unique identifier for the provider (e.g., 'uber', 'dhl')
     */
    id: string;

    /**
     * Calculate shipping rates for a given destination and items.
     */
    getRates(
        origin: ShippingAddress,
        destination: ShippingAddress,
        items: ShippingItem[]
    ): Promise<ShippingRate[]>;

    /**
     * Create a shipping label/orders with the provider.
     */
    createLabel(
        origin: ShippingAddress,
        destination: ShippingAddress,
        items: ShippingItem[],
        serviceCode: string
    ): Promise<ShippingLabel>;

    /**
     * Track a shipment by its tracking ID.
     */
    trackShipment(trackingId: string): Promise<TrackingInfo>;
}
