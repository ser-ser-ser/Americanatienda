
import { NextResponse } from 'next/server';
import { ShippingFactory } from '@/lib/shipping/shipping-factory';
import { ShippingAddress, ShippingItem, ShippingRate } from '@/lib/shipping/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { storeId, address, items } = body;

        if (!storeId || !address) {
            return NextResponse.json({ error: 'Missing storeId or address' }, { status: 400 });
        }

        // 1. Try Local Delivery
        const localProvider = await ShippingFactory.createProvider(storeId, 'local');
        let localRates: ShippingRate[] = [];
        if (localProvider) {
            localRates = await localProvider.getRates(address, address, items);
        }

        // 2. Try National Shipping
        const nationalProvider = await ShippingFactory.createProvider(storeId, 'national');
        let nationalRates: ShippingRate[] = [];
        if (nationalProvider) {
            nationalRates = await nationalProvider.getRates(address, address, items);
        }

        const allRates = [...localRates, ...nationalRates];

        return NextResponse.json({ rates: allRates });

    } catch (error) {
        console.error('Shipping Rates Error:', error);
        return NextResponse.json({ error: 'Failed to calculate rates' }, { status: 500 });
    }
}
