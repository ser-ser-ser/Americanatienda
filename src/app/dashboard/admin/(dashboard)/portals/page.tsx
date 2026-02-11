'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, DollarSign, Layout } from 'lucide-react'

export default function StoresPortalsPage() {
    return (
        <div className="p-8 space-y-8 bg-black text-white min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-serif mb-2">Stores Portals Manager</h1>
                    <p className="text-zinc-400">Manage store positioning, boosts, and ad placements.</p>
                </div>
                <Button className="bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold">
                    <Layout className="mr-2 h-4 w-4" /> Configure Grid
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Popularity Boost */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <TrendingUp className="h-5 w-5 text-green-500" /> Popularity Boosts
                        </CardTitle>
                        <CardDescription>Stores paying for algorithmic boost</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                            No Active Boosts
                        </div>
                    </CardContent>
                </Card>

                {/* Featured / Hero Placement */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Star className="h-5 w-5 text-yellow-500" /> Featured Placements
                        </CardTitle>
                        <CardDescription>Stores featured on the Home Hero</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                                <span className="font-bold">The Lounge</span>
                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Slot 1</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                                <span className="font-bold">Red Room</span>
                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Slot 2</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ad Revenue */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <DollarSign className="h-5 w-5 text-blue-500" /> Ad Revenue
                        </CardTitle>
                        <CardDescription>Revenue from store placements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">$0.00</div>
                        <p className="text-xs text-zinc-500 mt-2">Current Month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
