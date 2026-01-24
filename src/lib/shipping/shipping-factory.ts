
import { ShippingProvider } from './shipping-provider.interface';
import { ManualAdapter } from './adapters/manual';
import { createClient } from '@/utils/supabase/server';

export class ShippingFactory {
    static async createProvider(storeId: string, type: 'local' | 'national'): Promise<ShippingProvider | null> {
        const supabase = await createClient();

        const { data: config } = await supabase
            .from('shipping_configs')
            .select('*')
            .eq('store_id', storeId)
            .single();

        if (!config) return null;

        if (type === 'local' && config.local_delivery_enabled) {
            // Check if Uber is active in active_providers array (mock check)
            /* 
            if (config.active_providers.includes('uber')) {
                return new UberAdapter(apiKey...);
            } 
            */

            // Fallback to Manual Local Delivery
            return new ManualAdapter({
                basePrice: Number(config.local_base_price),
                radiusKm: Number(config.local_radius_km)
            });
        }

        if (type === 'national' && config.national_shipping_enabled) {
            /* 
           if (config.active_providers.includes('dhl')) {
               return new DHLAdapter(...);
           } 
           */

            // Fallback: simplified flat rate logic could be wrapped in a 'FlatRateAdapter'
            // For now returning null as we only implemented ManualAdapter
            return null;
        }

        return null;
    }
}
