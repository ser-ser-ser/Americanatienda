'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, DollarSign, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({ stores: 0, users: 0, pending: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true })
            const { count: pendingCount } = await supabase.from('stores').select('*', { count: 'exact', head: true }).eq('status', 'pending')
            // Profiles count not always accessible due to RLS, relying on stores for now as proxy for activity

            setStats({
                stores: storesCount || 0,
                users: 0,
                pending: pendingCount || 0
            })
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
            </div>
        </div>
    )
}
