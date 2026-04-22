'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useVendor } from '@/providers/vendor-provider'
import {
    Search,
    Globe,
    Sparkles,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Instagram,
    Twitter,
    MessageSquare,
    Image as ImageIcon,
    Upload,
    ChevronRight,
    MousePointer2,
    Monitor,
    Layout,
    Share2,
    Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { FileUpload } from '@/components/ui/file-upload'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function EnhancedSEOPage() {
    const { activeStore, refreshStores, isLoading: isVendorLoading } = useVendor()
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [previewTab, setPreviewTab] = useState<'social' | 'google'>('social')

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        seo_title: '',
        seo_description: '',
        og_image_url: '',
        logo_url: '',
        niche: '',
        seo_title_template: '',
        seo_description_template: '',
        canonical_url: '',
        favicon_url: ''
    })

    useEffect(() => {
        if (activeStore) {
            setFormData({
                name: activeStore.name || '',
                slug: activeStore.slug || '',
                description: activeStore.description || '',
                seo_title: activeStore.seo_title || '',
                seo_description: activeStore.seo_description || '',
                og_image_url: activeStore.og_image_url || '',
                logo_url: activeStore.logo_url || '',
                niche: activeStore.niche || '',
                seo_title_template: activeStore.seo_title_template || '',
                seo_description_template: activeStore.seo_description_template || '',
                canonical_url: activeStore.canonical_url || '',
                favicon_url: activeStore.favicon_url || ''
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
                    slug: formData.slug,
                    seo_title: formData.seo_title,
                    seo_description: formData.seo_description,
                    og_image_url: formData.og_image_url,
                    seo_title_template: formData.seo_title_template,
                    seo_description_template: formData.seo_description_template,
                    canonical_url: formData.canonical_url,
                    favicon_url: formData.favicon_url
                })
                .eq('id', activeStore.id)

            if (error) throw error
            toast.success('Search engine settings published')
            await refreshStores()
        } catch (error: any) {
            toast.error(error.message || 'Failed to publish changes')
        } finally {
            setSaving(false)
        }
    }

    const handleCopyLink = () => {
        const url = formData.canonical_url || `https://${activeStore.slug}.americanatienda.com`
        navigator.clipboard.writeText(url)
        toast.success('Store link copied to clipboard')
    }

    const handleShare = async () => {
        const url = formData.canonical_url || `https://${activeStore.slug}.americanatienda.com`
        if (navigator.share) {
            try {
                await navigator.share({
                    title: formData.seo_title || activeStore.name,
                    text: formData.seo_description || 'Check out my store!',
                    url: url
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        } else {
            handleCopyLink()
        }
    }

    // Health Score Logic (merged version)
    const calculateHealth = () => {
        let score = 0
        if (formData.seo_title.length >= 40 && formData.seo_title.length <= 60) score += 30
        if (formData.seo_description.length >= 120 && formData.seo_description.length <= 160) score += 30
        if (formData.og_image_url) score += 15
        if (formData.favicon_url) score += 15
        if (formData.seo_title_template) score += 10
        return score
    }

    const healthScore = calculateHealth()

    if (isVendorLoading) return <div className="p-10 text-zinc-500 animate-pulse">Initializing SEO Engine...</div>
    if (!activeStore) return <div className="p-10 text-zinc-500">No active boutique detected.</div>

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    <span>Marketing</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-pink-500 font-bold">SEO & Metadata</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">SEO & Global Metadata</h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search settings..."
                                className="bg-[#121217] border-white/5 pl-10 h-10 text-xs focus:ring-pink-500/20"
                            />
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-white text-black hover:bg-zinc-200 font-bold px-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-full h-10 uppercase text-[10px] tracking-widest"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Publish Changes
                        </Button>
                        <div className="h-10 w-10 rounded-full bg-[#121217] border border-white/5 flex items-center justify-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Configuration Columns */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* GLOBAL SEO TAGS */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">Global SEO Tags</h2>
                                <div className="h-px flex-1 bg-linear-to-r from-cyan-500/20 to-transparent" />
                            </div>

                            <Card className="bg-[#121217] border-white/5 overflow-hidden">
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Meta Title Template</Label>
                                            <Input
                                                value={formData.seo_title_template}
                                                onChange={(e) => setFormData(p => ({ ...p, seo_title_template: e.target.value }))}
                                                placeholder="{{product_name}} | Noir Luxury Boutique"
                                                className="bg-black/40 border-white/5 h-12 focus:border-cyan-500/50 transition-colors pr-10 font-mono text-xs"
                                            />
                                            <p className="text-[9px] text-zinc-600">Variables supported: {'{{product_name}}'}, {'{{store_name}}'}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Canonical Domain</Label>
                                            <Input
                                                value={formData.canonical_url}
                                                onChange={(e) => setFormData(p => ({ ...p, canonical_url: e.target.value }))}
                                                placeholder="https://yourstore.com"
                                                className="bg-black/40 border-white/5 h-12 focus:border-cyan-500/50 transition-colors font-mono text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Meta Description Template</Label>
                                        <Textarea
                                            value={formData.seo_description_template}
                                            onChange={(e) => setFormData(p => ({ ...p, seo_description_template: e.target.value }))}
                                            placeholder="Discover the finest curation of high-fashion pieces..."
                                            className="bg-black/40 border-white/5 min-h-[100px] focus:border-cyan-500/50 text-xs py-4 leading-relaxed"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* FAVICON MANAGEMENT */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-500">Favicon Management</h2>
                                <div className="h-px flex-1 bg-linear-to-r from-pink-500/20 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Upload Slots */}
                                <div className="md:col-span-8 grid grid-cols-2 gap-4">
                                    <div className="bg-[#121217] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 group relative overflow-hidden">
                                        <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 transition-colors">
                                            {formData.favicon_url ? <img src={formData.favicon_url} className="w-6 h-6 object-contain" /> : <Upload className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Standard (32x32)</p>
                                            <p className="text-[8px] text-zinc-600 uppercase mt-1">PNG, ICO</p>
                                        </div>
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <FileUpload
                                                bucketName="cms_media"
                                                folderName="stores/seo"
                                                label="favicon"
                                                onUploadComplete={(url) => setFormData(p => ({ ...p, favicon_url: url }))}
                                            >
                                                <Button size="sm" variant="ghost" className="text-[9px] font-black uppercase text-pink-500">Upload Icon</Button>
                                            </FileUpload>
                                        </div>
                                    </div>

                                    <div className="bg-[#121217] border border-white/5 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                        <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600">
                                            <Upload className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Small (16x16)</p>
                                            <p className="text-[8px] text-zinc-700 uppercase mt-1">Legacy</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 bg-pink-500/5 border border-pink-500/10 rounded-xl p-4 flex gap-4 items-center">
                                        <AlertCircle className="h-4 w-4 text-pink-500 shrink-0" />
                                        <p className="text-[9px] text-zinc-400 leading-normal">
                                            For best results across high-density displays (Retina), upload a square PNG at 512x512px. We will auto-generate all required sizes.
                                        </p>
                                    </div>
                                </div>

                                {/* Preview Slot */}
                                <div className="md:col-span-4 bg-[#121217] border border-white/5 rounded-xl p-6 flex flex-col h-full">
                                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-6">Live Browser Preview</h3>

                                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-4">
                                        {/* Browser Tab Simulation */}
                                        <div className="w-full max-w-[200px] bg-[#1a1a1f] rounded-t-lg border border-white/10 overflow-hidden shadow-2xl">
                                            <div className="bg-[#2a2a2f] px-3 py-2 flex items-center gap-2 border-b border-black/20">
                                                <div className="h-3 w-3 bg-zinc-900 rounded flex items-center justify-center">
                                                    {formData.favicon_url ? <img src={formData.favicon_url} className="w-2 h-2" /> : <div className="h-1 w-1 bg-pink-500 rounded-px" />}
                                                </div>
                                                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="w-1/2 h-full bg-zinc-600" />
                                                </div>
                                                <div className="h-1.5 w-1.5 bg-zinc-800 rounded-full" />
                                            </div>
                                            <div className="p-3 bg-[#1a1a1f]">
                                                <div className="w-1/3 h-1 bg-zinc-800 rounded-full mb-2" />
                                                <div className="w-full h-1 bg-zinc-900 rounded-full" />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Tab View Simulation</p>
                                            <p className="text-[8px] text-zinc-600 uppercase">Current icon appearance in Chrome dark mode</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SOCIAL PREVIEW (OPEN GRAPH) */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-500">Social Representation</h2>
                                <div className="h-px flex-1 bg-linear-to-r from-purple-500/20 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-[#121217] border-white/5 overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-[10px] uppercase tracking-widest text-zinc-500">Open Graph Assets</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6 pt-0">
                                        <div className="aspect-video bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center p-8 group relative overflow-hidden">
                                            {formData.og_image_url ? (
                                                <img src={formData.og_image_url} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 mb-3">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-normal">Drop Brand Cover<br /><span className="text-[8px] font-normal opacity-50">1200 x 630 recommended</span></p>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <FileUpload
                                                    bucketName="cms_media"
                                                    folderName="stores/seo"
                                                    label="og_image"
                                                    onUploadComplete={(url) => setFormData(p => ({ ...p, og_image_url: url }))}
                                                >
                                                    <Button size="sm" variant="outline" className="text-[9px] font-black uppercase text-white border-white/20">Drop Image</Button>
                                                </FileUpload>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">OG Description Override</Label>
                                            <Textarea
                                                value={formData.seo_description}
                                                onChange={(e) => setFormData(p => ({ ...p, seo_description: e.target.value }))}
                                                placeholder="Brief summary for Facebook, X, and WhatsApp shares..."
                                                className="bg-black/40 border-white/5 min-h-[100px] text-[10px] py-4"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* SIGNAL & SERP PREVIEWS */}
                                <div className="bg-[#121217] border border-white/5 rounded-2xl p-6 relative overflow-hidden group min-h-[450px] flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                                            {previewTab === 'social' ? <Share2 className="h-3 w-3" /> : <Search className="h-3 w-3" />}
                                            {previewTab === 'social' ? 'Signal Preview' : 'SERP Simulation'}
                                        </h3>
                                        <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[8px] uppercase tracking-tighter">Live Preview</Badge>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center">
                                        {previewTab === 'social' ? (
                                            /* Signal/iMessage Bubble */
                                            <div className="mx-auto w-full max-w-[280px] bg-[#1a1a1f] rounded-2xl overflow-hidden shadow-2xl border border-white/5 group-hover:scale-[1.02] transition-transform duration-500">
                                                <div className="aspect-video bg-[#ff3b30] flex items-center justify-center relative border-b border-black/20">
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="text-white font-black text-2xl tracking-tighter uppercase italic text-center leading-none">AMERICANA<br /><span className="text-[7px] tracking-[0.4em] not-italic bg-white text-black px-2 py-0.5 mt-1 block w-fit mx-auto">Marketplace</span></h4>
                                                    </div>
                                                    {formData.og_image_url && (
                                                        <img src={formData.og_image_url} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" />
                                                    ) || (formData.logo_url && (
                                                        <img src={formData.logo_url} className="absolute inset-0 w-full h-full object-contain p-4 opacity-50 mix-blend-overlay" />
                                                    ))}
                                                </div>
                                                <div className="p-4 bg-zinc-900/90 backdrop-blur-md">
                                                    <p className="text-[12px] font-bold text-white uppercase tracking-tight mb-0.5 line-clamp-1">
                                                        {formData.seo_title || activeStore.name || 'Americana Market'}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 mb-2 lowercase truncate">{formData.canonical_url?.replace('https://', '') || `${activeStore.slug}.americanatienda.com`}</p>
                                                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight italic">
                                                        {formData.seo_description || 'Soy la tienda que eleva tus ventas.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            /* GOOGLE SERP Simulation from mockup */
                                            <div className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5 shadow-2xl mx-auto w-full max-w-[320px] space-y-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center">
                                                        <Search className="h-2 w-2 text-zinc-500" />
                                                    </div>
                                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">SERP Simulation</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-[#8ab4f8] text-[15px] font-medium hover:underline cursor-pointer leading-tight">
                                                        {formData.seo_title || `${activeStore.name} | Americana Market`}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-[11px] text-[#34a853] truncate">
                                                        <span>https://americanatienda.com</span>
                                                        <ChevronRight className="h-2 w-2 text-zinc-600" />
                                                        <span className="text-zinc-500">shop...</span>
                                                    </div>
                                                    <p className="text-[11px] text-zinc-400 line-clamp-2 font-sans leading-relaxed">
                                                        {formData.seo_description || 'Soy la tienda que eleva tus ventas.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Platform Selectors / Tabs */}
                                    <div className="flex justify-center gap-3 pt-8 pb-2">
                                        <button
                                            onClick={() => setPreviewTab('google')}
                                            className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                previewTab === 'google' ? "bg-white/10 text-white shadow-lg border border-white/10" : "bg-zinc-800/30 text-zinc-600 hover:text-zinc-400"
                                            )}
                                        >
                                            <Search className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setPreviewTab('social')}
                                            className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                previewTab === 'social' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-zinc-800/30 text-zinc-600 hover:text-zinc-400"
                                            )}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </button>
                                        <div className="w-px h-6 bg-white/5 my-auto mx-2" />
                                        <button
                                            onClick={handleCopyLink}
                                            className="h-10 px-4 rounded-xl bg-zinc-800/30 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Copy className="h-3 w-3" /> Copy Link
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="h-10 px-4 rounded-xl bg-pink-500 text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Share2 className="h-3 w-3" /> Share Store
                                        </button>
                                    </div>

                                    {/* Background glow */}
                                    <div className={cn(
                                        "absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] rounded-full transition-colors duration-1000",
                                        previewTab === 'social' ? "bg-blue-500/10" : "bg-green-500/10"
                                    )} />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Dashboard / Intelligence Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* SEO HEALTH SCORE */}
                        <Card className="bg-[#121217] border-white/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-3xl rounded-full" />
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex items-center justify-center gap-2">
                                    <Sparkles className="h-3 w-3 text-pink-500" /> SEO Intelligence
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 flex flex-col items-center">
                                <div className="relative h-40 w-40 flex items-center justify-center">
                                    <svg className="h-full w-full transform -rotate-90">
                                        <circle
                                            cx="80" cy="80" r="70"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="8" className="text-zinc-900"
                                        />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="8"
                                            strokeDasharray={`${(healthScore / 100) * 440} 440`}
                                            className="text-pink-500 transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl font-mono font-black text-white">{healthScore}</span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Health Score</span>
                                    </div>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                        <span>Title Accuracy</span>
                                        <span className={cn(formData.seo_title.length >= 40 && formData.seo_title.length <= 60 ? "text-green-500" : "text-zinc-700")}>
                                            {formData.seo_title.length}/60
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                        <span>Description Density</span>
                                        <span className={cn(formData.seo_description.length >= 120 && formData.seo_description.length <= 160 ? "text-green-500" : "text-zinc-700")}>
                                            {formData.seo_description.length}/160
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                                        <span>Asset Compliance</span>
                                        <span className={cn(formData.og_image_url && formData.favicon_url ? "text-green-500" : "text-zinc-700")}>
                                            {formData.og_image_url && formData.favicon_url ? '100%' : '50%'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI META AGENT */}
                        <Card className="bg-linear-to-br from-indigo-500/10 via-[#121217] to-purple-500/10 border-indigo-500/20 relative overflow-hidden group border-dashed">
                            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-serif italic text-white text-lg">AI Meta Agent</h4>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Metadata Curation</p>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[200px]">
                                    Let our curation agent analyze your boutique\'s essence and generate high-converting SEO templates for all your products.
                                </p>
                                <Button
                                    onClick={() => toast.info('AI Curation Agent initializing...')}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest mt-2 h-10 shadow-lg shadow-indigo-500/20"
                                >
                                    Launch AI Agent
                                </Button>
                                <div className="text-[9px] text-indigo-500/50 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse" /> Agent Online
                                </div>
                            </CardContent>
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
                        </Card>

                        {/* Quick Tools */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 px-2">Diagnostic Tools</h3>
                            <div className="bg-[#121217] border border-white/5 rounded-xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-pink-500">
                                    <Search className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">SERP Inspector</p>
                                    <p className="text-[8px] text-zinc-600 uppercase">Preview in Google results</p>
                                </div>
                            </div>
                            <div className="bg-[#121217] border border-white/5 rounded-xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-cyan-500">
                                    <Globe className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">Index Status</p>
                                    <p className="text-[8px] text-zinc-600 uppercase">Check crawl accessibility</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span>{activeStore.name} • Growth Suite 2024</span>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors underline-offset-4 hover:underline decoration-pink-500/50">SEO Documentation</span>
                        <span className="hover:text-white cursor-pointer transition-colors">API Endpoint</span>
                        <span className="hover:text-white cursor-pointer transition-colors text-zinc-800">Crawl Logic</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
