"use client"

import React, { useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, Undo, Redo, Plus, Layers, Palette, Image as ImageIcon, Grid, Settings, HelpCircle, Search, Type, AlignLeft, AlignCenter, AlignRight, Eye, History, ZoomIn, ZoomOut, PlayCircle, Code, Square, LayoutGrid, X, MousePointer2, Hammer, ChevronRight, List, FolderOpen } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SupportCenter } from '@/components/builder/panels/support-center'
import { MediaManager } from '@/components/builder/panels/media-manager'
import { SitemapVisualizer } from '@/components/builder/panels/sitemap-visualizer'
import { MotionPanel } from '@/components/builder/panels/motion-panel'
import { InfrastructureMonitor } from '@/components/builder/panels/infrastructure-monitor'
import { PropertiesPanel } from '@/components/builder/panels/properties-panel'
import { LayoutOrganizer } from '@/components/builder/panels/layout-organizer'
import { PagesManager } from '@/components/builder/panels/pages-manager'

import { useBuilderStore } from '@/components/builder/store';

import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Container, Text, Button } from '@/components/builder/user-components';

export function BuilderShell() {
    return (
        <Editor resolver={{ Container, Text, Button }}>
            <BuilderUI />
        </Editor>
    )
}

function BuilderUI() {
    const {
        device,
        setDevice,
        viewportSize,
        isMobileOverrideActive,
        activeModal,
        setActiveModal,
        activePanel,
        setActivePanel,
        zoom
    } = useBuilderStore()

    const { connectors, query } = useEditor()
    const supabase = createClient()
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            const json = query.serialize()
            // In site-config, we might be saving site-wide settings
            // For now, let's assume we save to a special 'site_layouts' or similar
            const { error } = await supabase
                .from('site_content')
                .upsert({
                    key: 'home_layout_json',
                    value: json
                }, { onConflict: 'key' })

            if (error) throw error
            toast.success('Marketplace layout published successfully!')
        } catch (error) {
            console.error('Publish error:', error)
            toast.error('Failed to publish layout')
        } finally {
            setIsPublishing(false)
        }
    }

    // Global Escape Key Handler to close modals
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModal(null)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setActiveModal])

    return (
        <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#FF007F] selection:text-white overflow-hidden">
            {/* HEADER */}
            <header className="h-14 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 bg-white dark:bg-[#141414] sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF007F] rounded flex items-center justify-center">
                            <Hammer className="text-white w-4 h-4" />
                        </div>
                        <span className="font-display text-xs tracking-widest font-bold hidden md:block">AMERICANA NOIR</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                    <nav className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition">Home</button>
                        <ChevronRight className="w-3 h-3" />
                        <button className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded">Landing Page v2</button>
                    </nav>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setDevice('desktop')}
                        className={cn("p-1.5 rounded transition", device === 'desktop' ? "bg-white dark:bg-white/10 shadow-sm text-[#FF007F]" : "hover:bg-white dark:hover:bg-white/10 text-slate-400")}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDevice('tablet')}
                        className={cn("p-1.5 rounded transition", device === 'tablet' ? "bg-white dark:bg-white/10 shadow-sm text-[#FF007F]" : "hover:bg-white dark:hover:bg-white/10 text-slate-400")}
                    >
                        <Tablet className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDevice('mobile')}
                        className={cn("p-1.5 rounded transition", device === 'mobile' ? "bg-white dark:bg-white/10 shadow-sm text-[#FF007F]" : "hover:bg-white dark:hover:bg-white/10 text-slate-400")}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1"></div>
                    <span className="text-[10px] font-mono px-2 text-slate-500">
                        {device === 'mobile' ? '375px × 667px' : device === 'tablet' ? '768px × 1024px' : '100%'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-white transition"><Undo className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-white transition"><Redo className="w-4 h-4" /></button>
                    </div>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-[#FF007F] hover:opacity-90 text-white font-display text-[10px] tracking-widest px-6 py-2.5 rounded uppercase font-bold transition-all shadow-lg shadow-[#FF007F]/20 disabled:opacity-50"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* SIDEBAR LEFT (TOOLBOX) */}
                <aside className="w-16 flex flex-col items-center py-6 gap-8 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#141414] z-40">
                    <button className="p-2 text-slate-400 hover:text-[#FF007F] transition" title="Dashboard">
                        <LayoutGrid className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActivePanel('layout')}
                        className={cn("p-2 transition border-r-2 -mr-[2px]", activePanel === 'layout' ? "text-[#FF007F] border-[#FF007F]" : "text-slate-400 hover:text-[#FF007F] border-transparent")}
                        title="Layout Organizer"
                    >
                        <List className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActivePanel('pages')}
                        className={cn("p-2 transition", activePanel === 'pages' ? "text-[#FF007F]" : "text-slate-400 hover:text-[#FF007F]")}
                        title="Pages"
                    >
                        <Layers className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActivePanel('motion')}
                        className={cn("p-2 transition", activePanel === 'motion' ? "text-[#FF007F]" : "text-slate-400 hover:text-[#FF007F]")}
                        title="Motion & Interaction Engine"
                    >
                        <PlayCircle className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveModal('media')}
                        className={cn("p-2 transition", activeModal === 'media' ? "text-[#FF007F]" : "text-slate-400 hover:text-[#FF007F]")}
                        title="Media Library"
                    >
                        <FolderOpen className="w-6 h-6" />
                    </button>

                    <div className="mt-auto flex flex-col gap-6">
                        <button
                            onClick={() => setActiveModal('infrastructure')}
                            className={cn("p-2 transition", activeModal === 'infrastructure' ? "text-[#FF007F]" : "text-slate-500 hover:text-white")}
                            title="Infrastructure Monitor"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setActiveModal('help')}
                            className="p-2 text-[#FF007F] transition animate-pulse hover:animate-none"
                            title="Help & Support"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </aside>



                {/* PANELS OVERLAY */}
                {/* PagesManager is now replaced by the full-screen SitemapVisualizer in the main area */}
                {/* {activePanel === 'pages' && (
                    <PagesManager onClose={() => setActivePanel('layout')} />
                )} */}

                {/* LAYOUT ORGANIZER (BLUEPRINT MODE) */}


                {/* SIDEBAR LEFT EXPANDED (ADD ELEMENTS) - Only visible if activePanel is 'elements' */}
                {activePanel === 'elements' && (
                    <aside className="w-72 bg-white dark:bg-[#141414] border-r border-slate-200 dark:border-white/10 flex flex-col z-30 shadow-2xl animate-in slide-in-from-left-4 duration-300">
                        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <h2 className="font-display text-[10px] tracking-tighter uppercase font-bold text-white">Add Elements</h2>
                            <button onClick={() => setActivePanel('pages')} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input className="w-full bg-slate-100 dark:bg-black/40 border-none text-xs pl-9 focus:ring-1 focus:ring-[#FF007F] rounded py-2.5 text-white placeholder:text-slate-600" placeholder="Search components..." type="text" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    ref={ref => (connectors as any).create(ref, <Element is={Container} padding="p-8" background="bg-white" canvas />)}
                                    className="flex flex-col items-center gap-2 p-3 rounded bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5 transition group cursor-grab active:cursor-grabbing"
                                >
                                    <Square className="text-slate-400 group-hover:text-white transition w-5 h-5 pointer-events-none" />
                                    <span className="text-[10px] text-slate-400 font-medium pointer-events-none">Container</span>
                                </button>
                                <button
                                    ref={ref => (connectors as any).create(ref, <Text text="Headline Text" fontSize="text-4xl" />)}
                                    className="flex flex-col items-center gap-2 p-3 rounded bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5 transition group cursor-grab active:cursor-grabbing"
                                >
                                    <Type className="text-slate-400 group-hover:text-white transition w-5 h-5 pointer-events-none" />
                                    <span className="text-[10px] text-slate-400 font-medium pointer-events-none">Text</span>
                                </button>
                                <button
                                    ref={ref => (connectors as any).create(ref, <Button>Click Me</Button>)}
                                    className="flex flex-col items-center gap-2 p-3 rounded bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5 transition group cursor-grab active:cursor-grabbing"
                                >
                                    <MousePointer2 className="text-slate-400 group-hover:text-white transition w-5 h-5 pointer-events-none" />
                                    <span className="text-[10px] text-slate-400 font-medium pointer-events-none">Button</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* MAIN CANVAS AREA (or VIEW MODES) */}
                <main className="flex-1 bg-[#1A1A1A] relative overflow-hidden flex flex-col">

                    {/* View Switch: If 'pages' is active, show Visual Sitemap. Else show Canvas. */}
                    {activePanel === 'pages' ? (
                        <SitemapVisualizer />
                    ) : (
                        <div className="flex-1 relative overflow-auto flex items-center justify-center p-8">
                            <div
                                className={cn(
                                    "bg-white shadow-2xl transition-all duration-300 origin-top",
                                    device === 'mobile' ? "rounded-[3rem] border-[8px] border-[#222]" :
                                        device === 'tablet' ? "rounded-xl border-[12px] border-[#222]" : "rounded-none"
                                )}
                                style={{
                                    width: viewportSize.width,
                                    height: viewportSize.height,
                                    transform: `scale(${zoom / 100})`,
                                    minHeight: device === 'desktop' ? '100%' : undefined
                                }}
                            >
                                {/* CRAFT.JS FRAME - THE REAL EDITOR CONTENT */}
                                <div className="w-full h-full bg-white relative overflow-y-auto">
                                    {/* Mobile Dynamic Island Simulator */}
                                    {device === 'mobile' && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                                            <div className="w-16 h-4 bg-[#111] rounded-full flex items-center gap-2 px-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></div>
                                                <div className="w-1 h-1 rounded-full bg-[#333]"></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="h-full">
                                        <Frame>
                                            <Element is={Container} padding="p-12" background="bg-white" canvas>
                                                <Text text="HERO SECTION" fontSize="text-4xl" textAlign="text-center" />
                                                <Element is={Container} padding="p-8" background="bg-slate-50" canvas>
                                                    <Text text="Drag elements here to build your layout." color="text-slate-500" textAlign="text-center" />
                                                </Element>
                                            </Element>
                                        </Frame>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOTTOM BAR - Floating Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/90 backdrop-blur border border-white/10 rounded-full shadow-2xl z-40">
                        <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full animate-pulse", device !== 'desktop' ? "bg-[#FF007F]" : "bg-green-500")}></span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                                {device !== 'desktop' ? "Mobile Editing" : "Live Sync"}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <button className="text-slate-400 hover:text-[#FF007F] transition"><ZoomIn className="w-4 h-4" /></button>
                            <span className="text-[10px] font-mono text-slate-500">85%</span>
                            <button className="text-slate-400 hover:text-[#FF007F] transition"><ZoomOut className="w-4 h-4" /></button>
                        </div>
                    </div>
                </main>

                {/* SIDEBAR RIGHT (PROPERTIES or LAYERS or MOTION) */}
                {activePanel === 'layout' ? (
                    <LayoutOrganizer />
                ) : activePanel === 'motion' ? (
                    <MotionPanel />
                ) : (
                    <PropertiesPanel activePanel={activePanel} />
                )}
            </div>

            {/* FLOATING ZOOM CONTROLS */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#141414] border border-slate-200 dark:border-white/10 shadow-2xl rounded-full px-4 py-2 flex items-center gap-4 z-50">
                <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full animate-pulse", device !== 'desktop' ? "bg-[#FF007F]" : "bg-green-500")}></span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                        {device !== 'desktop' ? "Mobile Editing" : "Live Sync"}
                    </span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10"></div>
                <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-[#FF007F] transition"><ZoomIn className="w-4 h-4" /></button>
                    <span className="text-[10px] font-mono text-slate-500">85%</span>
                    <button className="text-slate-400 hover:text-[#FF007F] transition"><ZoomOut className="w-4 h-4" /></button>
                </div>
                {/* GLOBAL MODALS - Rendered at root level to ensure proper z-index stacking */}
                {activeModal === 'help' && <SupportCenter />}
                {activeModal === 'media' && <MediaManager />}
                {activeModal === 'infrastructure' && <InfrastructureMonitor />}
            </div>
        </div>
    )
}
