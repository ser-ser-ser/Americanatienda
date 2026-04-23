'use client'
import React, { useEffect, useCallback } from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import { BuilderToolbar } from '@/components/page-builder/builder-toolbar'
import { BuilderSidebar } from '@/components/page-builder/builder-sidebar'
import { BuilderCanvas } from '@/components/page-builder/builder-canvas'
import { BuilderProperties } from '@/components/page-builder/builder-properties'
import { createClient } from '@/utils/supabase/client'
import { useVendor } from '@/providers/vendor-provider'
import { toast } from 'sonner'
import { PageLayout, BLOCK_LIBRARY, PageTemplate, DEFAULT_THEMES } from '@/types/builder'
import { Loader2, LayoutTemplate, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Vendor store templates ────────────────────────────────────
const VENDOR_TEMPLATES: PageTemplate[] = [
    {
        id: 'dark-social',
        name: 'Dark Social',
        description: 'Oscuro, video-first. Perfecto para lifestyle y moda.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.dark,
        blocks: [
            { id: 'vs-hero', type: 'hero', props: { title: 'Tu Marca', subtitle: 'Tu historia aquí.', backgroundType: 'gradient', ctaLabel: 'Ver Colección', ctaLink: '#products', minHeight: 100, overlayOpacity: 60, contentAlign: 'center' } },
            { id: 'vs-products', type: 'products-grid', props: { title: 'Colección', subtitle: 'Nuevos Arrivals', columns: 3, limit: 6, showPrice: true, showAddToCart: true } },
            { id: 'vs-video', type: 'video', props: { src: '', aspectRatio: '16/9', autoplay: true, muted: true, loop: true } },
            { id: 'vs-cta', type: 'cta', props: { title: '¿Tienes preguntas?', description: 'Contáctanos directamente.', ctaLabel: 'Chatear', ctaLink: '#contact', backgroundColor: '#111', accentColor: '#00d4ff' } },
        ]
    },
    {
        id: 'boutique',
        name: 'Boutique',
        description: 'Cálido, serif, lujo accesible. Ideal para moda premium.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.boutique,
        blocks: [
            { id: 'vs-hero', type: 'hero', props: { title: 'Boutique', subtitle: 'Elegancia atemporal.', backgroundType: 'image', ctaLabel: 'Explorar', ctaLink: '#products', minHeight: 90, overlayOpacity: 40, contentAlign: 'left' } },
            { id: 'vs-quote', type: 'quote', props: { text: '"La moda pasa, el estilo permanece."', author: '— Tu Marca', align: 'center' } },
            { id: 'vs-products', type: 'products-grid', props: { title: 'Nuestra Colección', columns: 2, limit: 4, showPrice: true, showAddToCart: true } },
            { id: 'vs-divider', type: 'divider', props: { color: '#c9a96e', thickness: 1, style: 'solid', marginY: 40 } },
            { id: 'vs-testimonial', type: 'testimonial', props: { quote: '"Calidad excepcional, lo recomiendo al 100%."', author: 'Cliente', role: 'Comprador verificado', rating: 5 } },
        ]
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Limpio, tipografía grande, sin distracciones.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.minimal,
        blocks: [
            { id: 'vs-hero', type: 'hero', props: { title: 'MINIMAL', subtitle: 'Menos es más.', backgroundType: 'color', ctaLabel: 'Shop Now', ctaLink: '#products', minHeight: 70, overlayOpacity: 90, contentAlign: 'left' } },
            { id: 'vs-divider', type: 'divider', props: { color: '#222', thickness: 1, marginY: 0 } },
            { id: 'vs-products', type: 'products-grid', props: { title: '', columns: 4, limit: 8, showPrice: true, showAddToCart: false } },
            { id: 'vs-cta', type: 'cta', props: { title: 'Hecho con intención.', description: 'Cada pieza, diseñada para durar.', ctaLabel: 'Nuestra Historia', ctaLink: '/about', backgroundColor: '#0a0a0a', accentColor: '#000' } },
        ]
    },
    {
        id: 'brutalist',
        name: 'Brutalist',
        description: 'Grid denso, editorial, impactante.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.default,
        blocks: [
            { id: 'vs-heading', type: 'heading', props: { text: 'BRUTALIST BRAND', level: 'h1', align: 'left', size: '8xl', weight: 'black', color: '#ffffff', fontStyle: 'normal' } },
            { id: 'vs-carousel', type: 'carousel', props: { title: '', slidesPerView: 2, slidesPerViewTablet: 2, slidesPerViewMobile: 1, showArrows: true, showDots: false, loop: true } },
            { id: 'vs-products', type: 'products-grid', props: { title: 'DROP', columns: 3, limit: 9, showPrice: true, showAddToCart: true } },
        ]
    },
]

export default function VendorBuilderPage() {
    const supabase = createClient()
    const { activeStore, isLoading } = useVendor()
    const { loadLayout, getLayout, selectBlock } = useBuilderStore()
    const [loading, setLoading] = React.useState(true)
    const [showTemplates, setShowTemplates] = React.useState(false)

    useEffect(() => {
        if (!activeStore) return
        const fetchLayout = async () => {
            try {
                const { data } = await supabase
                    .from('stores')
                    .select('page_layout')
                    .eq('id', activeStore.id)
                    .single()

                if (data?.page_layout) {
                    loadLayout(JSON.parse(typeof data.page_layout === 'string' ? data.page_layout : JSON.stringify(data.page_layout)))
                } else {
                    setShowTemplates(true)
                    setLoading(false)
                    return
                }
            } catch {
                setShowTemplates(true)
            } finally {
                setLoading(false)
            }
        }
        fetchLayout()
    }, [activeStore])

    const handleSave = useCallback(async () => {
        if (!activeStore) return
        const layout = getLayout()
        const { error } = await supabase
            .from('stores')
            .update({ page_layout: JSON.stringify(layout) })
            .eq('id', activeStore.id)
        if (error) throw new Error(error.message)
        toast.success('✅ Tienda publicada correctamente.')
    }, [activeStore, getLayout])

    const applyTemplate = (template: PageTemplate) => {
        loadLayout({ version: 1, blocks: template.blocks, theme: template.theme })
        setShowTemplates(false)
    }

    if (isLoading || loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2" /> Cargando editor...
            </div>
        )
    }

    // Template picker
    if (showTemplates) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
                <div className="text-center mb-12">
                    <LayoutTemplate className="w-10 h-10 text-[#ff007f] mx-auto mb-4" />
                    <h1 className="text-3xl font-serif font-bold mb-2">Elige tu plantilla</h1>
                    <p className="text-zinc-500 text-sm">Selecciona una base y personaliza todo desde el editor.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
                    {VENDOR_TEMPLATES.map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => applyTemplate(tpl)}
                            className="group bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-[#ff007f]/50 transition-all text-left"
                        >
                            <div className="aspect-[3/4] bg-zinc-800 flex items-center justify-center text-zinc-700 relative overflow-hidden">
                                <span className="text-4xl font-black uppercase tracking-tighter text-zinc-800 select-none">{tpl.name[0]}</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <div className="flex items-center gap-1 text-white text-xs font-bold">
                                        Usar plantilla <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-bold mb-1 group-hover:text-[#ff007f] transition-colors">{tpl.name}</h3>
                                <p className="text-zinc-500 text-xs leading-relaxed">{tpl.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-zinc-700 text-xs mt-8">Puedes cambiar de plantilla en cualquier momento desde el editor.</p>
            </div>
        )
    }

    return (
        <div
            className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden"
            onClick={() => selectBlock(null)}
        >
            <BuilderToolbar
                title={`Site Studio — ${activeStore?.name || 'Mi Tienda'}`}
                backHref="/dashboard/vendor/settings"
                onSave={handleSave}
                liveUrl={activeStore ? `/shops/${activeStore.slug}` : undefined}
            />
            <div className="flex flex-1 overflow-hidden">
                <BuilderSidebar />
                <BuilderCanvas />
                <BuilderProperties />
            </div>
        </div>
    )
}
