
export type StoreType = 'sex-shop' | 'smoke-shop' | 'general';

export interface Category {
    id: string;
    name: string;
    slug: string;
    store_context: StoreType;
}

export interface ProductBase {
    id: string;
    store_id: string; // Linked Store
    sku: string;
    name: string;
    description: string;
    price: number;
    image_url: string; // Keep for legacy compatibility if needed
    images: string[] | null; // Multi-image support
    store_type: StoreType;
    category_id: string;
    slug: string;
}

export interface SexShopDetails {
    product_id: string;
    material?: string;
    body_safe?: boolean;
    vibration_modes?: number;
    waterproof?: boolean;
}

export interface SmokeShopDetails {
    product_id: string;
    material?: string;
    glass_thickness_mm?: number;
    piece_type?: string;
    percolator?: boolean;
}

// polymorphic type
export interface Product extends ProductBase {
    details_sex_shop?: SexShopDetails | null; // Joined table
    details_smoke_shop?: SmokeShopDetails | null; // Joined table
}

export interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    email: string;
    shipping_address: string;
    city: string;
    zip: string;
    items: any; // JSONB
    total_amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
}
