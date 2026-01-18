'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
    Loader2,
    LayoutTemplate,
    Monitor,
    Smartphone,
    Save,
    Video,
    Grid,
    BookOpen,
    Layout,
    Edit2,
    Eye,
    Settings,
    Type,
    Image as ImageIcon,
    Undo,
    Redo,
    GripVertical,
    Trash2,
    Move,
    Search,
    Heart,
    User,
    Palette,
    Layers,
    PlusCircle,
    Store,
    PlayCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LandingPageBuilder() {
    const [selectedSection, setSelectedSection] = useState('hero')
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

    // CMS STATE
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [content, setContent] = useState<Record<string, string>>({})

    // 1. Fetch Data
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/admin/cms')
                const data = await res.json()
                if (data) setContent(data)
            } catch (e) {
                toast.error('Failed to load site content')
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    // 2. Handle Change
    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }))
    }

    // 3. Handle Save
    const handleSave = async () => {
        setSaving(true)
        try {
            const updates = Object.entries(content).map(([key, value]) => ({ key, value }))
            const res = await fetch('/api/admin/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates })
            })
            if (!res.ok) throw new Error('Failed to save')
            toast.success('Changes published to Landing Page!')
        } catch (e) {
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    // Default Fallbacks
    const heroTitle = content['home_hero_title'] || 'OFF LIMITS'
    const heroSubtitle = content['home_hero_subtitle'] || 'Defying the ordinary. Curated selection for the avant-garde subculture.'
    const heroDescription = content['home_hero_description'] || 'Join the anti-system. A decentralized marketplace for the irreverent.'
    const heroCta = content['home_hero_cta_text'] || 'JOIN THE REBELLION'
    const heroVideo = content['home_hero_video']

    return (
        <div className="flex flex-col h-screen bg-[#111] text-white overflow-hidden font-sans">
            {/* TOP HEADER BAR */}
            <header className="h-16 border-b border-white/10 bg-[#161616] flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-pink-600 rounded flex items-center justify-center">
                        <LayoutTemplate className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-tight">Master Admin Marketplace</h1>
                        <p className="text-[10px] text-zinc-500 font-mono">Visual Builder Active • Live Data</p>
                    </div>
                </div>

                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'desktop' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Monitor className="h-3.5 w-3.5" /> Desktop
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'mobile' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Smartphone className="h-3.5 w-3.5" /> Mobile
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white h-8 text-xs font-bold uppercase tracking-wider">
                        {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                        Publish Changes
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                        <div className={`h-2 w-2 rounded-full ${saving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                    </div>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT SIDEBAR: LAYERS / SECTIONS */}
                <aside className="w-64 bg-[#161616] border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Landing Sections</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <SectionItem
                            icon={Video}
                            label="Hero Video"
                            isActive={selectedSection === 'hero'}
                            onClick={() => setSelectedSection('hero')}
                        />
                        <SectionItem
                            icon={Grid}
                            label="Categories Grid"
                            isActive={selectedSection === 'categories'}
                            onClick={() => setSelectedSection('categories')}
                        />
                        <SectionItem
                            icon={BookOpen}
                            label="Editorial Content"
                            isActive={selectedSection === 'editorial'}
                            onClick={() => setSelectedSection('editorial')}
                        />
                        <div className="py-2 px-2">
                             <div className="h-px bg-white/5 w-full"></div>
                         </div>
                        <SectionItem
                            icon={Layout}
                            label="Global Navigation"
                            isActive={selectedSection === 'navigation'}
                            onClick={() => setSelectedSection('navigation')}
                        />
                        <SectionItem
                            icon={Layout}
                            label="Global Footer"
                            isActive={selectedSection === 'footer'}
                            onClick={() => setSelectedSection('footer')}
                        />
                    </div>
                    
                    <div className="p-2 border-t border-white/5 space-y-1">
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#1f0d1a] cursor-pointer text-[#cb90b7] transition-colors">
                            <Layers className="h-4 w-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Global Assets</p>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#1f0d1a] cursor-pointer text-[#cb90b7] transition-colors">
                            <Palette className="h-4 w-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Global Styles</p>
                        </div>
                    </div>
                </aside>

                {/* CENTER: CANVAS */}
                <main className="flex-1 bg-[#0a0408] relative overflow-hidden flex flex-col items-center">
                    
                    {/* Canvas Scroll Area */}
                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-10 flex flex-col items-center">
                         <div
                            className={cn(
                                "bg-black shadow-[0_0_100px_rgba(0,0,0,1)] transition-all duration-300 relative",
                                viewMode === 'desktop' ? "w-full max-w-[1200px]" : "w-[375px] min-h-[812px] rounded-[3rem] border-8 border-zinc-800 bg-black overflow-hidden"
                            )}
                        >
                            {/* Mock Navigation */}
                            <div className="group relative w-full h-20 border-b border-white/5 hover:border-[#f425af]/50 transition flex items-center justify-between px-10 bg-black/80 backdrop-blur-md sticky top-0 z-40">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f425af] text-[8px] font-black uppercase px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white">Global Header</div>
                                <div className="flex items-center gap-8">
                                    <span className="text-xl font-black tracking-tighter uppercase italic text-white">Americana</span>
                                    <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/70">
                                        <a className="hover:text-[#f425af]" href="#">Categories</a>
                                        <a className="hover:text-[#f425af]" href="#">Stores</a>
                                    </nav>
                                </div>
                                <div className="flex gap-4 text-white">
                                    <Search className="h-5 w-5" />
                                    <Heart className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Render Hero Section */}
                            <section
                                className={`group/block relative min-h-[700px] w-full border-2 transition overflow-hidden flex items-center justify-center text-center cursor-pointer ${selectedSection === 'hero' ? 'border-[#f425af]' : 'border-transparent hover:border-[#f425af]/50'}`}
                                onClick={() => setSelectedSection('hero')}
                            >
                                <div className="absolute right-6 top-6 z-30 flex gap-2 opacity-0 group-hover/block:opacity-100 transition-opacity">
                                    <div className="bg-[#f425af] text-white text-[10px] font-bold uppercase px-3 py-1 rounded shadow-lg">Settings</div>
                                </div>

                                <div className="absolute inset-0 z-0 bg-black">
                                    {heroVideo ? (
                                        <video
                                            src={heroVideo}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover opacity-60 grayscale brightness-[0.7]"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-900" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                                </div>

                                <div className="relative z-10 px-12 max-w-4xl">
                                    <div className="inline-block mb-6 rounded-full border border-[#f425af]/40 bg-[#f425af]/10 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f425af]">
                                        EST. 2026 • THE RESISTANCE
                                    </div>
                                    <h2 className="mb-2 text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white outline-none">
                                        {heroTitle}
                                    </h2>
                                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white/90 mb-8 outline-none">
                                        {heroSubtitle}
                                    </h3>
                                    <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-[#cb90b7]/80 mb-10 outline-none">
                                        {heroDescription}
                                    </p>
                                    <button className="rounded-full bg-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#f425af] hover:text-white hover:scale-105 active:scale-95">
                                        {heroCta}
                                    </button>
                                </div>
                            </section>

                             {/* Portals Section (Mock) */}
                            <section className="group/block relative w-full border border-transparent hover:border-[#f425af]/50 py-24 px-12 bg-[#080307]">
                                <div className="flex items-end justify-between mb-12">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f425af] mb-2 block">Autonomous Zones</span>
                                        <h3 className="text-5xl font-black uppercase tracking-tighter text-white">Independent Cells</h3>
                                    </div>
                                    <a className="text-[10px] font-bold uppercase tracking-widest border-b border-[#f425af] pb-1 text-white hover:text-[#f425af] transition-colors" href="#">View all Stores</a>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="group relative h-64 overflow-hidden rounded-xl bg-[#1f0d1a] border border-[#2d1224] transition-transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-zinc-800" />
                                        <div className="absolute bottom-6 left-8">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#f425af] mb-1 block">Portal 1</span>
                                            <h4 className="text-2xl font-bold uppercase text-white">Test Bureau</h4>
                                        </div>
                                    </div>
                                    <div className="group relative h-64 overflow-hidden rounded-xl bg-[#1f0d1a] border border-[#2d1224] transition-transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-zinc-800" />
                                        <div className="absolute bottom-6 left-8">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#f425af] mb-1 block">Portal 2</span>
                                            <h4 className="text-2xl font-bold uppercase text-white">The Lounge</h4>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* FLOATING ACTION BAR */}
                    <div className="fixed bottom-8 flex items-center gap-6 px-8 py-4 bg-[#120810]/90 backdrop-blur-xl rounded-full border border-[#2d1224] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[110]">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                            <div className="flex flex-col">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white">Live Edition</p>
                                <p className="text-[8px] font-medium uppercase tracking-widest text-[#cb90b7]">
                                    {saving ? 'Saving...' : 'Ready to publish'}
                                </p>
                            </div>
                        </div>
                        <div className="h-6 w-[1px] bg-[#2d1224]"></div>
                        <div className="flex items-center gap-2">
                            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#1f0d1a] text-[#cb90b7] hover:text-white transition-all"><Undo className="h-4 w-4" /></button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#1f0d1a] text-[#cb90b7] hover:text-white transition-all"><Redo className="h-4 w-4" /></button>
                        </div>
                        <div className="h-6 w-[1px] bg-[#2d1224]"></div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 bg-[#f425af] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(244,37,175,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Publish Changes
                        </button>
                    </div>
                </main>

                {/* RIGHT SIDEBAR: PROPERTIES */}
                <aside className="w-80 bg-[#161616] border-l border-white/5 flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#f425af]">Properties Panel</h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {selectedSection === 'hero' ? (
                            <>
                                {/* TEXT CONTENT */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Type className="h-3 w-3 text-zinc-500" />
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Typography</h3>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Main Headline</Label>
                                        <Input 
                                            value={heroTitle}
                                            onChange={(e) => handleChange('home_hero_title', e.target.value)}
                                            placeholder="OFF LIMITS"
                                            className="bg-zinc-900 border-zinc-800 text-white font-black uppercase text-xs tracking-tight"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Subtitle</Label>
                                        <Textarea
                                            value={heroSubtitle}
                                            onChange={(e) => handleChange('home_hero_subtitle', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 text-white min-h-[80px] text-xs leading-relaxed"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Description</Label>
                                        <Textarea
                                            value={heroDescription}
                                            onChange={(e) => handleChange('home_hero_description', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 text-white min-h-[80px] text-xs leading-relaxed"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">CTA Text</Label>
                                        <Input
                                            value={heroCta}
                                            onChange={(e) => handleChange('home_hero_cta_text', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 text-white text-xs font-bold uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* VIDEO CONFIG */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Video className="h-3 w-3 text-zinc-500" />
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Background Media</h3>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Video URL</Label>
                                        <Input
                                            value={heroVideo || ''}
                                            onChange={(e) => handleChange('home_hero_video', e.target.value)}
                                            placeholder="https://..."
                                            className="bg-zinc-900 border-zinc-800 text-white text-xs font-mono"
                                        />
                                        <p className="text-[9px] text-zinc-600">Direct MP4 or Cloudinary link required.</p>
                                    </div>

                                    <div className="aspect-video bg-zinc-900 rounded border border-white/5 overflow-hidden flex items-center justify-center relative">
                                         {heroVideo ? (
                                              <video src={heroVideo} className="w-full h-full object-cover" muted loop autoPlay />
                                         ) : (
                                              <div className="text-zinc-700 font-mono text-[9px] uppercase">No Preview</div>
                                         )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-zinc-300">Loop Video</Label>
                                        <Switch defaultChecked className="data-[state=checked]:bg-pink-600" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Settings className="h-8 w-8 mx-auto mb-2 text-zinc-700" />
                                <p className="text-xs text-zinc-500">Select the Hero section to edit properties.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}

function SectionItem({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`
                group flex items-center gap-3 p-3 mx-2 rounded-md cursor-pointer transition-all
                ${isActive ? 'bg-pink-600/10 text-pink-500 border border-pink-600/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'}
            `}
        >
            <GripVertical className="h-4 w-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className={`h-4 w-4 ${isActive ? 'text-pink-500' : 'text-zinc-500 group-hover:text-white'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500" />}
        </div>
    )
}
