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
import { Loader2, LayoutTemplate, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Vendor Templates — DTC e-commerce architecture
// Inspired by: Mejuri, Glossier, Everlane, Supreme, Casper
// ─────────────────────────────────────────────────────────────
const VENDOR_TEMPLATES: PageTemplate[] = [
    {
        id: 'dark-social',
        name: 'Dark Social',
        description: 'Video-first, lifestyle de alto impacto.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.dark,
        blocks: [
            { id: 'ds-hero', type: 'hero', props: { title: 'Tu Marca', subtitle: 'Hecho con intención.', backgroundType: 'gradient', ctaLabel: 'Ver Colección', ctaLink: '#productos', ctaSecondaryLabel: 'Nuestra Historia', ctaSecondaryLink: '#historia', minHeight: 100, overlayOpacity: 55, contentAlign: 'center' } },
            { id: 'ds-marquee', type: 'marquee', props: { items: ['Envío gratis +$999', 'Producción local 🇲🇽', 'Devoluciones fáciles', 'Pago seguro ✓'], speed: 25, separator: '✦', backgroundColor: '#ff007f', textColor: '#fff' } },
            { id: 'ds-trust', type: 'trust-bar', props: { type: 'press', items: [{ label: 'Forbes' }, { label: 'Vogue MX' }, { label: 'El Universal' }], backgroundColor: '#111' } },
            { id: 'ds-products', type: 'products-grid', props: { title: 'Lo Más Pedido', subtitle: 'Bestsellers', columns: 3, limit: 6, showPrice: true, showAddToCart: true } },
            { id: 'ds-story', type: 'brand-story', props: { eyebrow: 'Quiénes somos', title: 'Nacidos desde la pasión', body: 'Cada pieza que hacemos tiene un propósito. Diseñamos para quienes saben lo que quieren y lo exigen de forma diferente.', ctaLabel: 'Conoce más', ctaLink: '/about', image: '', imagePosition: 'right', backgroundColor: '#0a0a0a' } },
            { id: 'ds-review', type: 'testimonial', props: { quote: '"Calidad que se siente desde el primer uso. No volvería a comprar en otro lado."', author: 'Mariana T.', role: 'Clienta desde 2023', rating: 5 } },
            { id: 'ds-newsletter', type: 'newsletter', props: { title: 'Sé el primero en saber', description: 'Drops exclusivos, descuentos y contenido que no publicamos en redes.', placeholder: 'tu@email.com', ctaLabel: 'Quiero entrar', accentColor: '#ff007f', backgroundColor: '#0a0a0a' } },
            { id: 'ds-location', type: 'location', props: { title: 'Visítanos', address: 'Tu dirección aquí', city: 'Ciudad de México', country: 'México', phone: '+52 55 0000 0000', email: 'hola@tutienda.com', hours: [{ day: 'Lun – Vie', hours: '10:00–19:00' }, { day: 'Sáb', hours: '11:00–17:00' }], showMap: false, layout: 'split' } },
        ]
    },
    {
        id: 'boutique',
        name: 'Boutique',
        description: 'Editorial, serif, lujo accesible.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.boutique,
        blocks: [
            { id: 'bt-hero', type: 'hero', props: { title: 'Boutique', subtitle: 'Elegancia atemporal. Piezas para durar.', backgroundType: 'image', ctaLabel: 'Explorar Colección', ctaLink: '#coleccion', minHeight: 90, overlayOpacity: 45, contentAlign: 'left' } },
            { id: 'bt-marquee', type: 'marquee', props: { items: ['Nueva colección disponible', 'Envío a toda México', 'Materiales sustentables', 'Hecho a mano'], speed: 35, separator: '·', backgroundColor: '#c9a96e', textColor: '#1a1a1a' } },
            { id: 'bt-quote', type: 'quote', props: { text: '"La moda pasa, el estilo permanece."', author: '— Coco Chanel', align: 'center' } },
            { id: 'bt-products', type: 'products-grid', props: { title: 'Nuestra Colección', subtitle: 'Piezas selectas', columns: 2, limit: 4, showPrice: true, showAddToCart: true } },
            { id: 'bt-story', type: 'brand-story', props: { eyebrow: 'Nuestra historia', title: 'Diseño con propósito', body: 'Cada pieza de nuestra colección es seleccionada a mano con un criterio simple: si no lo usaríamos nosotras, no lo vendemos.', ctaLabel: 'Conocer la marca', ctaLink: '/about', image: '', imagePosition: 'left', backgroundColor: '#0c0c0c' } },
            { id: 'bt-how', type: 'how-it-works', props: { title: 'Comprar es así de simple', steps: [{ number: '01', title: 'Elige con calma', description: 'Navega nuestras colecciones a tu ritmo.' }, { number: '02', title: 'Pago seguro', description: 'Tarjeta, transferencia o pago en parcialidades.' }, { number: '03', title: 'Lo recibimos en casa', description: 'Empaque premium, directo a tu puerta.' }], layout: 'horizontal' } },
            { id: 'bt-review', type: 'testimonial', props: { quote: '"Cada pieza que compré superó todas mis expectativas. La calidad se siente desde que abres el paquete."', author: 'Sofía R.', role: 'Cliente frecuente', rating: 5 } },
            { id: 'bt-newsletter', type: 'newsletter', props: { title: 'Únete al club', description: 'Acceso anticipado a nuevas colecciones y ofertas exclusivas para suscriptoras.', ctaLabel: 'Suscribirme', accentColor: '#c9a96e', backgroundColor: '#0a0a0a' } },
            { id: 'bt-location', type: 'location', props: { title: 'Visítanos en tienda', address: 'Tu dirección aquí', city: 'Ciudad de México', country: 'México', phone: '+52 55 0000 0000', email: 'boutique@tutienda.com', hours: [{ day: 'Lun – Sáb', hours: '10:00–20:00' }, { day: 'Dom', hours: '12:00–18:00' }], showMap: false, layout: 'split' } },
        ]
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Producto primero, sin distracciones.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.minimal,
        blocks: [
            { id: 'mn-hero', type: 'hero', props: { title: 'MENOS ES MÁS', description: 'Piezas esenciales, calidad excepcional.', ctaLabel: 'Shop Now', ctaLink: '#productos', minHeight: 65, overlayOpacity: 90, contentAlign: 'left', backgroundType: 'gradient' } },
            { id: 'mn-div1', type: 'divider', props: { color: '#222', thickness: 1, marginY: 0 } },
            { id: 'mn-how', type: 'how-it-works', props: { title: 'Así trabajamos', steps: [{ number: '01', title: 'Diseño honesto', description: 'Sin logos enormes, sin tendencias vacías.' }, { number: '02', title: 'Materiales premium', description: 'Lo que no usaríamos, no lo hacemos.' }, { number: '03', title: 'Precio justo', description: 'Sabemos cuánto cuesta cada pieza.' }], layout: 'horizontal' } },
            { id: 'mn-products', type: 'products-grid', props: { title: '', columns: 4, limit: 8, showPrice: true, showAddToCart: false } },
            { id: 'mn-story', type: 'brand-story', props: { eyebrow: 'Por qué existimos', title: 'Hecho con intención.', body: 'No hacemos tendencias. Hacemos piezas que vas a usar en 10 años y van a seguir sintiéndose correctas.', ctaLabel: '', ctaLink: '', image: '', imagePosition: 'right', backgroundColor: '#000' } },
            { id: 'mn-review', type: 'testimonial', props: { quote: '"Lo compré hace 3 años. Sigue igual."', author: 'Carlos M.', role: '', rating: 5 } },
            { id: 'mn-faq', type: 'faq', props: { title: 'Preguntas', items: [{ question: '¿Cuánto tarda el envío?', answer: '2-4 días hábiles. Gratis en pedidos +$999.' }, { question: '¿Puedo devolver?', answer: '30 días sin preguntas.' }, { question: '¿Dónde se produce?', answer: 'Todo en México.' }] } },
            { id: 'mn-newsletter', type: 'newsletter', props: { title: 'Menos ruido.', description: 'Solo te escribimos cuando vale la pena.', ctaLabel: 'Entrar', accentColor: '#ffffff', backgroundColor: '#050505' } },
        ]
    },
    {
        id: 'brutalist',
        name: 'Brutalist',
        description: 'Drop culture, edición limitada, impactante.',
        thumbnail: '',
        category: 'store',
        theme: DEFAULT_THEMES.default,
        blocks: [
            { id: 'br-heading', type: 'heading', props: { text: 'AMERICANA', level: 'h1', align: 'left', size: '8xl', weight: 'black', color: '#ffffff', fontStyle: 'normal' } },
            { id: 'br-marquee', type: 'marquee', props: { items: ['DROP DISPONIBLE', 'UNIDADES LIMITADAS', 'NO HAY RESTOCK', 'COMPRA AHORA'], speed: 15, separator: '/', backgroundColor: '#000', textColor: '#ff007f' } },
            { id: 'br-hero', type: 'hero', props: { title: '', subtitle: '', backgroundType: 'gradient', ctaLabel: 'VER DROP', ctaLink: '#drop', minHeight: 80, overlayOpacity: 30, contentAlign: 'center' } },
            { id: 'br-slider', type: 'card-slider', props: { title: 'DROP 001', cards: [{ image: '', title: 'PIEZA 001', description: '$1,200 MXN' }, { image: '', title: 'PIEZA 002', description: '$1,800 MXN' }, { image: '', title: 'PIEZA 003', description: '$950 MXN' }], cardWidth: 300, gap: 2, snapAlign: 'start', showArrows: false } },
            { id: 'br-products', type: 'products-grid', props: { title: 'STOCK DISPONIBLE', columns: 3, limit: 9, showPrice: true, showAddToCart: true } },
            { id: 'br-story', type: 'brand-story', props: { eyebrow: '', title: 'NO SOMOS PARA TODOS', body: 'Y está bien. Si entiendes lo que hacemos, ya sabes que lo nuestro es tuyo.', ctaLabel: '', ctaLink: '', image: '', imagePosition: 'right', backgroundColor: '#000' } },
            { id: 'br-faq', type: 'faq', props: { title: 'FAQ', items: [{ question: '¿Hay restock?', answer: 'No. Cada drop es único y limitado.' }, { question: '¿Envíos?', answer: 'Nacional e internacional.' }] } },
            { id: 'br-location', type: 'location', props: { title: 'CONTACTO', address: '', city: '', country: 'México', phone: '', email: 'contacto@tutienda.com', hours: [], showMap: false, layout: 'minimal' } },
        ]
    },
]

// ─────────────────────────────────────────────────────────────
// Template visual cards
// ─────────────────────────────────────────────────────────────
const TEMPLATE_VISUALS: Record<string, { bg: string; accent: string; lines: string[] }> = {
    'dark-social': { bg: '#0a0a0a', accent: '#ff007f', lines: ['Hero Video', 'Marquee', 'Bestsellers', 'Brand Story', 'Newsletter'] },
    'boutique':    { bg: '#0c0a06', accent: '#c9a96e', lines: ['Hero Editorial', 'Colección', 'Brand Story', 'Reseñas', 'Ubicación'] },
    'minimal':     { bg: '#050505', accent: '#ffffff', lines: ['Hero Stark', 'Productos Grid', 'Cómo Funciona', 'FAQ', 'Newsletter'] },
    'brutalist':   { bg: '#000000', accent: '#ff007f', lines: ['BIG TYPE', 'DROP', 'Stock', 'Manifesto'] },
}

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

    // ── Template picker ──────────────────────────────────────
    if (showTemplates) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-8">
                <div className="text-center mb-12">
                    <div className="w-12 h-12 bg-[#ff007f]/10 border border-[#ff007f]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-[#ff007f]" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-3">Elige tu plantilla</h1>
                    <p className="text-zinc-500 text-sm max-w-md mx-auto">
                        Cada plantilla es una arquitectura probada por marcas exitosas. Personaliza todo desde el editor.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
                    {VENDOR_TEMPLATES.map(tpl => {
                        const vis = TEMPLATE_VISUALS[tpl.id]
                        return (
                            <button
                                key={tpl.id}
                                onClick={() => applyTemplate(tpl)}
                                className="group text-left relative overflow-hidden rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                                style={{ background: vis.bg }}
                            >
                                {/* Visual mock of page structure */}
                                <div className="aspect-[3/4] p-4 flex flex-col gap-2 relative overflow-hidden">
                                    {/* Accent strip */}
                                    <div className="h-1 rounded-full mb-1 w-1/2" style={{ backgroundColor: vis.accent }} />
                                    {/* Mock sections */}
                                    {vis.lines.map((line, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: i === 0 ? vis.accent : '#333' }} />
                                            <div
                                                className="h-2 rounded-full flex-1"
                                                style={{
                                                    backgroundColor: i === 0 ? vis.accent + '30' : '#1a1a1a',
                                                    width: `${70 - i * 10}%`,
                                                    maxWidth: '90%'
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {/* Big accent text */}
                                    <div className="absolute bottom-4 right-4 text-5xl font-black opacity-5" style={{ color: vis.accent }}>
                                        {tpl.name[0]}
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div className="flex items-center gap-1.5 font-bold text-white text-xs bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                                            Usar plantilla <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-white/5">
                                    <h3 className="text-white font-bold text-sm mb-0.5 group-hover:text-white" style={{ '--accent': vis.accent } as any}>
                                        {tpl.name}
                                    </h3>
                                    <p className="text-zinc-600 text-[11px] leading-relaxed">{tpl.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {vis.lines.slice(0, 3).map((l, i) => (
                                            <span key={i} className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: vis.accent + '15', color: vis.accent }}>
                                                {l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                <p className="text-zinc-700 text-xs mt-10">Puedes cambiar de plantilla en cualquier momento.</p>
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
