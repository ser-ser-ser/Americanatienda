'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { Search, Mail, Calendar, ShoppingBag } from 'lucide-react'

type Buyer = {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    created_at: string
    total_orders?: number
    total_spent?: number
}

export default function BuyersPage() {
    const [buyers, setBuyers] = useState<Buyer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchBuyers()
    }, [])

    async function fetchBuyers() {
        try {
            // Get all users with buyer role
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'buyer')
                .order('created_at', { ascending: false })

            if (error) throw error

            // Get order stats for each buyer
            const buyersWithStats = await Promise.all(
                (profiles || []).map(async (profile: any) => {
                    const { data: orders } = await supabase
                        .from('orders')
                        .select('total, status')
                        .eq('user_id', profile.id)
                        .eq('status', 'completed')

                    const totalOrders = orders?.length || 0
                    const totalSpent = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0

                    return {
                        id: profile.id,
                        email: profile.email || 'No email',
                        full_name: profile.full_name || 'Anonymous',
                        avatar_url: profile.avatar_url,
                        created_at: profile.created_at,
                        total_orders: totalOrders,
                        total_spent: totalSpent
                    }
                })
            )

            setBuyers(buyersWithStats)
        } catch (error) {
            console.error('Error fetching buyers:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredBuyers = buyers.filter(buyer =>
        buyer.full_name.toLowerCase().includes(search.toLowerCase()) ||
        buyer.email.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Buyers</h1>
                <p className="text-gray-600">Manage and view all registered buyers</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search buyers by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Buyers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{buyers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Buyers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {buyers.filter(b => (b.total_orders || 0) > 0).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${buyers.reduce((sum, b) => sum + (b.total_spent || 0), 0).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Buyers List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Buyers ({filteredBuyers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredBuyers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {search ? 'No buyers found matching your search' : 'No buyers yet'}
                            </div>
                        ) : (
                            filteredBuyers.map((buyer) => (
                                <div
                                    key={buyer.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={buyer.avatar_url} />
                                            <AvatarFallback>
                                                {buyer.full_name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{buyer.full_name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-3 w-3" />
                                                {buyer.email}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Joined {new Date(buyer.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ShoppingBag className="h-3 w-3" />
                                                    {buyer.total_orders || 0} orders
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">
                                            ${(buyer.total_spent || 0).toFixed(2)}
                                        </div>
                                        <Badge variant={(buyer.total_orders || 0) > 0 ? 'default' : 'secondary'}>
                                            {(buyer.total_orders || 0) > 0 ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
