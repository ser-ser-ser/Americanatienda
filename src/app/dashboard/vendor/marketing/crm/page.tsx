'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    MessageSquare,
    MessageCircle,
    Zap,
    Clock,
    Search as SearchIcon,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Copy,
    Plus,
    Download,
    Eye,
    EyeOff,
    MoreHorizontal,
    ExternalLink,
    RefreshCw,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useVendor } from '@/providers/vendor-provider'

interface ResponseTemplate {
    id: string;
    title: string;
    category: string;
    content: string;
    used_count: number;
    updated_at: string;
    color: string;
}

export default function CRMStudioPage() {
    const { activeStore, refreshStores, isLoading: isVendorLoading } = useVendor()
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('Messaging CRM')

    const [formData, setFormData] = useState({
        crm_greeting_message: '',
        crm_away_message: '',
        crm_inquiry_message: '',
        crm_greeting_enabled: false,
        crm_away_enabled: false,
        crm_inquiry_enabled: false,
        crm_response_templates: [] as ResponseTemplate[]
    })

    useEffect(() => {
        if (activeStore) {
            setFormData({
                crm_greeting_message: activeStore.crm_greeting_message || '',
                crm_away_message: activeStore.crm_away_message || '',
                crm_inquiry_message: activeStore.crm_inquiry_message || '',
                crm_greeting_enabled: !!activeStore.crm_greeting_enabled,
                crm_away_enabled: !!activeStore.crm_away_enabled,
                crm_inquiry_enabled: !!activeStore.crm_inquiry_enabled,
                crm_response_templates: (activeStore.crm_response_templates as ResponseTemplate[]) || []
            })
        }
    }, [activeStore])

    const handleSave = async () => {
        if (!activeStore) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('stores')
                .update({
                    crm_greeting_message: formData.crm_greeting_message,
                    crm_away_message: formData.crm_away_message,
                    crm_inquiry_message: formData.crm_inquiry_message,
                    crm_greeting_enabled: formData.crm_greeting_enabled,
                    crm_away_enabled: formData.crm_away_enabled,
                    crm_inquiry_enabled: formData.crm_inquiry_enabled,
                    crm_response_templates: formData.crm_response_templates
                })
                .eq('id', activeStore.id)

            if (error) throw error
            toast.success('CRM Studio configuration saved')
            await refreshStores()
        } catch (error: any) {
            toast.error(error.message || 'Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    if (isVendorLoading) return <div className="p-10 text-zinc-500 animate-pulse">Initializing CRM Studio...</div>
    if (!activeStore) return <div className="p-10 text-zinc-500">No store selected.</div>

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-6xl mx-auto">

                {/* Header Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    <span>Americana Hub</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-blue-500 font-bold">Messaging CRM</span>
                </div>

                {/* Main Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">WhatsApp & Messenger CRM Studio</h1>
                        <p className="text-zinc-500 text-xs italic">Manage high-fashion customer service channels and automation flows with high-speed precision.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search Studio..."
                                className="bg-[#121217] border-white/5 pl-10 h-10 text-xs focus:ring-blue-500/20"
                            />
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-600/20 rounded-lg h-10 uppercase text-[10px] tracking-widest"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-16">

                    {/* Channel Connection */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Channel Connection</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* WhatsApp Card */}
                            <Card className="bg-[#121217] border-white/5 overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                                <MessageCircle className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white uppercase tracking-tight">WhatsApp Business API</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] text-zinc-500 uppercase font-black">Last synced: 5m ago</span>
                                                    <span className="text-zinc-700 text-[9px]">•</span>
                                                    <span className="text-[9px] text-zinc-500 uppercase font-black">Version 2.4.1</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] uppercase tracking-widest px-3 py-1 font-bold">Connected</Badge>
                                    </div>
                                    <Link href="/dashboard/vendor/integrations">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white uppercase text-[10px] font-black h-11 tracking-widest rounded-xl">
                                            Manage Integration
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Messenger Card */}
                            <Card className="bg-[#121217] border-white/5 overflow-hidden group hover:border-orange-500/20 transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                                <MessageSquare className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white uppercase tracking-tight">FB Messenger</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] text-red-500/70 uppercase font-black">Token expired: 2h ago</span>
                                                    <span className="text-zinc-700 text-[9px]">•</span>
                                                    <span className="text-[9px] text-zinc-500 uppercase font-black">Needs Refresh</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] uppercase tracking-widest px-3 py-1 font-bold">Action Required</Badge>
                                    </div>
                                    <Link href="/dashboard/vendor/integrations">
                                        <Button variant="secondary" className="w-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 uppercase text-[10px] font-black h-11 tracking-widest rounded-xl group-hover:bg-orange-600 group-hover:text-white group-hover:border-transparent transition-all">
                                            Re-authenticate
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Automated Flows */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4 flex-1">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Automated Flows</h2>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <Button variant="link" className="text-blue-500 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors ml-4">View All Flows</Button>
                        </div>

                        <div className="space-y-4">
                            <FlowRow
                                title="Greeting Message"
                                trigger="Trigger: New Session"
                                value={formData.crm_greeting_message}
                                conversion="12.4%"
                                enabled={formData.crm_greeting_enabled}
                                onChange={(val) => setFormData(p => ({ ...p, crm_greeting_message: val }))}
                                onToggle={(val) => setFormData(p => ({ ...p, crm_greeting_enabled: val }))}
                            />
                            <FlowRow
                                title="Away Message"
                                trigger="Trigger: Outside Hours"
                                value={formData.crm_away_message}
                                conversion="--"
                                enabled={formData.crm_away_enabled}
                                onChange={(val) => setFormData(p => ({ ...p, crm_away_message: val }))}
                                onToggle={(val) => setFormData(p => ({ ...p, crm_away_enabled: val }))}
                            />
                            <FlowRow
                                title="Product Inquiry"
                                trigger="Trigger: Keywords (Stock)"
                                value={formData.crm_inquiry_message}
                                conversion="28.1%"
                                enabled={formData.crm_inquiry_enabled}
                                onChange={(val) => setFormData(p => ({ ...p, crm_inquiry_message: val }))}
                                onToggle={(val) => setFormData(p => ({ ...p, crm_inquiry_enabled: val }))}
                            />
                        </div>
                    </section>

                    {/* Response Templates */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4 flex-1">
                                <Copy className="h-4 w-4 text-zinc-500" />
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Response Templates</h2>
                                <Badge className="bg-blue-500/10 text-blue-500 border-transparent text-[9px] px-2 py-0 ml-4 font-bold">128 Ready</Badge>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                                <Button variant="secondary" className="bg-[#121217] border border-white/5 text-white text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-lg">Import</Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                    <Plus className="h-3 w-3" /> New Template
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <TemplateCard
                                category="Logistics"
                                title="Shipping Timelines"
                                content="Our global logistics partners ensure delivery within 3-5 business days. Your white-glove packaging is currently being prepared..."
                                used="1.2k"
                                updated="yesterday"
                                color="blue"
                            />
                            <TemplateCard
                                category="Sizing"
                                title="Size Guide Assistance"
                                content="For this specific designer, we recommend sizing up. Would you like our specialist to call you for a virtual fitting session?"
                                used="842"
                                updated="2d ago"
                                color="purple"
                            />
                            <TemplateCard
                                category="Policy"
                                title="Pre-order Policies"
                                content="Pre-orders are exclusive and non-refundable. Shipment is scheduled for the start of the next runway season..."
                                used="310"
                                updated="1w ago"
                                color="zinc"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function FlowRow({
    title,
    trigger,
    value,
    conversion,
    enabled,
    onChange,
    onToggle
}: {
    title: string,
    trigger: string,
    value: string,
    conversion: string,
    enabled: boolean,
    onChange: (val: string) => void,
    onToggle: (val: boolean) => void
}) {
    return (
        <Card className="bg-[#121217] border-white/5 overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-64">
                    <h4 className="text-[13px] font-bold text-white mb-1">{title}</h4>
                    <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">{trigger}</p>
                </div>

                <div className="flex-1 w-full relative">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-black/40 border-white/5 h-12 text-[11px] italic pr-12 text-zinc-400 focus:text-white transition-all focus:border-blue-500/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <MoreHorizontal className="h-4 w-4 text-zinc-700" />
                    </div>
                </div>

                <div className="flex items-center gap-8 pl-4">
                    <div className="text-center min-w-[80px]">
                        <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Conversion</p>
                        <p className="text-xs font-bold text-white font-mono tracking-tighter">{conversion}</p>
                    </div>
                    <Switch
                        checked={enabled}
                        onCheckedChange={onToggle}
                        className="data-[state=checked]:bg-blue-500"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function TemplateCard({ category, title, content, used, updated, color }: {
    category: string,
    title: string,
    content: string,
    used: string,
    updated: string,
    color: string
}) {
    return (
        <Card className="bg-[#09090b] border border-white/5 hover:border-white/10 transition-all duration-300 relative group overflow-hidden">
            <CardContent className="p-7">
                <div className="flex justify-between items-center mb-6">
                    <Badge className={cn(
                        "text-[8px] uppercase font-black tracking-widest px-2.5 py-0.5 border-transparent",
                        color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                            color === 'purple' ? "bg-purple-500/10 text-purple-500" :
                                "bg-zinc-800 text-zinc-500"
                    )}>
                        {category}
                    </Badge>
                    <button className="text-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-300">
                        <Copy className="h-3 w-3" />
                    </button>
                </div>

                <h4 className="text-[14px] font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors duration-300">{title}</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 italic line-clamp-3">"{content}"</p>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-700">
                    <span>Used {used} times</span>
                    <span>Updated {updated}</span>
                </div>
            </CardContent>
            {/* Ambient accent */}
            <div className={cn(
                "absolute top-0 right-0 w-24 h-24 blur-[80px] -mr-12 -mt-12 transition-all duration-500 group-hover:opacity-100 opacity-20",
                color === 'blue' ? "bg-blue-500" :
                    color === 'purple' ? "bg-purple-500" :
                        "bg-zinc-500"
            )} />
        </Card>
    )
}
