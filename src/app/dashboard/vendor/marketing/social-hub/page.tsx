'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useVendor } from '@/providers/vendor-provider'
import {
    MessageCircle,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Save,
    Loader2,
    ChevronRight,
    Search as SearchIcon,
    Eye,
    EyeOff,
    Zap,
    MessageSquare,
    ExternalLink,
    Music2,
    Lock,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const TABS = ['Overview', 'Automations', 'Analytics']

export default function SocialHubPage() {
    const { activeStore, refreshStores, isLoading: isVendorLoading } = useVendor()
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [showCapi, setShowCapi] = useState(false)
    const [activeTab, setActiveTab] = useState('Overview')

    const [formData, setFormData] = useState({
        fb_handle: '',
        instagram_handle: '',
        wa_handle: '',
        tt_handle: '',
        meta_pixel_id: '',
        gtm_id: '',
        capi_token: '',
        wa_automation_enabled: false,
        messenger_automation_enabled: false
    })

    useEffect(() => {
        if (activeStore) {
            setFormData({
                fb_handle: activeStore.fb_handle || '',
                instagram_handle: activeStore.instagram_handle || '',
                wa_handle: activeStore.wa_handle || '',
                tt_handle: activeStore.tt_handle || '',
                meta_pixel_id: activeStore.meta_pixel_id || '',
                gtm_id: activeStore.gtm_id || '',
                capi_token: activeStore.capi_token || '',
                wa_automation_enabled: !!activeStore.wa_automation_enabled,
                messenger_automation_enabled: !!activeStore.messenger_automation_enabled
            })
        }
    }, [activeStore])

    const handleConnect = (platform: string) => {
        toast.info(`Connecting to ${platform}...`, {
            description: "Redirecting to authentication portal.",
        });
        // Mock connection delay
        setTimeout(() => {
            toast.success(`${platform} account connected successfully!`);
        }, 3000);
    };

    const handleVerify = (pixelType: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Requesting signal from ${pixelType}...`,
                success: `${pixelType} handshake established (Active)`,
                error: `No signal detected for ${pixelType}.`,
            }
        );
    };

    const handleSave = async () => {
        if (!activeStore) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('stores')
                .update({
                    fb_handle: formData.fb_handle,
                    instagram_handle: formData.instagram_handle,
                    wa_handle: formData.wa_handle,
                    tt_handle: formData.tt_handle,
                    meta_pixel_id: formData.meta_pixel_id,
                    gtm_id: formData.gtm_id,
                    capi_token: formData.capi_token,
                    wa_automation_enabled: formData.wa_automation_enabled,
                    messenger_automation_enabled: formData.messenger_automation_enabled
                })
                .eq('id', activeStore.id)

            if (error) throw error
            toast.success('Configuration saved successfully')
            await refreshStores()
        } catch (error: any) {
            toast.error(error.message || 'Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    if (isVendorLoading) return <div className="p-10 text-zinc-500 animate-pulse">Loading Growth Engine...</div>
    if (!activeStore) return <div className="p-10 text-zinc-500">No store selected.</div>

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-6xl mx-auto">

                {/* Top Nav Breadcrumb-like */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    <span>Vendor OS</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-blue-500 font-bold">Marketing Hub</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Core Marketing & Social</h1>

                        {/* Tabs */}
                        <div className="hidden md:flex items-center bg-zinc-900/50 rounded-lg p-1 border border-white/5">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                                        activeTab === tab ? "bg-white/10 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search parameters..."
                                className="bg-[#121217] border-white/5 pl-10 h-10 text-xs focus:ring-blue-500/20"
                            />
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-600/20 rounded-lg h-10 uppercase text-[10px] tracking-widest"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Save Configuration
                        </Button>
                        <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Profile" />
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="min-h-[600px]">
                    {activeTab === 'Overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* SOCIAL CONNECTIONS */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Social Connections</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <SocialCard
                                        icon={<FacebookIcon className="h-5 w-5" />}
                                        title="Facebook"
                                        status={formData.fb_handle ? "Connected" : "Disconnected"}
                                        onClick={() => handleConnect("Facebook")}
                                    />
                                    <SocialCard
                                        icon={<InstagramIcon className="h-5 w-5" />}
                                        title="Instagram"
                                        status={formData.instagram_handle ? "Connected" : "Disconnected"}
                                        onClick={() => handleConnect("Instagram")}
                                    />
                                    <SocialCard
                                        icon={<MessageCircle className="h-5 w-5" />}
                                        title="WhatsApp"
                                        status={formData.wa_handle ? "Connected" : "Disconnected"}
                                        onClick={() => handleConnect("WhatsApp")}
                                    />
                                    <SocialCard
                                        icon={<Music2 className="h-5 w-5" />}
                                        title="TikTok"
                                        status={formData.tt_handle ? "Connected" : "Disconnected"}
                                        onClick={() => handleConnect("TikTok")}
                                    />
                                </div>
                            </section>

                            {/* TRACKING & PIXELS */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Tracking & Pixels</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <Card className="bg-[#121217] border-white/5 overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Meta Pixel ID</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.meta_pixel_id}
                                                        onChange={(e) => setFormData(p => ({ ...p, meta_pixel_id: e.target.value }))}
                                                        placeholder="8239401293481"
                                                        className="bg-black/40 border-white/5 h-10 text-[10px] focus:border-blue-500/50 transition-colors"
                                                    />
                                                    <Button
                                                        onClick={() => handleVerify("Meta Pixel")}
                                                        variant="secondary"
                                                        className="bg-blue-500/10 text-blue-500 border border-blue-500/20 h-10 px-4 uppercase text-[9px] font-bold tracking-widest hover:bg-blue-500/20"
                                                    >
                                                        Verify Status
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Google Tag Manager (GTM)</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.gtm_id}
                                                        onChange={(e) => setFormData(p => ({ ...p, gtm_id: e.target.value }))}
                                                        placeholder="GTM-XXXXXXX"
                                                        className="bg-black/40 border-white/5 h-10 text-[10px] focus:border-blue-500/50 transition-colors"
                                                    />
                                                    <Button
                                                        onClick={() => handleVerify("GTM")}
                                                        variant="secondary"
                                                        className="bg-blue-500/10 text-blue-500 border border-blue-500/20 h-10 px-4 uppercase text-[9px] font-bold tracking-widest hover:bg-blue-500/20"
                                                    >
                                                        Verify Status
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Conversions API (CAPI)</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            type={showCapi ? "text" : "password"}
                                                            value={formData.capi_token}
                                                            onChange={(e) => setFormData(p => ({ ...p, capi_token: e.target.value }))}
                                                            placeholder="••••••••••••••••••••"
                                                            className="bg-black/40 border-white/5 h-10 text-[10px] focus:border-blue-500/50 transition-colors pr-10"
                                                        />
                                                        <button
                                                            onClick={() => setShowCapi(!showCapi)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                                        >
                                                            {showCapi ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                        </button>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleVerify("CAPI")}
                                                        variant="secondary"
                                                        className="bg-blue-500/10 text-blue-500 border border-blue-500/20 h-10 px-4 uppercase text-[9px] font-bold tracking-widest hover:bg-blue-500/20"
                                                    >
                                                        Verify Status
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                            <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <Zap className="h-2 w-2 text-white" />
                                            </div>
                                            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                                                <span className="text-blue-500 font-bold not-italic">Note:</span> Verification may take up to 5 minutes to reflect after updates. Ensure your domain is verified in Meta Business Suite before enabling CAPI.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* MULTICHANNEL MESSAGING (CRM) */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Multichannel Messaging (CRM)</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="bg-[#121217] border border-blue-500/20 shadow-lg shadow-blue-500/5 group">
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                        <Zap className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">WhatsApp Automations</h3>
                                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] uppercase tracking-tighter ml-2">ACTIVE</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center group/item">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-white">Away Message</span>
                                                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">Sent when your shop is outside business hours</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.wa_automation_enabled}
                                                        onCheckedChange={(val) => setFormData(p => ({ ...p, wa_automation_enabled: val }))}
                                                        className="data-[state=checked]:bg-blue-500"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center group/item">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-white">Greeting Message</span>
                                                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">Welcome customers when they first message</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.wa_automation_enabled}
                                                        onCheckedChange={(val) => setFormData(p => ({ ...p, wa_automation_enabled: val }))}
                                                        className="data-[state=checked]:bg-blue-500"
                                                    />
                                                </div>
                                                <div className="pt-4 flex justify-end">
                                                    <button className="text-[9px] uppercase font-black text-blue-500 hover:text-blue-400 tracking-widest transition-colors flex items-center gap-1">
                                                        Preview Flow <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-[#09090b] border-white/5 opacity-80 group">
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 border border-white/5 group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-zinc-500 uppercase tracking-wider text-sm">Messenger Flow</h3>
                                                        <Badge className="bg-zinc-800 text-zinc-600 border-white/5 text-[8px] uppercase tracking-tighter ml-2">INACTIVE</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center opacity-40">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-zinc-500">Away Message</span>
                                                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Connect Facebook to enable messaging</p>
                                                    </div>
                                                    <Switch disabled className="data-[state=checked]:bg-zinc-800" />
                                                </div>
                                                <div className="flex justify-between items-center opacity-40">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-zinc-500">Quick Replies</span>
                                                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Automated FAQ buttons for shoppers</p>
                                                    </div>
                                                    <Switch disabled className="data-[state=checked]:bg-zinc-800" />
                                                </div>
                                                <div className="pt-4 flex justify-end">
                                                    <button className="text-[9px] uppercase font-black text-zinc-600 hover:text-zinc-500 tracking-widest transition-colors flex items-center gap-1">
                                                        Configure Account <Lock className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'Automations' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Active Automations</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="bg-[#121217] border border-blue-500/20 shadow-lg shadow-blue-500/5 group">
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                        <Zap className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">WhatsApp Automations</h3>
                                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] uppercase tracking-tighter ml-2">ACTIVE</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center group/item">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-white">Away Message</span>
                                                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">Sent when your shop is outside business hours</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.wa_automation_enabled}
                                                        onCheckedChange={(val) => setFormData(p => ({ ...p, wa_automation_enabled: val }))}
                                                        className="data-[state=checked]:bg-blue-500"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center group/item">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-white">Greeting Message</span>
                                                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">Welcome customers when they first message</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.wa_automation_enabled}
                                                        className="data-[state=checked]:bg-blue-500"
                                                    />
                                                </div>
                                                <div className="pt-4 flex justify-end">
                                                    <button className="text-[9px] uppercase font-black text-blue-500 hover:text-blue-400 tracking-widest transition-colors flex items-center gap-1">
                                                        Preview Flow <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-[#09090b] border-white/5 opacity-80 group">
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 border border-white/5 group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-zinc-500 uppercase tracking-wider text-sm">Messenger Flow</h3>
                                                        <Badge className="bg-zinc-800 text-zinc-600 border-white/5 text-[8px] uppercase tracking-tighter ml-2">INACTIVE</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center opacity-40">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-zinc-500">Away Message</span>
                                                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Connect Facebook to enable messaging</p>
                                                    </div>
                                                    <Switch disabled className="data-[state=checked]:bg-zinc-800" />
                                                </div>
                                                <div className="flex justify-between items-center opacity-40">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold text-zinc-500">Quick Replies</span>
                                                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Automated FAQ buttons for shoppers</p>
                                                    </div>
                                                    <Switch disabled className="data-[state=checked]:bg-zinc-800" />
                                                </div>
                                                <div className="pt-4 flex justify-end">
                                                    <button className="text-[9px] uppercase font-black text-zinc-600 hover:text-zinc-500 tracking-widest transition-colors flex items-center gap-1">
                                                        Configure Account <Lock className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'Analytics' && (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 mb-8">
                                <Activity className="h-8 w-8 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Intelligence Engine Offline</h3>
                            <p className="text-zinc-500 text-[10px] max-w-sm uppercase tracking-[0.2em] leading-loose font-bold">
                                Social signal aggregation is currently in standby. Connect at least one source and process 100+ events to activate predictive analytics.
                            </p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <span>Noir Merchant Vendor OS © 2024</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                        <span className="text-zinc-700">All technical connections are encrypted with 256-bit SSL</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SocialCard({
    icon,
    title,
    status,
    onClick
}: {
    icon: React.ReactNode,
    title: string,
    status: string,
    onClick: () => void
}) {
    const isConnected = status === "Connected"

    return (
        <Card className="bg-[#121217] border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-500">
            <CardContent className="p-8 flex flex-col items-center">
                <div className={cn(
                    "h-14 w-14 rounded-full mb-6 flex items-center justify-center border transition-all duration-500 relative",
                    isConnected ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-zinc-900 border-white/5 text-zinc-600"
                )}>
                    {icon}
                    {isConnected && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#121217]">
                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-center mb-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                    <div className="flex items-center justify-center gap-1.5">
                        <div className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                        <span className={cn(
                            "text-[9px] font-black tracking-widest uppercase",
                            isConnected ? "text-green-500" : "text-red-500"
                        )}>{status}</span>
                    </div>
                </div>

                <Button
                    onClick={onClick}
                    className={cn(
                        "w-full h-10 uppercase text-[9px] font-black tracking-widest rounded-lg transition-all",
                        isConnected
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10"
                            : "bg-zinc-900 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
                    )}
                >
                    {isConnected ? "Manage" : "Connect"}
                </Button>
            </CardContent>
        </Card>
    )
}

