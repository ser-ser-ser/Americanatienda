
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DollarSign,
    TrendingUp,
    Users,
    Globe,
    ArrowUpRight,
    Download,
    CreditCard,
    Wallet,
    Loader2
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { toast } from 'sonner'

type TimeFilter = '3d' | '30d' | '90d' | '1y'

export default function AdminFinancePage() {
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<TimeFilter>('30d')
    const [analytics, setAnalytics] = useState<any>(null)

    useEffect(() => {
        fetchAnalytics()
    }, [filter])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/finance/analytics?filter=${filter}`)
            if (!res.ok) throw new Error('Failed to fetch analytics')
            const data = await res.json()
            setAnalytics(data)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = () => {
        if (!analytics) return

        const csv = [
            ['Metric', 'Value'],
            ['Total GMV', `$${analytics.stats.totalGMV.toFixed(2)}`],
            ['Net Revenue (10%)', `$${analytics.stats.netRevenue.toFixed(2)}`],
            ['Domain Sales', `$${analytics.stats.domainSales.toFixed(2)}`],
            ['Pending Payouts', `$${analytics.stats.pendingPayouts.toFixed(2)}`],
            ['Order Count', analytics.orderCount]
        ].map(row => row.join(',')).join('\\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `finance-report-${filter}-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Report exported successfully')
    }

    const handleSettlement = () => {
        toast.info('Settlement Mode: Coming soon - Payoneer Mass Payouts integration')
    }

    if (loading && !analytics) {
        return (
            <div className="p-8 min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Matrix Finance</h1>
                    <p className="text-zinc-500">Global oversight of marketplace revenue and commissions.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-2 mr-4">
                        {(['3d', '30d', '90d', '1y'] as TimeFilter[]).map((f) => (
                            <Button
                                key={f}
                                size="sm"
                                variant={filter === f ? 'default' : 'outline'}
                                className={filter === f ? 'bg-rose-600' : 'border-zinc-800'}
                                onClick={() => setFilter(f)}
                            >
                                {f === '3d' ? '3 Days' : f === '30d' ? '30 Days' : f === '90d' ? '90 Days' : '1 Year'}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        className="border-zinc-800 text-white hover:bg-zinc-900 rounded-full"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6"
                        onClick={handleSettlement}
                    >
                        Settlement Mode
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Total GMV",
                        value: `$${analytics?.stats.totalGMV?.toFixed(2) || '0.00'}`,
                        icon: DollarSign,
                        trend: "+12.5%",
                        color: "text-emerald-500"
                    },
                    {
                        title: "Net Revenue (10%)",
                        value: `$${analytics?.stats.netRevenue?.toFixed(2) || '0.00'}`,
                        icon: TrendingUp,
                        trend: "+8.2%",
                        color: "text-emerald-500"
                    },
                    {
                        title: "Domain Sales",
                        value: `$${analytics?.stats.domainSales?.toFixed(2) || '0.00'}`,
                        icon: Globe,
                        trend: "Coming Soon",
                        color: "text-zinc-500"
                    },
                    {
                        title: "Pending Payouts",
                        value: `$${analytics?.stats.pendingPayouts?.toFixed(2) || '0.00'}`,
                        icon: Wallet,
                        trend: "TODO",
                        color: "text-zinc-500"
                    },
                ].map((stat, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className={`text-xs mt-1 ${stat.color} flex items-center`}>
                                {stat.trend} {stat.trend.includes('%') && <span className="ml-1 text-zinc-600">from last period</span>}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription className="text-zinc-500">Comparison between GMV and marketplace commission</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {analytics?.chartData?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.chartData}>
                                    <defs>
                                        <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="gmv" stroke="#e11d48" fillOpacity={1} fill="url(#colorGmv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500">
                                No transaction data for selected period
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Stores */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Top Performing Stores</CardTitle>
                        <CardDescription className="text-zinc-500">Revenue leaders this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics?.topStores?.length > 0 ? (
                                analytics.topStores.map((store: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <span className="text-xs font-bold text-zinc-400">#{i + 1}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium truncate max-w-[120px]">{store.name}</p>
                                                <p className="text-[10px] text-zinc-500">Store</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">${store.revenue.toFixed(2)}</p>
                                            <p className="text-[10px] text-emerald-500">GMV</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-zinc-500 text-sm py-8">
                                    No stores with sales yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
