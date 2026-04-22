
import { ShippingProvider } from '../shipping-provider.interface';
import { ShippingAddress, ShippingItem, ShippingRate, ShippingLabel, TrackingInfo } from '../types';

export class ManualAdapter implements ShippingProvider {
    id = 'manual-local';
    private basePrice: number;
    private radiusKm: number;

    constructor(config: { basePrice: number; radiusKm: number }) {
        this.basePrice = config.basePrice;
        this.radiusKm = config.radiusKm;
    }

    async getRates(
        origin: ShippingAddress,
        destination: ShippingAddress,
        items: ShippingItem[]
    ): Promise<ShippingRate[]> {
        // Simple logic: If inside radius (mocked), return base price
        // In reality, we would calculate Haversine distance here
        return [{
            provider_id: this.id,
            service_name: 'Entrega Local (Directo)',
            price: this.basePrice,
            currency: 'MXN',
            estimated_days: 0,
            estimated_arrival: 'Same Day'
        }];
    }

    async createLabel(
        origin: ShippingAddress,
        destination: ShippingAddress,
        items: ShippingItem[],
        serviceCode: string
    ): Promise<ShippingLabel> {
        return {
            tracking_number: `LOC-${Date.now()}`,
            carrier_code: 'manual',
            status: 'created',
            tracking_url: '#' // No real tracking for manual delivery
        };
    }

    async trackShipment(trackingId: string): Promise<TrackingInfo> {
        return {
            status: 'in_transit',
            history: [
                { status: 'created', timestamp: new Date().toISOString() }
            ]
        };
    }
}
