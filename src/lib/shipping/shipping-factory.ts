import { ShippingProvider } from './shipping-provider.interface';
import { ManualAdapter } from './adapters/manual';
import { UberAdapter } from './adapters/uber-direct';
import { SoloEnviosAdapter } from './adapters/solo-envios';
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

        const activeProviders = config.active_providers as string[] || [];

        if (type === 'local' && config.local_delivery_enabled) {
            if (activeProviders.includes('uber')) {
                return new UberAdapter(process.env.UBER_API_KEY || 'mock-key');
            }

            return new ManualAdapter({
                basePrice: Number(config.local_base_price),
                radiusKm: Number(config.local_radius_km)
            });
        }

        if (type === 'national' && config.national_shipping_enabled) {
            if (activeProviders.includes('soloenvios')) {
                // In a real scenario, we'd fetch the API key from carrier_metadata
                const metadata = config.carrier_metadata as any || {};
                const soloEnviosKey = metadata.solo_envios_key || process.env.SOLOENVIO_API_KEY || 'mock-key';
                return new SoloEnviosAdapter(soloEnviosKey);
            }

            // Fallback to flat rate if no provider is configured
            return new ManualAdapter({
                basePrice: Number(config.national_flat_rate),
                radiusKm: 99999 // Global radius for national shipping fallback
            });
        }

        return null;
    }
}
