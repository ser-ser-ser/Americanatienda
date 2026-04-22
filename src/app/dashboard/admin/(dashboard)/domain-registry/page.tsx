'use client'

import React, { useState, useEffect } from 'react'
import { Globe, ShieldCheck, CheckCircle2, XCircle, Loader2, Search, ExternalLink, Activity, Database, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface Integration {
    id: string
    store_id: string
    custom_domain: string
    status: 'pending' | 'active' | 'error'
    created_at: string
    stores: {
        name: string
        owner_id: string
    }
}

export default function AdminDomainRegistryPage() {
    const [loading, setLoading] = useState(true)
    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchIntegrations()
    }, [])

    async function fetchIntegrations() {
        setLoading(true)
        const { data, error } = await supabase
            .from('integrations')
            .select(`
                *,
                stores (
                    name,
                    owner_id
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching integrations:', error)
            toast.error('Failed to load domain registry')
        } else {
            setIntegrations(data || [])
        }
        setLoading(false)
    }

    const filteredIntegrations = integrations.filter(integ =>
        integ.custom_domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integ.stores?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleStatusUpdate = async (id: string, newStatus: 'active' | 'error') => {
        const { error } = await supabase
            .from('integrations')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            toast.error('Failed to update status')
        } else {
            toast.success(`Domain marked as ${newStatus}`)
            fetchIntegrations()
        }
    }

    return (
        <div className="p-8 bg-[#0a0a0a] min-h-screen text-white font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Domain <span className="text-[#ff007f]">Registry</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Global management of all vendor custom domains and edge connectivity.</p>
                </div>

                <div className="flex gap-3">
                    <Button onClick={fetchIntegrations} variant="outline" className="border-white/10 text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest bg-white/5">
                        <Activity className="mr-2 h-3.5 w-3.5" /> Refresh Hub
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card className="bg-zinc-900/30 border-white/5 p-6 border-l-2 border-l-[#ff007f]">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Managed</div>
                    <div className="text-3xl font-black text-white">{integrations.length}</div>
                </Card>
                <Card className="bg-zinc-900/30 border-white/5 p-6 border-l-2 border-l-green-500">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Active Edge</div>
                    <div className="text-3xl font-black text-green-500">
                        {integrations.filter(i => i.status === 'active').length}
                    </div>
                </Card>
                <Card className="bg-zinc-900/30 border-white/5 p-6 border-l-2 border-l-amber-500">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Pending DNS</div>
                    <div className="text-3xl font-black text-amber-500">
                        {integrations.filter(i => i.status === 'pending').length}
                    </div>
                </Card>
                <Card className="bg-zinc-900/30 border-white/5 p-6 border-l-2 border-l-red-500">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sync Errors</div>
                    <div className="text-3xl font-black text-red-500">
                        {integrations.filter(i => i.status === 'error').length}
                    </div>
                </Card>
            </div>

            {/* Filter Terminal */}
            <div className="mb-8 relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-zinc-500" />
                </div>
                <Input
                    type="text"
                    placeholder="filter-by-domain-or-store-name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-14 pr-32 bg-zinc-900/50 border-white/5 text-white text-sm font-bold rounded-2xl focus:border-[#ff007f]/50 transition-all placeholder:text-zinc-700 font-mono"
                />
            </div>

            {/* Registry Table */}
            <Card className="bg-[#0d0d0d] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/40">
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Store Entity</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Custom Domain</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Edge Status</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Registered At</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <Loader2 className="h-10 w-10 text-[#ff007f] animate-spin mx-auto mb-4" />
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Synching Master Registry...</span>
                                    </td>
                                </tr>
                            ) : filteredIntegrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <AlertCircle className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">No Active Integrations Found</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredIntegrations.map((integ) => (
                                    <tr key={integ.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-black border border-white/10 flex items-center justify-center font-black text-[#ff007f] text-xs">
                                                    {integ.stores?.name?.[0].toUpperCase() || 'S'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm tracking-tight">{integ.stores?.name}</div>
                                                    <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">ID: {integ.store_id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono text-xs">{integ.custom_domain}</span>
                                                <ExternalLink className="h-3 w-3 text-zinc-700 group-hover:text-[#ff007f] transition-colors cursor-pointer" />
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {integ.status === 'active' ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-black rounded-sm px-2">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE
                                                </Badge>
                                            ) : integ.status === 'pending' ? (
                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black rounded-sm px-2 animate-pulse">
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" /> PENDING DNS
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black rounded-sm px-2">
                                                    <XCircle className="h-3 w-3 mr-1" /> ERROR
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                                {new Date(integ.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-[8px] text-zinc-700 font-bold mt-1">
                                                {new Date(integ.created_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {integ.status !== 'active' && (
                                                    <Button
                                                        onClick={() => handleStatusUpdate(integ.id, 'active')}
                                                        size="sm"
                                                        className="h-8 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 text-[9px] font-black uppercase tracking-widest"
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"
                                                >
                                                    <Database className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Technical Help */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-medium text-zinc-600">
                <div className="bg-zinc-900/10 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Propagation Protocol</h4>
                    <p className="leading-relaxed">
                        Americana Edge uses Anycast IP addresses. When a domain is approved, we initiate the certificate issuance via Let's Encrypt.
                        Global propagation usually finishes in under 5 minutes. If a domain remains 'Pending', verify that the vendor has pointed their
                        CNAME record to <span className="text-[#ff007f]">ingress.americana.shop</span>.
                    </p>
                </div>
                <div className="bg-zinc-900/10 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Infrastructure Monitor</h4>
                    <p className="leading-relaxed">
                        The registry syncs with the Vercel Domains API every 60 seconds. Domain mismatches or SSL failures trigger automated
                        re-verification attempts. If an integration persists in 'Error' status, check the <span className="text-cyan-500">System Logs</span> for
                        specific API response codes.
                    </p>
                </div>
            </div>
        </div>
    )
}
