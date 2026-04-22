
/**
 * WooCommerce Integration Service for Americana
 * Handles product and inventory synchronization via REST API
 */

export interface WooCommerceConfig {
    url: string;
    consumerKey: string;
    consumerSecret: string;
}

export interface WCProduct {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    regular_price: string;
    sale_price: string;
    stock_quantity: number;
    images: { src: string }[];
    categories: { name: string }[];
}

export class WooCommerceAdapter {
    private config: WooCommerceConfig;

    constructor(config: WooCommerceConfig) {
        this.config = config;
    }

    private getHeaders() {
        const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
        return {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Fetch all products from WooCommerce
     */
    async fetchProducts(page = 1, perPage = 20): Promise<WCProduct[]> {
        const url = new URL(`${this.config.url}/wp-json/wc/v3/products`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('per_page', perPage.toString());

        try {
            const response = await fetch(url.toString(), {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'WooCommerce API Error');
            }

            return await response.json();
        } catch (error: any) {
            console.error('WooCommerce Fetch Error:', error);
            throw error;
        }
    }

    /**
     * Map WC Product to Americana Product Format
     */
    static mapToAmericana(wcProduct: WCProduct, storeId: string) {
        return {
            name: wcProduct.name,
            description: wcProduct.description,
            price: parseFloat(wcProduct.regular_price || wcProduct.price),
            compare_at_price: wcProduct.sale_price ? parseFloat(wcProduct.regular_price) : null,
            image_url: wcProduct.images[0]?.src || '',
            stock: wcProduct.stock_quantity || 0,
            store_id: storeId,
            metadata: {
                external_id: wcProduct.id,
                source: 'woocommerce'
            }
        };
    }
}
