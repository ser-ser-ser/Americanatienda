'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    LayoutTemplate,
    Monitor,
    Smartphone,
    Save,
    Globe,
    Video,
    Grid,
    BookOpen,
    Store,
    Layout,
    Plus,
    GripVertical,
    Edit2,
    Eye,
    EyeOff,
    Settings,
    ChevronDown,
    Search,
    Type,
    Image as ImageIcon,
    X,
    Users
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function LandingPageBuilder() {
    const [selectedSection, setSelectedSection] = useState('hero')
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

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
                        <p className="text-[10px] text-zinc-500 font-mono">Landing Page Builder v1.0.4</p>
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
                    <Button variant="ghost" className="text-zinc-400 hover:text-white border border-white/10 h-8 text-xs font-bold uppercase tracking-wider">
                        Save Draft
                    </Button>
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white h-8 text-xs font-bold uppercase tracking-wider">
                        Publish
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
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
                            label="Featured Categories"
                            isActive={selectedSection === 'categories'}
                            onClick={() => setSelectedSection('categories')}
                        />
                        <SectionItem
                            icon={BookOpen}
                            label="Editorial Collection"
                            isActive={selectedSection === 'editorial'}
                            onClick={() => setSelectedSection('editorial')}
                        />
                        <SectionItem
                            icon={Store}
                            label="Niche Shops Grid"
                            isActive={selectedSection === 'shops'}
                            onClick={() => setSelectedSection('shops')}
                        />
                        <SectionItem
                            icon={Layout}
                            label="Footer"
                            isActive={selectedSection === 'footer'}
                            onClick={() => setSelectedSection('footer')}
                        />
                    </div>

                    <div className="p-4 border-t border-white/5">
                        <Button variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-500 text-xs uppercase font-bold h-10">
                            <Plus className="mr-2 h-4 w-4" /> Add New Section
                        </Button>
                    </div>
                </aside>


                {/* CENTER CANVAS: PREVIEW */}
                <main className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-8">

                    {/* Canvas Container */}
                    <div className={`
                        transition-all duration-300 relative bg-black shadow-2xl overflow-y-auto border border-white/5
                        ${viewMode === 'desktop' ? 'w-full max-w-[1000px] h-full rounded-sm' : 'w-[375px] h-[667px] rounded-3xl border-zinc-800'}
                    `}>
                        {/* HERO SECTION PREVIEW */}
                        <div className={`relative group border-2 ${selectedSection === 'hero' ? 'border-pink-500' : 'border-transparent hover:border-pink-500/50'} transition-all`}>
                            {/* Hover Edit Tools */}
                            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" className="h-8 w-8 bg-pink-600 hover:bg-pink-700 text-white rounded shadow-lg">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" className="h-8 w-8 bg-black hover:bg-zinc-900 border border-white/20 text-white rounded shadow-lg">
                                    <EyeOff className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                                <span className="bg-pink-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                    New Collection
                                </span>
                            </div>

                            <div className="h-[500px] w-full bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                                {/* Background Video Placeholder */}
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
                                    alt="Hero Background"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                                <div className="relative z-10 text-center px-6">
                                    <h2 className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none mb-4 mix-blend-overlay opacity-90">
                                        OFF LIMITS
                                    </h2>
                                    <p className="text-zinc-300 max-w-lg mx-auto mb-8 font-medium">
                                        Defying the ordinary. Curated selection for the avant-garde subculture.
                                    </p>
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black uppercase font-bold tracking-widest px-8 py-6 rounded-none text-xs">
                                        Explore Shops
                                    </Button>
                                    <div className="border-b border-dashed border-white/20 w-48 mx-auto mt-4" />
                                </div>
                            </div>
                        </div>

                        {/* FEATURED CATEGORIES PREVIEW */}
                        <div className={`bg-black py-16 px-12 group border-2 ${selectedSection === 'categories' ? 'border-pink-500' : 'border-transparent hover:border-pink-500/50'} transition-all`}>
                            <div className="flex justify-between items-end mb-10">
                                <h3 className="text-3xl font-bold text-white tracking-tight">Featured Categories</h3>
                                <a href="#" className="text-pink-600 text-sm font-bold uppercase tracking-wider underline underline-offset-4">View All Categories</a>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { title: 'NEO-GOTH', items: '240+', img: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=2787&auto=format&fit=crop' },
                                    { title: 'HIGH-STREET', items: '156+', img: 'https://images.unsplash.com/photo-1596766465451-b8ae029f6d33?q=80&w=2787&auto=format&fit=crop' },
                                    { title: 'VELVET & LACE', items: '89+', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop' }
                                ].map((cat, i) => (
                                    <div key={i} className="aspect-[3/4] bg-zinc-900 relative group/card cursor-pointer overflow-hidden">
                                        <img src={cat.img} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-80 transition-opacity grayscale hover:grayscale-0 duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6">
                                            <h4 className="text-3xl font-black uppercase text-white leading-none mb-1">{cat.title.split('-').map((w, j) => <span key={j} className="block">{w}</span>)}</h4>
                                            <span className="text-xs text-zinc-400 font-mono">{cat.items} Items</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PLACEHOLDER FOR DROP */}
                        <div className="h-48 border-2 border-dashed border-zinc-800 m-8 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-4 hover:border-zinc-600 hover:text-zinc-500 transition-colors cursor-pointer">
                            <Plus className="h-8 w-8" />
                            <span className="font-bold uppercase tracking-widest text-xs">Drop Section Here</span>
                        </div>

                    </div>

                    {/* Canvas Controls */}
                    <div className="absolute bottom-6 left-6 flex gap-2">
                        <Button size="icon" variant="outline" className="rounded-full h-10 w-10 bg-black/50 border-white/10 text-white backdrop-blur">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </main>


                {/* RIGHT SIDEBAR: PROPERTIES */}
                <aside className="w-80 bg-[#161616] border-l border-white/5 flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 border-b border-white/5 bg-zinc-900/50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-1">Active Section</div>
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-white">Hero Banner 01</h2>
                            <Settings className="h-4 w-4 text-zinc-500" />
                        </div>
                    </div>

                    <div className="p-6 space-y-8">

                        {/* Typography Group */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Type className="h-4 w-4 text-zinc-500" />
                                <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Headline Typography</span>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs text-zinc-500">Main Heading</Label>
                                <Input className="bg-zinc-900 border-zinc-700 h-9 font-bold text-white" defaultValue="OFF LIMITS" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-xs h-8 hover:bg-pink-900 hover:text-pink-500 hover:border-pink-900">Impact Bold</Button>
                                <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-xs h-8 text-zinc-400">Inter Tight</Button>
                            </div>
                        </div>

                        {/* Media Group */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="h-4 w-4 text-zinc-500" />
                                <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Background Media</span>
                            </div>

                            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer border border-zinc-700">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                    <Button size="sm" variant="secondary" className="text-xs h-7">Change Media</Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-zinc-300">Loop Video</Label>
                                <Switch defaultChecked className="data-[state=checked]:bg-pink-600" />
                            </div>
                        </div>

                        {/* Featured Shops Picker (Mock) */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Store className="h-4 w-4 text-zinc-500" />
                                <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Featured Shops</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-pink-900/20 rounded flex items-center justify-center text-pink-500">
                                            <Store className="h-3 w-3" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-300">Smoke & Mirrors</span>
                                    </div>
                                    <X className="h-3 w-3 text-zinc-600 hover:text-red-500 cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-pink-900/20 rounded flex items-center justify-center text-pink-500">
                                            <Store className="h-3 w-3" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-300">Velvet Bondage</span>
                                    </div>
                                    <X className="h-3 w-3 text-zinc-600 hover:text-red-500 cursor-pointer" />
                                </div>

                                <Button variant="outline" className="w-full border-zinc-800 text-zinc-500 hover:text-white h-8 text-xs">
                                    <Search className="mr-2 h-3 w-3" /> Browse Shop Directory
                                </Button>
                            </div>
                        </div>

                    </div>

                    <div className="mt-auto p-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white">
                            Advanced Settings
                            <ChevronDown className="h-3 w-3" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

function SectionItem({ icon: Icon, label, isActive, onClick }: any) {
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
