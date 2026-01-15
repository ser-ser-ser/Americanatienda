'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, DollarSign, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({ stores: 0, pending: 0 })
    const [pendingStores, setPendingStores] = useState<any[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true })
            const { data: pending, count: pendingCount } = await supabase.from('stores').select('*').eq('status', 'pending')

            setStats({
                stores: storesCount || 0,
                pending: pendingCount || 0
            })
            setPendingStores(pending || [])
        }
        fetchStats()
    }, [])

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Admin Command Center</h1>
                    <p className="text-zinc-400">Platform overview and management.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Total Stores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white flex items-center">
                                <Store className="h-5 w-5 mr-2 text-primary" />
                                {stats.stores}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-yellow-500" />
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Platform Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                                $0.00
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Approvals List */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingStores.length === 0 ? (
                                <p className="text-zinc-500 text-sm">No pending stores.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingStores.map(store => (
                                        <div key={store.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium text-white">{store.name}</p>
                                                <p className="text-xs text-zinc-500">{new Date(store.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded">
                                                Pending
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity (Mocked) */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <div>
                                        <p className="text-sm text-white">New order received #1024</p>
                                        <p className="text-xs text-zinc-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm text-white">Vendor "The Lounge" updated profile</p>
                                        <p className="text-xs text-zinc-500">1 hour ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <div>
                                        <p className="text-sm text-white">System backup completed</p>
                                        <p className="text-xs text-zinc-500">5 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
