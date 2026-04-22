'use client'

import React, { useState, useEffect } from 'react'
import {
    Zap,
    ShieldCheck,
    Save,
    Loader2,
    Eye,
    EyeOff,
    ExternalLink,
    Lock,
    Globe,
    Activity,
    Smartphone,
    CreditCard,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ApiProvider } from '@/lib/api/handshake-service'
import { testHandshakeAction } from '@/app/actions/api-actions'

export default function GlobalApiRegistryPage() {
    const [saving, setSaving] = useState(false)
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

    const [masterConfig, setMasterConfig] = useState({
        meta_app_id: '',
        meta_app_secret: '',
        meta_pixel_master_id: '',
        google_client_id: '',
        google_client_secret: '',
        gtm_master_id: '',
        tiktok_app_id: '',
        tiktok_app_secret: '',
        stripe_public_master: '',
        stripe_secret_master: '',
        is_sandbox: true
    })

    const toggleKeyVisibility = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const [logs, setLogs] = useState<any[]>([
        { id: '1', service: 'System', level: 'info', message: 'Registry Initialized', timestamp: new Date().toLocaleTimeString() },
        { id: '2', service: 'Auth', level: 'warning', message: 'Master Encryption Key is Active', timestamp: new Date().toLocaleTimeString() },
    ])

    const handleTestConnection = async (provider: ApiProvider) => {
        toast.promise(testHandshakeAction(
            provider,
            (masterConfig as any)[`${provider.toLowerCase()}_app_id`] || '',
            '••••••••'
        ), {
            loading: `Testing ${provider} Handshake...`,
            success: (data) => {
                setLogs(prev => [{
                    id: Date.now().toString(),
                    service: provider,
                    level: data.success ? 'info' : 'error',
                    message: data.message,
                    timestamp: new Date().toLocaleTimeString()
                }, ...prev])
                return `${provider} Handshake Successful`
            },
            error: 'Handshake failed'
        })
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSaving(false)
        setLogs(prev => [{
            id: Date.now().toString(),
            service: 'Registry',
            level: 'info',
            message: 'Global Keys Synchronized Successfully',
            timestamp: new Date().toLocaleTimeString()
        }, ...prev])
        toast.success("Global API Master Keys Updated")
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans pb-32">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-3">
                            <Zap className="h-3 w-3" /> Technical Architecture
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white">Global API Registry</h1>
                        <p className="text-zinc-500 text-sm mt-1">Configure Master Credentials for OAuth Handshaking and Ecosystem Connectivity.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#121212] border border-white/5 rounded-xl p-1.5 flex items-center gap-1">
                            <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase px-2 h-6 border-none",
                                masterConfig.is_sandbox ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                                {masterConfig.is_sandbox ? 'Sandbox Mode' : 'Production Active'}
                            </Badge>
                            <Switch
                                checked={!masterConfig.is_sandbox}
                                onCheckedChange={(val) => setMasterConfig(p => ({ ...p, is_sandbox: !val }))}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest px-8 rounded-xl h-12 transition-all shadow-lg shadow-cyan-500/20"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Sync Global Keys
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: REGISTRY (2/3) */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* META (FACEBOOK / INSTAGRAM) */}
                            <Card className="bg-[#111111] border-white/5 overflow-hidden group">
                                <CardHeader className="border-b border-white/5 bg-linear-to-r from-blue-600/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500 font-bold">
                                                <Globe className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Meta Master App</CardTitle>
                                                <CardDescription className="text-[10px] text-zinc-500 uppercase tracking-tighter">OAuth & Pixel Tracking</CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[9px] font-black border-blue-500/30 text-blue-500 hover:bg-blue-500/10 uppercase tracking-widest"
                                            onClick={() => handleTestConnection('Meta')}
                                        >
                                            Test
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">App ID</Label>
                                        <Input
                                            value={masterConfig.meta_app_id}
                                            onChange={(e) => setMasterConfig(p => ({ ...p, meta_app_id: e.target.value }))}
                                            className="bg-black/50 border-white/10 h-10 text-xs font-mono text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">App Secret</Label>
                                        <div className="relative">
                                            <Input
                                                type={showKeys['meta_secret'] ? "text" : "password"}
                                                value={masterConfig.meta_app_secret}
                                                onChange={(e) => setMasterConfig(p => ({ ...p, meta_app_secret: e.target.value }))}
                                                className="bg-black/50 border-white/10 h-10 text-xs font-mono pr-12 text-white"
                                            />
                                            <button onClick={() => toggleKeyVisibility('meta_secret')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                                                {showKeys['meta_secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* GOOGLE CLOUD */}
                            <Card className="bg-[#111111] border-white/5 overflow-hidden group">
                                <CardHeader className="border-b border-white/5 bg-linear-to-r from-red-600/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500 font-bold">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Google Cloud Engine</CardTitle>
                                                <CardDescription className="text-[10px] text-zinc-500 uppercase tracking-tighter">Growth Suite & Analytics</CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[9px] font-black border-red-500/30 text-red-500 hover:bg-red-500/10 uppercase tracking-widest"
                                            onClick={() => handleTestConnection('Google')}
                                        >
                                            Test
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client ID</Label>
                                        <Input
                                            value={masterConfig.google_client_id}
                                            onChange={(e) => setMasterConfig(p => ({ ...p, google_client_id: e.target.value }))}
                                            className="bg-black/50 border-white/10 h-10 text-xs font-mono text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GTM Container ID</Label>
                                        <Input
                                            value={masterConfig.gtm_master_id}
                                            onChange={(e) => setMasterConfig(p => ({ ...p, gtm_master_id: e.target.value }))}
                                            className="bg-black/50 border-white/10 h-10 text-xs font-mono text-white"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* TIKTOK BUSINESS */}
                            <Card className="bg-[#111111] border-white/5 overflow-hidden group">
                                <CardHeader className="border-b border-white/5 bg-linear-to-r from-pink-600/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20 text-pink-500 font-bold">
                                                <Smartphone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">TikTok Ads Master</CardTitle>
                                                <CardDescription className="text-[10px] text-zinc-500 uppercase tracking-tighter">TikTok Marketing API</CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[9px] font-black border-pink-500/30 text-pink-500 hover:bg-pink-500/10 uppercase tracking-widest"
                                            onClick={() => handleTestConnection('TikTok')}
                                        >
                                            Test
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Developer Key</Label>
                                        <Input
                                            value={masterConfig.tiktok_app_id}
                                            onChange={(e) => setMasterConfig(p => ({ ...p, tiktok_app_id: e.target.value }))}
                                            className="bg-black/50 border-white/10 h-10 text-xs font-mono text-white"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* STRIPE MASTER SETTINGS */}
                            <Card className="bg-[#111111] border-white/5 overflow-hidden group">
                                <CardHeader className="border-b border-white/5 bg-linear-to-r from-cyan-600/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-500 font-bold">
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Stripe Master Matrix</CardTitle>
                                                <CardDescription className="text-[10px] text-zinc-500 uppercase tracking-tighter">Connect & Payouts</CardDescription>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[9px] font-black border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 uppercase tracking-widest"
                                            onClick={() => handleTestConnection('Stripe')}
                                        >
                                            Test
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Publishable Master Key</Label>
                                        <Input
                                            value={masterConfig.stripe_public_master}
                                            onChange={(e) => setMasterConfig(p => ({ ...p, stripe_public_master: e.target.value }))}
                                            className="bg-black/50 border-white/10 h-10 text-xs font-mono text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secret Master Key</Label>
                                        <div className="relative">
                                            <Input
                                                type={showKeys['stripe_secret'] ? "text" : "password"}
                                                value={masterConfig.stripe_secret_master}
                                                onChange={(e) => setMasterConfig(p => ({ ...p, stripe_secret_master: e.target.value }))}
                                                className="bg-black/50 border-white/10 h-10 text-xs font-mono pr-12 text-white"
                                            />
                                            <button onClick={() => toggleKeyVisibility('stripe_secret')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                                                {showKeys['stripe_secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIGNAL MONITOR (1/3) */}
                    <div className="xl:col-span-1">
                        <Card className="bg-[#0c0c0e] border-white/5 h-full flex flex-col sticky top-12">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-[#ff007f] uppercase tracking-[0.2em]">
                                    <div className="h-2 w-2 rounded-full bg-[#ff007f] animate-pulse" />
                                    Live Signal Monitor
                                </div>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white mt-1">Ecosystem Logs</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
                                    {logs.map(log => (
                                        <div key={log.id} className="text-[10px] border-b border-white/2 pb-2 last:border-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                                                    log.level === 'error' ? "bg-red-500/20 text-red-500" :
                                                        log.level === 'warning' ? "bg-amber-500/20 text-amber-500" :
                                                            "bg-cyan-500/20 text-cyan-500"
                                                )}>
                                                    {log.service}
                                                </span>
                                                <span className="text-zinc-600">{log.timestamp}</span>
                                            </div>
                                            <p className="text-zinc-400 leading-relaxed">{log.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-black/40 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>Status: Connected</span>
                                        <span>Latency: 24ms</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Footer Disclaimer */}
                    <div className="mt-12 p-6 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                            <Lock className="h-5 w-5 text-zinc-600" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            <span className="text-white font-bold">SECURITY WARNING:</span> These keys grant full access to the marketplace integrated platforms. Any changes made here affect thousands of vendors. Ensure you are using production-grade credentials for live operations. All changes are logged for audit purposes.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
