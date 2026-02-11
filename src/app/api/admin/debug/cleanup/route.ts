
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') // 'check' or 'clean'

    // 1. Find Admin
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    // Admin checking via auth admin might need service key if not available in client
    // So we use standard query if listUsers fails or just query stores by name

    // Actually, for this debug route, let's trusting store names.
    const targetNames = ['The Red Room', 'The Lounge']
    const { data: stores } = await supabase.from('stores').select('*').in('name', targetNames)

    if (!stores) return NextResponse.json({ error: 'No stores found' })

    interface ReportItem {
        name: any;
        id: any;
        products: number | null;
        orders: number | null;
        team_count: number;
        status: any;
        action?: string;
    }

    const report: ReportItem[] = []

    for (const store of stores) {
        // Count Data
        const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id)
        const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', store.id)

        // Count Team
        const { data: team } = await supabase.from('store_members').select('id, user_id, role').eq('store_id', store.id)

        report.push({
            name: store.name,
            id: store.id,
            products,
            orders,
            team_count: team?.length || 0,
            status: store.status
        })

        if (mode === 'clean') {
            // DELETE DATA
            if (products && products > 0) {
                await supabase.from('products').delete().eq('store_id', store.id)
            }
            if (orders && orders > 0) {
                await supabase.from('orders').delete().eq('store_id', store.id)
            }
            report[report.length - 1].action = 'CLEANED_DATA'
        }

        if (mode === 'clean_team') {
            // Find Admin In Team
            // We reuse the admin user found at start (if any) or just remove the owner if they are in the member list
            // The User said "Remove Americana Market".
            // We assume the Admin is the owner.
            if (store.owner_id) {
                const adminMember = team?.find(m => m.user_id === store.owner_id)
                if (adminMember) {
                    await supabase.from('store_members').delete().eq('id', adminMember.id)
                    report[report.length - 1].action = 'REMOVED_ADMIN_FROM_TEAM'
                } else {
                    report[report.length - 1].action = 'ADMIN_NOT_IN_TEAM'
                }
            }
        }
    }

    return NextResponse.json({
        report,
        mode: mode || 'check',
        timestamp: new Date().toISOString()
    })
}
