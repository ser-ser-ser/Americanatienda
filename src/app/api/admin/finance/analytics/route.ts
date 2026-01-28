import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/finance/analytics
 * Returns real marketplace financial data
 */
export async function GET(request: Request) {
    const supabase = await createClient()

    // Verify admin user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        // Parse query params for time filter
        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') || '30d' // '3d', '30d', '90d', '1y'

        // Calculate date range
        const now = new Date()
        let startDate = new Date()

        switch (filter) {
            case '3d':
                startDate.setDate(now.getDate() - 3)
                break
            case '30d':
                startDate.setDate(now.getDate() - 30)
                break
            case '90d':
                startDate.setDate(now.getDate() - 90)
                break
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1)
                break
        }

        // 1. Calculate Total GMV (Gross Merchandise Value)
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, shipping_cost, created_at, store_id')
            .gte('created_at', startDate.toISOString())
            .eq('status', 'paid') // Only count paid orders

        if (ordersError) throw ordersError

        const totalGMV = orders?.reduce((sum: number, order: any) => sum + (Number(order.total_amount) || 0), 0) || 0

        // 2. Calculate Net Revenue (Commission @ 10% of subtotal)
        const COMMISSION_RATE = 0.10
        const totalSubtotal = orders?.reduce((sum: number, order: any) => {
            const subtotal = (Number(order.total_amount) || 0) - (Number(order.shipping_cost) || 0)
            return sum + subtotal
        }, 0) || 0
        const netRevenue = totalSubtotal * COMMISSION_RATE

        // 3. Domain Sales (placeholder - will integrate with Spaceship API)
        const domainSales = 0 // TODO: Implement when domain service is ready

        // 4. Pending Payouts (sum of unpaid vendor balances)
        // TODO: Create vendor_payouts table
        const pendingPayouts = 0

        // 5. Revenue by Day (for chart)
        const revenueByDay = orders?.reduce((acc: any, order: any) => {
            const date = new Date(order.created_at).toLocaleDateString()
            if (!acc[date]) {
                acc[date] = { gmv: 0, revenue: 0 }
            }
            const orderTotal = Number(order.total_amount) || 0
            const orderShipping = Number(order.shipping_cost) || 0
            const orderSubtotal = orderTotal - orderShipping

            acc[date].gmv += orderTotal
            acc[date].revenue += orderSubtotal * COMMISSION_RATE
            return acc
        }, {})

        const chartData = Object.entries(revenueByDay || {}).map(([date, values]: any) => ({
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            gmv: values.gmv,
            revenue: values.revenue
        }))

        // 6. Top Performing Stores
        const storeRevenue = orders?.reduce((acc: any, order: any) => {
            if (!order.store_id) return acc
            if (!acc[order.store_id]) {
                acc[order.store_id] = 0
            }
            acc[order.store_id] += Number(order.total_amount) || 0
            return acc
        }, {})

        const topStores = Object.entries(storeRevenue || {})
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 5)
            .map(([store_id, revenue]) => ({ store_id, revenue }))

        // Fetch store names
        const storeIds = topStores.map(s => s.store_id)
        const { data: stores } = await supabase
            .from('stores')
            .select('id, name')
            .in('id', storeIds)

        const topStoresWithNames = topStores.map(ts => ({
            ...ts,
            name: stores?.find((s: any) => s.id === ts.store_id)?.name || 'Unknown Store'
        }))

        return NextResponse.json({
            stats: {
                totalGMV,
                netRevenue,
                domainSales,
                pendingPayouts
            },
            chartData,
            topStores: topStoresWithNames,
            orderCount: orders?.length || 0
        })

    } catch (error: any) {
        console.error('Finance Analytics Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
