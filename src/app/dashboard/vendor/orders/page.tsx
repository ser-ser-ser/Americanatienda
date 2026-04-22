'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useChat } from '@/providers/chat-provider'

export default function VendorOrdersPage() {
    const supabase = createClient()
    const { openContextualChat } = useChat()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Get Store
            const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single()
            if (!store) return

            // 2. Get Orders
            const { data, error } = await supabase
                .from('orders')
                .select('*') // Ideally join with items
                .eq('store_id', store.id)
                .order('created_at', { ascending: false })

            if (data) setOrders(data)
            setLoading(false)
        }
        fetchOrders()
    }, [])

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/vendor">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Orders Management</h1>
                            <p className="text-zinc-400">Track and fulfill your customer orders.</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-zinc-500">Loading orders...</div>
                ) : (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="p-12 text-center">
                                <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-zinc-400">No Orders Yet</h3>
                                <p className="text-zinc-600">When you make a sale, it will appear here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {orders.map(order => (
                                    <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-primary font-bold">#{order.id.slice(0, 8)}</span>
                                                <span className="text-zinc-500 text-sm">•</span>
                                                <span className="text-zinc-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-bold text-lg">{order.customer_name || 'Guest Customer'}</h4>
                                            <p className="text-sm text-zinc-500">{order.items_count || 1} items • ${order.total_amount}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-end">
                                                <Badge className={`uppercase ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                                                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' :
                                                        'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    }`}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    if (order.user_id) {
                                                        openContextualChat('order', order.id, [order.user_id], {
                                                            title: `Inquiry: Order #${order.id.slice(0, 8).toUpperCase()}`,
                                                            store_id: order.store_id
                                                        })
                                                    }
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-500 hover:text-white"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Chat
                                            </Button>

                                            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
