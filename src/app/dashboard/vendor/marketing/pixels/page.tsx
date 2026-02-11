'use client'

import React, { useState, useEffect } from 'react'
import {
    Activity,
    Zap,
    Globe,
    Search as SearchIcon,
    ChevronRight,
    Loader2,
    CheckCircle2,
    LayoutGrid,
    MessageSquare,
    ExternalLink,
    Terminal,
    Settings,
    Shield,
    RefreshCw,
    Share2,
    Code,
    Cpu,
    ArrowUpRight,
    Play,
    Facebook,
    Instagram
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

interface TrackingConfig {
    social: {
        meta_pixel_enabled: boolean;
        meta_pixel_id: string;
        gtm_enabled: boolean;
        gtm_id: string;
        tiktok_pixel_enabled: boolean;
        tiktok_pixel_id: string;
    };
    marketplaces: {
        amazon_enabled: boolean;
        shopify_enabled: boolean;
        meli_enabled: boolean;
        woo_enabled: boolean;
        wix_enabled: boolean;
        tiendanube_enabled: boolean;
        fb_shop_enabled: boolean;
        ig_shop_enabled: boolean;
    };
    lifecycle: {
        zoho_enabled: boolean;
        mailchimp_enabled: boolean;
        klaviyo_enabled: boolean;
        crm_sync_enabled: boolean;
    };
    google: {
        ga4_enabled: boolean;
        ga4_id: string;
        gsc_enabled: boolean;
        gsc_id: string;
        gmc_enabled: boolean;
        gmc_id: string;
        gbp_enabled: boolean;
        calendar_enabled: boolean;
    };
}

const DEFAULT_CONFIG: TrackingConfig = {
    social: {
        meta_pixel_enabled: false,
        meta_pixel_id: '',
        gtm_enabled: false,
        gtm_id: '',
        tiktok_pixel_enabled: false,
        tiktok_pixel_id: ''
    },
    marketplaces: {
        amazon_enabled: false,
        shopify_enabled: false,
        meli_enabled: false,
        woo_enabled: false,
        wix_enabled: false,
        tiendanube_enabled: false,
        fb_shop_enabled: false,
        ig_shop_enabled: false
    },
    lifecycle: {
        zoho_enabled: false,
        mailchimp_enabled: false,
        klaviyo_enabled: false,
        crm_sync_enabled: false
    },
    google: {
        ga4_enabled: false,
        ga4_id: '',
        gsc_enabled: false,
        gsc_id: '',
        gmc_enabled: false,
        gmc_id: '',
        gbp_enabled: false,
        calendar_enabled: false
    }
}

export default function PixelManagerPage() {
    const { activeStore, refreshStores, isLoading: isVendorLoading } = useVendor()
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState<TrackingConfig>(DEFAULT_CONFIG)

    useEffect(() => {
        if (activeStore?.tracking_config) {
            const storeConfig = activeStore.tracking_config as Partial<TrackingConfig>
            setConfig(prev => ({
                social: { ...prev.social, ...(storeConfig.social || {}) },
                marketplaces: { ...prev.marketplaces, ...(storeConfig.marketplaces || {}) },
                lifecycle: { ...prev.lifecycle, ...(storeConfig.lifecycle || {}) },
                google: { ...prev.google, ...(storeConfig.google || {}) }
            }))
        }
    }, [activeStore])

    const handleSave = async () => {
        if (!activeStore) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('stores')
                .update({ tracking_config: config })
                .eq('id', activeStore.id)

            if (error) throw error
            toast.success('Enterprise Tracking Hub updated successfully')
            await refreshStores()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update tracking hub')
        } finally {
            setSaving(false)
        }
    }

    const handleAction = (action: string) => {
        toast.info(`Initializing ${action}...`, {
            description: "Establishing secure handshake with endpoint.",
        });
        setTimeout(() => {
            toast.success(`${action} module operational.`);
        }, 2000);
    };

    if (isVendorLoading) return <div className="p-10 text-zinc-500 animate-pulse">Initializing Data Hub...</div>
    if (!activeStore) return <div className="p-10 text-zinc-500">No store selected.</div>

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 mb-6 font-mono">
                    <span>/ marketing</span>
                    <span className="text-zinc-800">/ tracking-intel</span>
                    <span className="text-blue-500 font-bold">/ OMNICHANNEL TRACKING & CAPI HUB</span>
                </div>

                {/* Main Header Area */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 border-white/5 pb-10">
                    <div className="flex-1">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase leading-none">Omnichannel Tracking Hub</h1>
                        <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed">
                            Enterprise-grade data hub for the Americana Marketplace. Centralized management of CAPI, GTM containers, and external store signal synchronization.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="bg-zinc-900/50 border-white/10 text-zinc-300 h-11 px-8 rounded-lg uppercase text-[10px] font-black tracking-widest hover:text-white transition-all">
                            Signal Docs
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 shadow-lg shadow-blue-600/20 rounded-lg h-11 uppercase text-[10px] tracking-widest"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Sync Global Stack
                        </Button>
                    </div>
                </div>

                {/* TOP CARDS: CAPI & GTM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* CAPI Card */}
                    <Card className="bg-[#121217] border-white/5 overflow-hidden shadow-2xl relative group">
                        <div className="absolute top-4 right-4 h-4 w-4 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Activity className="h-2 w-2 text-blue-500" />
                        </div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                    <RefreshCw className="h-7 w-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Conversions API (CAPI)</h2>
                                    <p className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest">Server-Side Engine</p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Uptime Status</span>
                                    <span className="text-[10px] font-mono text-blue-400 font-bold">96.58%</span>
                                </div>
                                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" style={{ width: '96.58%' }} />
                                </div>
                                <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">Latest Handshake: 2 mins ago</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex gap-3">
                            <Button
                                onClick={() => handleAction("Gateway Router")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest h-11 rounded-xl"
                            >
                                Config Router
                            </Button>
                            <Button
                                onClick={() => handleAction("CAPI Stream Logs")}
                                variant="outline"
                                className="bg-zinc-900 border-white/5 text-zinc-500 font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl hover:text-white"
                            >
                                Logs
                            </Button>
                        </CardContent>
                    </Card>

                    {/* GTM Card */}
                    <Card className="bg-[#121217] border-white/5 overflow-hidden shadow-2xl group">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-yellow-500">
                                    <Cpu className="h-7 w-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">GTM Hub</h2>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Container Management</p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5 h-[110px] flex flex-col justify-center">
                                <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 uppercase font-black">Main Container</span>
                                    <Input
                                        value={config.social.gtm_id}
                                        onChange={(e) => setConfig(p => ({ ...p, social: { ...p.social, gtm_id: e.target.value } }))}
                                        className="h-6 w-24 bg-transparent border-none text-right font-mono text-white font-bold p-0 focus-visible:ring-0"
                                        placeholder="GTM-XXXX"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-500 uppercase font-black">Workspace</span>
                                    <span className="font-mono text-zinc-400 font-bold tracking-tight">PRODUCTION_V4</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex gap-3">
                            <Button
                                onClick={() => handleAction("GTM Workspace")}
                                variant="outline"
                                className="flex-1 bg-zinc-900 border-white/10 text-zinc-300 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl hover:bg-zinc-800 transition-all"
                            >
                                Open Container
                            </Button>
                            <Button
                                onClick={() => handleAction("Code Injection")}
                                variant="outline"
                                className="bg-zinc-900 border-white/5 text-zinc-600 font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl hover:text-white"
                            >
                                Inject
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-12 mb-12">
                    {/* 1. SOCIAL TRACKING SOURCES */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Social Tracking Sources</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SocialPixelCard
                                icon={<Facebook className="h-5 w-5" />}
                                title="Meta Pixel"
                                id={config.social.meta_pixel_id}
                                enabled={config.social.meta_pixel_enabled}
                                onIdChange={(val) => setConfig(p => ({ ...p, social: { ...p.social, meta_pixel_id: val } }))}
                                onToggle={(val) => setConfig(p => ({ ...p, social: { ...p.social, meta_pixel_enabled: val } }))}
                                variant="blue"
                            />
                            <SocialPixelCard
                                icon={<Instagram className="h-5 w-5" />}
                                title="Instagram Shopping"
                                description="G-Signal Active"
                                id={config.social.tiktok_pixel_id}
                                enabled={config.social.tiktok_pixel_enabled}
                                onIdChange={(val) => setConfig(p => ({ ...p, social: { ...p.social, tiktok_pixel_id: val } }))}
                                onToggle={(val) => setConfig(p => ({ ...p, social: { ...p.social, tiktok_pixel_enabled: val } }))}
                                variant="red"
                            />
                            <SocialPixelCard
                                icon={<Facebook className="h-5 w-5" />}
                                title="Facebook Shop"
                                description="Direct Catalog Sync"
                                id={config.social.gtm_id}
                                enabled={config.social.gtm_enabled}
                                onIdChange={(val) => setConfig(p => ({ ...p, social: { ...p.social, gtm_id: val } }))}
                                onToggle={(val) => setConfig(p => ({ ...p, social: { ...p.social, gtm_enabled: val } }))}
                                variant="outline"
                            />
                        </div>
                    </section>

                    {/* 2. MARKETPLACE TRACKING SYNC */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Marketplace Tracking Sync</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <MarketplaceSyncCard
                                title="WooCommerce"
                                description="Sync API"
                                enabled={config.marketplaces.woo_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, marketplaces: { ...p.marketplaces, woo_enabled: val } }))}
                                variant="violet"
                            />
                            <MarketplaceSyncCard
                                title="Tienda Nube"
                                enabled={config.marketplaces.tiendanube_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, marketplaces: { ...p.marketplaces, tiendanube_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                title="Wix Store"
                                enabled={config.marketplaces.wix_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, marketplaces: { ...p.marketplaces, wix_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                title="Shopify Pixel"
                                enabled={config.marketplaces.shopify_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, marketplaces: { ...p.marketplaces, shopify_enabled: val } }))}
                                variant="blue"
                            />
                        </div>
                    </section>

                    {/* 3. GOOGLE GROWTH SUITE */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Google Growth Suite</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <MarketplaceSyncCard
                                icon={<Terminal className="h-5 w-5" />}
                                title="GA4"
                                description="Event Stream"
                                id={config.google.ga4_id}
                                onIdChange={(val) => setConfig(p => ({ ...p, google: { ...p.google, ga4_id: val } }))}
                                enabled={config.google.ga4_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, google: { ...p.google, ga4_enabled: val } }))}
                                variant="blue"
                            />
                            <MarketplaceSyncCard
                                icon={<SearchIcon className="h-5 w-5" />}
                                title="GSC"
                                description="Search Index"
                                id={config.google.gsc_id}
                                onIdChange={(val) => setConfig(p => ({ ...p, google: { ...p.google, gsc_id: val } }))}
                                enabled={config.google.gsc_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, google: { ...p.google, gsc_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                icon={<RefreshCw className="h-5 w-5" />}
                                title="Merchant"
                                description="Prod Feed"
                                id={config.google.gmc_id}
                                onIdChange={(val) => setConfig(p => ({ ...p, google: { ...p.google, gmc_id: val } }))}
                                enabled={config.google.gmc_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, google: { ...p.google, gmc_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                icon={<Globe className="h-5 w-5" />}
                                title="Business"
                                description="Local SEO"
                                enabled={config.google.gbp_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, google: { ...p.google, gbp_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                icon={<Settings className="h-5 w-5" />}
                                title="Calendar"
                                description="Sched Sync"
                                enabled={config.google.calendar_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, google: { ...p.google, calendar_enabled: val } }))}
                            />
                        </div>
                    </section>

                    {/* 4. LIFECYCLE & CRM STACK */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Lifecycle & CRM Stack</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <MarketplaceSyncCard
                                icon={<Shield className="h-5 w-5" />}
                                title="Zoho CRM"
                                enabled={config.lifecycle.zoho_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, lifecycle: { ...p.lifecycle, zoho_enabled: val } }))}
                                variant="violet"
                            />
                            <MarketplaceSyncCard
                                icon={<MessageSquare className="h-5 w-5" />}
                                title="Mailchimp"
                                enabled={config.lifecycle.mailchimp_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, lifecycle: { ...p.lifecycle, mailchimp_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                icon={<Zap className="h-5 w-5" />}
                                title="Klaviyo"
                                enabled={config.lifecycle.klaviyo_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, lifecycle: { ...p.lifecycle, klaviyo_enabled: val } }))}
                            />
                            <MarketplaceSyncCard
                                icon={<RefreshCw className="h-5 w-5" />}
                                title="Global Sync"
                                enabled={config.lifecycle.crm_sync_enabled}
                                onToggle={(val) => setConfig(p => ({ ...p, lifecycle: { ...p.lifecycle, crm_sync_enabled: val } }))}
                            />
                        </div>
                    </section>
                </div>

                {/* BOTTOM PANEL: LIVE SIGNAL MONITOR */}
                <div className="w-full">
                    <Card className="bg-[#0c0c0f] border-white/5 overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-white/5 py-3 h-12 bg-zinc-900/40 flex flex-row items-center justify-between">
                            <div className="flex gap-1.5 px-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Live Signal Monitor</span>
                            <div className="px-4">
                                <Activity className="h-3 w-3 text-zinc-800" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-black/40">
                            <div className="p-8 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                                <SignalEvent
                                    name="CAPI_HANDSHAKE_OK"
                                    time="14:42:11"
                                    protocol="v3.0.0_Server"
                                    latency="14ms"
                                    color="blue"
                                />
                                <SignalEvent
                                    name="WIX_WEBHOOK_EVENT"
                                    time="14:41:06"
                                    action="Product_View"
                                    store="Wix_Store_Main"
                                    color="red"
                                />
                                <SignalEvent
                                    name="GTM_TAG_FIRED"
                                    time="14:40:22"
                                    container="Main_KB9"
                                    tag_name="Insta_Shopping_Sync"
                                    color="blue"
                                />
                                <SignalEvent
                                    name="TIENDA_NUBE_SYNC"
                                    time="14:39:45"
                                    entity="Inventory_Update"
                                    signal="MATCHED"
                                    color="green"
                                />
                            </div>
                            <div className="px-8 py-3 flex items-center justify-between border-t border-white/5 bg-zinc-900/20">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                                    <span className="text-[8px] uppercase tracking-widest font-black text-zinc-600">Socket Connected</span>
                                </div>
                                <span className="text-[8px] uppercase tracking-widest font-black text-zinc-800">CAPI Bridge: Active</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function SocialPixelCard({
    icon,
    title,
    description,
    id,
    enabled,
    onIdChange,
    onToggle,
    variant = 'outline'
}: {
    icon: React.ReactNode,
    title: string,
    description?: string,
    id: string,
    enabled: boolean,
    onIdChange: (val: string) => void,
    onToggle: (val: boolean) => void,
    variant?: 'blue' | 'red' | 'outline'
}) {
    return (
        <Card className="bg-[#121217] border-white/5 overflow-hidden group hover:border-white/10 transition-all p-6">
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "h-10 w-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center transition-all",
                    variant === 'blue' ? "text-blue-500 group-hover:bg-blue-600 group-hover:text-white" :
                        variant === 'red' ? "text-red-500 group-hover:bg-red-600 group-hover:text-white" :
                            "text-zinc-500 group-hover:text-white"
                )}>
                    {icon}
                </div>
                <Switch checked={enabled} onCheckedChange={onToggle} className={cn(
                    "scale-90",
                    variant === 'blue' ? "data-[state=checked]:bg-blue-500" :
                        variant === 'red' ? "data-[state=checked]:bg-red-500" :
                            "data-[state=checked]:bg-zinc-600"
                )} />
            </div>
            <div className="mb-4">
                <h4 className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{title}</h4>
                {description && <p className="text-[9px] text-zinc-700 uppercase font-black tracking-widest mb-3">{description}</p>}

                <div className="relative group/id">
                    <Input
                        placeholder="Enter Signal ID..."
                        value={id}
                        onChange={(e) => onIdChange(e.target.value)}
                        className="bg-black/50 border-white/5 h-10 w-full text-[10px] font-mono focus:ring-blue-500/10 transition-all"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button className={cn(
                    "flex-1 h-9 text-[9px] font-black uppercase tracking-widest rounded-lg",
                    variant === 'blue' ? "bg-blue-600 hover:bg-blue-700 text-white" :
                        variant === 'red' ? "bg-red-600 hover:bg-red-700 text-white" :
                            "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white"
                )}>
                    Connect
                </Button>
                <Button variant="outline" className="h-9 w-12 bg-zinc-900 border-white/5 text-zinc-600 text-[9px] font-black uppercase rounded-lg hover:text-white">
                    Test
                </Button>
            </div>
        </Card>
    )
}

function MarketplaceSyncCard({
    icon,
    title,
    description,
    id,
    onIdChange,
    enabled,
    onToggle,
    variant = 'outline'
}: {
    icon?: React.ReactNode,
    title: string,
    description?: string,
    id?: string,
    onIdChange?: (val: string) => void,
    enabled: boolean,
    onToggle: (val: boolean) => void,
    variant?: 'blue' | 'violet' | 'outline'
}) {
    return (
        <Card className="bg-[#121217] border-white/5 overflow-hidden group hover:border-white/10 transition-all p-6">
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "h-10 w-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center transition-all",
                    variant === 'blue' ? "text-blue-500" :
                        variant === 'violet' ? "text-purple-500" :
                            "text-zinc-600 group-hover:text-white"
                )}>
                    {icon || <Share2 className="h-5 w-5" />}
                </div>
                <Switch checked={enabled} onCheckedChange={onToggle} className={cn(
                    "scale-90",
                    variant === 'blue' ? "data-[state=checked]:bg-blue-500" :
                        variant === 'violet' ? "data-[state=checked]:bg-blue-500" :
                            "data-[state=checked]:bg-zinc-600"
                )} />
            </div>
            <div className="mb-4">
                <h4 className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{title}</h4>
                {description && <p className="text-[9px] text-zinc-700 uppercase font-black tracking-widest mb-3">{description}</p>}

                {onIdChange !== undefined && (
                    <Input
                        placeholder="Enter Store ID..."
                        value={id || ''}
                        onChange={(e) => onIdChange(e.target.value)}
                        className="bg-black/50 border-white/5 h-10 w-full text-[10px] font-mono focus:ring-blue-500/10 transition-all"
                    />
                )}
            </div>
            <div className="flex gap-2">
                <Button className={cn(
                    "flex-1 h-9 text-[9px] font-black uppercase tracking-widest rounded-lg",
                    variant === 'blue' || variant === 'violet' ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white"
                )}>
                    {variant === 'violet' ? 'Sync API' : 'Connect'}
                </Button>
                <Button variant="outline" className="h-9 w-12 bg-zinc-900 border-white/5 text-zinc-600 text-[9px] font-black uppercase rounded-lg hover:text-white">
                    Test
                </Button>
            </div>
        </Card>
    )
}

function SignalEvent({ name, time, color, ...details }: { name: string, time: string, color: 'blue' | 'green' | 'red' | 'yellow', [key: string]: any }) {
    return (
        <div className="group cursor-default">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        color === 'blue' ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" :
                            color === 'green' ? "bg-green-500 shadow-[0_0_8px_#22c55e]" :
                                color === 'red' ? "bg-red-500 shadow-[0_0_8px_#ef4444]" :
                                    "bg-yellow-500 shadow-[0_0_8px_#eab308]"
                    )} />
                    <span className={cn(
                        "font-black tracking-tight uppercase",
                        color === 'blue' ? "text-blue-400" :
                            color === 'green' ? "text-green-400" :
                                color === 'red' ? "text-red-400" :
                                    "text-yellow-400"
                    )}>{name}</span>
                </div>
                <span className="text-[8px] text-zinc-800 font-mono tracking-tighter">{time}</span>
            </div>
            <div className="pl-3.5 border-l border-white/10 space-y-2">
                {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-[9px]">
                        <span className="text-zinc-600 uppercase font-black tracking-tighter">{key}</span>
                        <span className={cn(
                            "font-bold font-mono",
                            typeof value === 'string' && value.startsWith('$') ? "text-green-400" :
                                value === 'MATCHED' ? "text-cyan-400" : "text-zinc-400"
                        )}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
