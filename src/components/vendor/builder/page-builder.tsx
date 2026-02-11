'use client'

import React, { useEffect, useRef, useState } from 'react'
import grapesjs, { Editor } from 'grapesjs'
import GjsEditor, { Canvas } from '@grapesjs/react'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjsTailwind from 'grapesjs-tailwind'
import { Save, Eye, Smartphone, Monitor, Tablet, Loader2, ChevronLeft, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

interface PageBuilderProps {
    initialData?: any
    onSave: (data: any) => Promise<any>
    storeName: string
}

import { tailwindBlocks } from './tailwind-blocks'

export default function PageBuilder({ initialData, onSave, storeName }: PageBuilderProps) {
    const [saving, setSaving] = useState(false)
    const editorRef = useRef<Editor | null>(null)

    const onEditor = (editor: Editor) => {
        editorRef.current = editor

        // Register Custom Tailwind Blocks
        const bm = editor.BlockManager
        tailwindBlocks.forEach(block => {
            bm.add(block.id, {
                label: block.label,
                category: block.category,
                content: block.content,
                attributes: { class: 'gjs-fonts gjs-f-b1' } // Placeholder icon class
            })
        })

        // Configure Devices
        const deviceManager = editor.DeviceManager
        deviceManager.add({ id: 'desktop', name: 'Desktop', width: '' })
        deviceManager.add({ id: 'tablet', name: 'Tablet', width: '768px' })
        deviceManager.add({ id: 'mobile', name: 'Mobile', width: '320px' })

        // Initial load
        if (initialData) {
            editor.loadProjectData(initialData)
        }

        console.log('Editor initialized')
    }

    const handleSave = async () => {
        if (!editorRef.current) return

        setSaving(true)
        try {
            const projectData = editorRef.current.getProjectData()
            const html = editorRef.current.getHtml()
            const css = editorRef.current.getCss()

            await onSave({
                json: projectData,
                html,
                css
            })

            toast.success('Site design synchronized successfully')
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to save design')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
            {/* Top Bar Navigation */}
            <header className="h-16 border-b border-white/5 bg-[#0d0d0d] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="hover:bg-white/5">
                        <Link href="/dashboard/vendor">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest">{storeName} Builder</h1>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Framer-Class Customization</p>
                    </div>
                </div>

                {/* Viewport Switcher */}
                <div className="hidden md:flex items-center bg-black/40 border border-white/5 rounded-xl p-1 gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-white/10"
                        onClick={() => editorRef.current?.setDevice('desktop')}
                    >
                        <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-white/10"
                        onClick={() => editorRef.current?.setDevice('tablet')}
                    >
                        <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-white/10"
                        onClick={() => editorRef.current?.setDevice('mobile')}
                    >
                        <Smartphone className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="border-white/10 text-zinc-400 hover:text-white uppercase text-[10px] font-bold tracking-widest hidden sm:flex">
                        <Eye className="mr-2 h-3.5 w-3.5" /> Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-black uppercase text-[10px] tracking-widest px-6"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2 h-3.5 w-3.5" /> : <Save className="mr-2 h-3.5 w-3.5" />}
                        Publish Design
                    </Button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Simplified Left Sidebar (Framer-Style Insert Panel) */}
                <aside className="w-16 border-r border-white/5 bg-[#0d0d0d] flex flex-col items-center py-6 gap-6 shrink-0 z-20">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-[#ff007f] text-white hover:bg-[#ff007f]/80 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                        <Plus className="h-5 w-5" />
                    </Button>
                    <div className="w-8 h-px bg-white/5" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5">
                        <Monitor className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5">
                        <Settings className="h-5 w-5" />
                    </Button>
                </aside>

                {/* Blocks Discovery Panel (Can be toggled in future, now stays open for simplicity) */}
                <div className="w-72 border-r border-white/5 bg-[#0d0d0d] flex flex-col shrink-0 overflow-y-auto z-10">
                    <div className="p-6 border-b border-white/5 bg-black/20">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2 border-l-2 border-[#ff007f]">Insert Elements</h3>
                    </div>

                    <div className="p-4 space-y-8">
                        {['Layout', 'Commerce', 'Marketing'].map(cat => (
                            <div key={cat}>
                                <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-2">{cat}</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {tailwindBlocks.filter(b => b.category === cat).map(block => (
                                        <div
                                            key={block.id}
                                            draggable
                                            onDragStart={(e) => {
                                                if (!editorRef.current) return
                                                // Native GrapesJS start drag
                                                editorRef.current.Blocks.startDrag(block.id, e.nativeEvent)
                                            }}
                                            onDragEnd={() => {
                                                if (!editorRef.current) return
                                                editorRef.current.Blocks.endDrag()
                                            }}
                                            className="group bg-zinc-900/40 border border-white/5 rounded-xl p-3 hover:border-[#ff007f]/50 hover:bg-zinc-900/80 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-[#ff007f] group-hover:scale-110 transition-transform">
                                                    {block.label[0]}
                                                </div>
                                                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight group-hover:text-white transition-colors">{block.label}</span>
                                            </div>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Plus className="h-3 w-3 text-[#ff007f]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full shadow-2xl">
                        <GjsEditor
                            grapesjs={grapesjs}
                            onEditor={onEditor}
                            options={{
                                height: '100%',
                                storageManager: false,
                                plugins: [grapesjsTailwind],
                                canvas: {
                                    styles: [
                                        'https://cdn.tailwindcss.com',
                                        'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;1,900&display=swap',
                                        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
                                    ]
                                }
                            }}
                        >
                            <Canvas className="bg-[#0a0a0a]" />
                        </GjsEditor>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .gjs-cv-canvas {
          top: 0;
          width: 100%;
          height: 100%;
        }
        .gjs-editor {
            background: #0a0a0a !important;
        }
        .gjs-one-bg {
            background-color: #0d0d0d !important;
        }
        .gjs-two-color {
            color: #ff007f !important;
        }
        .gjs-three-bg {
            background-color: #1a1a1a !important;
        }
        .gjs-four-color, .gjs-four-color-h:hover {
            color: #ff007f !important;
        }
        .gjs-block {
            background-color: #111 !important;
            color: #eee !important;
            border: 1px solid #222 !important;
        }
        .gjs-block:hover {
            border-color: #ff007f !important;
            color: #ff007f !important;
        }
        /* Hide GJS default block manager since we use custom UI */
        .gjs-pn-views-container {
            display: none !important;
        }
        .gjs-pn-panels {
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
      `}</style>
        </div>
    )
}
