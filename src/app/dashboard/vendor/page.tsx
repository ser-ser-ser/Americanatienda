'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, TrendingUp, AlertTriangle, Loader2, DollarSign, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function VendorDashboardPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ revenue: 0, orders: 0, lowStock: 0 })
    const [recentOrders, setRecentOrders] = useState<any[]>([])

    useEffect(() => {
        const loadDashboard = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get Store ID
            const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single()

            if (store) {
                // Fetch Orders for this store
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('store_id', store.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (orders) {
                    setRecentOrders(orders)
                    // Calculate revenue (mock logic for now as we don't have full payments yet)
                    const totalRevenue = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0)
                    setStats(prev => ({ ...prev, revenue: totalRevenue, orders: orders.length }))
                }
            }

            setLoading(false)
        }
        loadDashboard()
    }, [])

    if (loading) {
        return <div className="p-8 text-white"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">Vendor Dashboard</h1>
                        <p className="text-zinc-400">Your business at a glance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white flex items-center">
                                <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                                {stats.revenue.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-1 text-blue-500" />
                                {stats.orders}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Inventory Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-1" />
                                Healthy
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold">Recent Orders</h3>
                        <Link href="/dashboard/vendor/orders" className="text-xs text-primary hover:underline">View All</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">No orders yet. Start promoting your store!</div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {recentOrders.map(order => (
                                <div key={order.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-mono text-sm">{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${order.total_amount}</p>
                                        <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full">{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
