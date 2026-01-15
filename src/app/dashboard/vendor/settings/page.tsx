'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Save, ExternalLink, Image as ImageIcon, MapPin, Globe, Mail, UploadCloud, CheckCircle2, Video, Sparkles } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'

export default function VendorSettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    // CONSUME CONTEXT: No more local fetching of the store list/single store
    const { activeStore, refreshStores, isLoading } = useVendor()

    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        theme_color: '#000000',
        logo_url: '',
        cover_image_url: '',
        cover_video_url: '',
        website: '',
        instagram_handle: '',
        niche: ''
    })

    // Sync activeStore to form whenever it changes
    useEffect(() => {
        if (activeStore) {
            setFormData({
                name: activeStore.name || '',
                slug: activeStore.slug || '',
                description: activeStore.description || '',
                theme_color: activeStore.theme_color || '#ec4899',
                logo_url: activeStore.logo_url || '',
                cover_image_url: activeStore.cover_image_url || '',
                cover_video_url: activeStore.cover_video_url || '',
                website: activeStore.website || '',
                instagram_handle: activeStore.instagram_handle || '',
                niche: activeStore.niche || ''
            })
        }
    }, [activeStore])

    const handleSubmit = async () => {
        setSaving(true)
        try {
            if (!activeStore) return

            const { error } = await supabase
                .from('stores')
                .update({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    theme_color: formData.theme_color,
                    logo_url: formData.logo_url,
                    cover_image_url: formData.cover_image_url,
                    cover_video_url: formData.cover_video_url,
                    website: formData.website,
                    instagram_handle: formData.instagram_handle,
                    niche: formData.niche
                })
                .eq('id', activeStore.id)

            if (error) throw error
            toast.success('Store Portal Updated Successfully')

            // Refresh context so the Layout and other parts see the new name/logo etc.
            await refreshStores()

        } catch (error: any) {
            toast.error(error.message || 'Failed to update store')
        } finally {
            setSaving(false)
        }
    }

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin mr-2" /> Loading Portal...</div>

    // If loaded but no active store (e.g. user has no stores), Layout should redirect, but handle safe case:
    if (!activeStore) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">No store selected.</div>

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-5xl mx-auto">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Store Portal Editor</h1>
                        <p className="text-zinc-500">Manage brand identity for <span className="text-white font-bold">{activeStore.name}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <a href={`/shops/${formData.slug || 'store'}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> View Live Store
                            </a>
                        </Button>
                        <Button onClick={handleSubmit} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white font-bold min-w-[140px]">
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* VISUAL EDITOR SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Branding & Visuals (The "Portal" Look) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Cover & Identity Card */}
                        {/* SECTION A: Store Header & Branding (Horizontal) */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold font-serif text-white">Store Header</h2>
                                    <p className="text-zinc-400 text-xs">Appears at the top of your private shop page.</p>
                                </div>
                                <Badge variant="outline" className="text-zinc-400 border-zinc-700">Desktop & Mobile Web</Badge>
                            </div>

                            {/* Horizontal Cover Preview like existing store page */}
                            <div className="h-48 md:h-64 bg-zinc-800 relative group/cover">
                                {formData.cover_image_url ? (
                                    <img src={formData.cover_image_url} alt="Shop Header" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <ImageIcon className="h-10 w-10 opacity-50" />
                                        <span className="ml-2 font-bold uppercase tracking-widest text-xs">Upload Header Image</span>
                                    </div>
                                )}

                                {/* Header Upload Controls */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <FileUpload
                                        bucketName="cms_media"
                                        folderName="stores"
                                        label="banner"
                                        aspectRatio={3 / 1}
                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                                    >
                                        <div className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "cursor-pointer")}>
                                            <ImageIcon className="mr-2 h-4 w-4" /> Upload Banner
                                        </div>
                                    </FileUpload>
                                    <p className="text-white/80 text-xs font-medium drop-shadow-md">Recommended: 1920x640px</p>
                                </div>
                            </div>

                            {/* Identity Logic (Logo + Name) */}
                            <div className="px-8 pb-8 relative">
                                <div className="flex justify-between items-end -mt-12 mb-6">
                                    {/* Logo Upload */}
                                    <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-black border-4 border-zinc-900 overflow-hidden shadow-xl group/logo">
                                        {formData.logo_url ? (
                                            <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 font-bold">LOGO</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="scale-75">
                                                <FileUpload
                                                    label="Upload"
                                                    bucketName="cms_media"
                                                    folderName="stores"
                                                    aspectRatio={1}
                                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Store Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="text-3xl font-serif font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-zinc-700 text-white"
                                            placeholder="Untitled Store"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-zinc-500 font-bold tracking-widest">About / Bio</Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="bg-zinc-950/50 border-zinc-800 text-zinc-300 min-h-[80px]"
                                            placeholder="Describe your brand..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Slug</Label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                                                className="bg-zinc-950/50 border-zinc-800 font-mono text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Brand Color</Label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={formData.theme_color}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))}
                                                    className="h-9 w-12 rounded bg-transparent border border-zinc-700 p-0 cursor-pointer"
                                                />
                                                <Input value={formData.theme_color} readOnly className="bg-zinc-950/50 border-zinc-800 font-mono" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION B: Portal Story (Vertical Video) */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6 relative">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left: Context */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-lg font-bold font-serif text-white">Portal Story</h2>
                                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white">New</Badge>
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            This is your <strong>Active Representation</strong> on the main marketplace feed.
                                            Instead of a static banner, users see this vertical card.
                                        </p>
                                    </div>

                                    <div className="bg-black/40 rounded-lg p-4 border border-zinc-800 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-pink-500/10 rounded-full text-pink-500"><Video className="h-4 w-4" /></div>
                                            <div>
                                                <p className="text-sm text-zinc-200 font-bold">Roleplay & Vibes</p>
                                                <p className="text-xs text-zinc-500">Upload a video that sets the mood. Avoid text-heavy graphics.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><Sparkles className="h-4 w-4" /></div>
                                            <div>
                                                <p className="text-sm text-zinc-200 font-bold">Living Card</p>
                                                <p className="text-xs text-zinc-500">This replaces the old static cover on the homepage.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Actions */}
                                    <div className="pt-4 flex flex-col gap-3">
                                        <Label className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Actions</Label>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <FileUpload
                                                    bucketName="cms_media"
                                                    folderName="stores"
                                                    label="story-vid"
                                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, cover_video_url: url }))}
                                                >
                                                    <div className={cn(buttonVariants({ variant: "default" }), "w-full bg-white text-black hover:bg-zinc-200 cursor-pointer")}>
                                                        <Video className="mr-2 h-4 w-4" /> Upload Video
                                                    </div>
                                                </FileUpload>
                                            </div>
                                            <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={() => {
                                                const url = prompt("Enter Video URL:", formData.cover_video_url)
                                                if (url) setFormData(prev => ({ ...prev, cover_video_url: url }))
                                            }}>
                                                Use URL
                                            </Button>
                                        </div>
                                        {formData.cover_video_url && (
                                            <Button variant="ghost" className="text-red-500 text-xs hover:text-red-400 hover:bg-red-500/10 self-start" onClick={() => setFormData(prev => ({ ...prev, cover_video_url: '' }))}>
                                                Remove Video
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Vertical Preview */}
                                <div className="mx-auto md:mx-0 w-[240px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border-4 border-zinc-800 shadow-2xl relative group/preview">
                                    {formData.cover_video_url ? (
                                        <video
                                            src={formData.cover_video_url}
                                            className="w-full h-full object-cover"
                                            autoPlay muted loop playsInline
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-900">
                                            <Video className="h-8 w-8 text-zinc-600 mb-3" />
                                            <p className="text-xs text-zinc-500">No Portal Video Active</p>
                                            <p className="text-[10px] text-zinc-600 mt-2">Will fallback to Header Image</p>
                                        </div>
                                    )}

                                    {/* Mock UI Overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/60 flex flex-col justify-end p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur" />
                                            <div className="h-2 w-16 bg-white/40 rounded-full" />
                                        </div>
                                        <div className="h-2 w-24 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social & Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase font-bold tracking-widest text-zinc-400">Digital Presence</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Website URL</Label>
                                        <Input
                                            value={formData.website}
                                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                            className="bg-zinc-950 border-zinc-800"
                                            placeholder="https://"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Instagram</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
                                            <Input
                                                value={formData.instagram_handle}
                                                onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                                                className="bg-zinc-950 border-zinc-800 pl-7"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase font-bold tracking-widest text-zinc-400">Store Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                        <span className="text-sm font-medium">Verification</span>
                                        <Badge variant="outline" className={`${activeStore?.status === 'active' ? 'text-green-500 border-green-900 bg-green-900/20' : 'text-yellow-500 border-yellow-900 bg-yellow-900/20'}`}>
                                            {activeStore?.status?.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {activeStore?.status === 'active'
                                            ? 'Your store is live and visible on the marketplace.'
                                            : 'Your store is currently under review or pending setup.'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>

                    {/* RIGHT: Quick Stats / Preview helper (Static for now to mimic Admin Layout) */}
                    <div className="space-y-6">
                        <div className="p-6 bg-zinc-900 rounded-xl border border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Portal Preview</h3>
                            <div className="space-y-4">
                                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden relative shadow-lg">
                                    {/* Mini Mockup of Store Card */}
                                    <div className="h-2/3 bg-zinc-200 relative">
                                        {formData.cover_image_url && <img src={formData.cover_image_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="p-3">
                                        <div className="h-2 w-20 bg-zinc-800 rounded mb-2" />
                                        <div className="h-2 w-12 bg-zinc-300 rounded" />
                                    </div>
                                    {/* Logo Overlay */}
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 h-10 w-10 bg-black rounded-full border-2 border-white overflow-hidden">
                                        {formData.logo_url && <img src={formData.logo_url} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <p className="text-xs text-center text-zinc-500">
                                    Preview of your <strong>Store Card</strong> in the marketplace.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900 rounded-xl border border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Checklist</h3>
                            <div className="space-y-3">
                                <CheckItem label="Store Name" checked={!!formData.name} />
                                <CheckItem label="Cover Image" checked={!!formData.cover_image_url} />
                                <CheckItem label="Logo" checked={!!formData.logo_url} />
                                <CheckItem label="Description" checked={!!formData.description && formData.description.length > 20} />
                                <CheckItem label="Niche Selected" checked={!!formData.niche} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function CheckItem({ label, checked }: { label: string, checked: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${checked ? 'bg-green-500 border-green-500 text-black' : 'border-zinc-700 text-transparent'}`}>
                <CheckCircle2 className="h-3 w-3" />
            </div>
            <span className={`text-sm ${checked ? 'text-zinc-300' : 'text-zinc-500'}`}>{label}</span>
        </div>
    )
}
