
export interface ShippingAddress {
    street_line_1: string;
    street_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string; // 'MX', 'US'
    latitude?: number;
    longitude?: number;
}

export interface ShippingItem {
    id: string;
    name: string;
    weight_kg?: number;
    dimensions_cm?: {
        length: number;
        width: number;
        height: number;
    };
    quantity: number;
    price: number;
}

export interface ShippingRate {
    provider_id: string; // 'uber', 'dhl', 'manual-local'
    service_name: string; // 'Uber Flash', 'Standard Ground'
    price: number;
    currency: string;
    estimated_days?: number;
    estimated_arrival?: string;
}

export interface ShippingLabel {
    tracking_number: string;
    carrier_code: string;
    label_url?: string;
    tracking_url?: string;
    status: 'pending' | 'created' | 'failed';
    provider_order_id?: string;
}

export interface TrackingInfo {
    status: 'pending' | 'in_transit' | 'delivered' | 'exception';
    current_location?: string;
    estimated_delivery?: string;
    history: {
        status: string;
        location?: string;
        timestamp: string;
    }[];
}
