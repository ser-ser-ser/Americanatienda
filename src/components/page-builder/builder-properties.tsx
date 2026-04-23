'use client'
import React from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import { BuilderBlock, BLOCK_LIBRARY } from '@/types/builder'
import {
    Palette, AlignLeft, AlignCenter, AlignRight,
    Type, Link2, ExternalLink, Upload, X, Plus, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function BuilderProperties() {
    const { blocks, selectedBlockId, updateBlock, updateBlockStyles, selectBlock } = useBuilderStore()
    const block = blocks.find(b => b.id === selectedBlockId)

    if (!selectedBlockId || !block) {
        return (
            <aside className="w-72 flex-shrink-0 border-l border-white/5 bg-[#0c0c0c] flex flex-col h-full">
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Propiedades</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-3">
                        <Palette className="w-5 h-5 text-zinc-700" />
                    </div>
                    <p className="text-xs text-zinc-600">Selecciona un bloque del canvas para editar sus propiedades</p>
                </div>
            </aside>
        )
    }

    const def = BLOCK_LIBRARY.find(b => b.type === block.type)
    const update = (key: string, value: any) => updateBlock(block.id, { [key]: value })
    const updateStyle = (key: string, value: any) => updateBlockStyles(block.id, { [key]: value })

    return (
        <aside className="w-72 flex-shrink-0 border-l border-white/5 bg-[#0c0c0c] flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{def?.label}</h2>
                    <p className="text-[9px] text-zinc-700 font-mono">{block.type}</p>
                </div>
                <button
                    onClick={() => selectBlock(null)}
                    className="p-1 hover:bg-white/5 rounded text-zinc-600 hover:text-white transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Properties */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-5">
                    {/* Dynamic props based on block type */}
                    <BlockPropsEditor block={block} update={update} />

                    {/* Spacing & Background */}
                    <StylesEditor block={block} updateStyle={updateStyle} />
                </div>
            </div>

            <style jsx global>{`.custom-scrollbar::-webkit-scrollbar { width: 0px; }`}</style>
        </aside>
    )
}

// ─────────────────────────────────────────────────────────────
// Dynamic properties editor based on block type
// ─────────────────────────────────────────────────────────────
function BlockPropsEditor({ block, update }: { block: BuilderBlock; update: (k: string, v: any) => void }) {
    const p = block.props

    switch (block.type) {
        case 'hero':
            return (
                <>
                    <PropGroup label="Contenido">
                        <TextField label="Título" value={p.title} onChange={v => update('title', v)} />
                        <TextField label="Subtítulo" value={p.subtitle} onChange={v => update('subtitle', v)} />
                        <TextareaField label="Descripción" value={p.description} onChange={v => update('description', v)} />
                    </PropGroup>
                    <PropGroup label="Botón Principal">
                        <TextField label="Texto CTA" value={p.ctaLabel} onChange={v => update('ctaLabel', v)} />
                        <TextField label="Link" value={p.ctaLink} onChange={v => update('ctaLink', v)} />
                    </PropGroup>
                    <PropGroup label="Fondo">
                        <SelectField
                            label="Tipo de fondo"
                            value={p.backgroundType}
                            options={[
                                { value: 'gradient', label: 'Degradado' },
                                { value: 'image', label: 'Imagen' },
                                { value: 'video', label: 'Video' },
                                { value: 'color', label: 'Color sólido' },
                            ]}
                            onChange={v => update('backgroundType', v)}
                        />
                        {p.backgroundType === 'video' && (
                            <TextField label="URL Video" value={p.backgroundVideo} onChange={v => update('backgroundVideo', v)} />
                        )}
                        {p.backgroundType === 'image' && (
                            <TextField label="URL Imagen" value={p.backgroundImage} onChange={v => update('backgroundImage', v)} />
                        )}
                        <NumberField label="Opacidad overlay (%)" value={p.overlayOpacity} min={0} max={100} onChange={v => update('overlayOpacity', v)} />
                    </PropGroup>
                    <PropGroup label="Layout">
                        <AlignField label="Alineación" value={p.contentAlign} onChange={v => update('contentAlign', v)} />
                        <NumberField label="Alto mínimo (vh)" value={p.minHeight} min={30} max={100} onChange={v => update('minHeight', v)} />
                    </PropGroup>
                </>
            )

        case 'heading':
            return (
                <PropGroup label="Encabezado">
                    <TextField label="Texto" value={p.text} onChange={v => update('text', v)} />
                    <SelectField label="Nivel" value={p.level} options={['h1','h2','h3','h4','h5','h6'].map(v => ({ value: v, label: v.toUpperCase() }))} onChange={v => update('level', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'xl', label: 'Mediano' },
                        { value: '3xl', label: 'Grande' }, { value: '5xl', label: 'Extra Grande' },
                        { value: '8xl', label: 'Gigante' },
                    ]} onChange={v => update('size', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={v => update('align', v)} />
                    <ColorField label="Color" value={p.color} onChange={v => update('color', v)} />
                    <SelectField label="Estilo" value={p.fontStyle} options={[
                        { value: 'normal', label: 'Normal' }, { value: 'italic', label: 'Itálica' }
                    ]} onChange={v => update('fontStyle', v)} />
                </PropGroup>
            )

        case 'paragraph':
            return (
                <PropGroup label="Párrafo">
                    <TextareaField label="Texto" value={p.text} onChange={v => update('text', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={v => update('align', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'base', label: 'Normal' },
                        { value: 'lg', label: 'Grande' }, { value: 'xl', label: 'Extra Grande' },
                    ]} onChange={v => update('size', v)} />
                    <ColorField label="Color" value={p.color} onChange={v => update('color', v)} />
                </PropGroup>
            )

        case 'button':
            return (
                <PropGroup label="Botón">
                    <TextField label="Texto" value={p.label} onChange={v => update('label', v)} />
                    <TextField label="Link" value={p.link} onChange={v => update('link', v)} />
                    <SelectField label="Estilo" value={p.variant} options={[
                        { value: 'primary', label: 'Primario' },
                        { value: 'secondary', label: 'Secundario' },
                        { value: 'outline', label: 'Outline' },
                        { value: 'ghost', label: 'Ghost' },
                    ]} onChange={v => update('variant', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'md', label: 'Mediano' }, { value: 'lg', label: 'Grande' }
                    ]} onChange={v => update('size', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={v => update('align', v)} />
                    <BooleanField label="Abrir en nueva pestaña" value={p.newTab} onChange={v => update('newTab', v)} />
                </PropGroup>
            )

        case 'image':
            return (
                <PropGroup label="Imagen">
                    <TextField label="URL de imagen" value={p.src} onChange={v => update('src', v)} placeholder="https://..." />
                    <TextField label="Texto alternativo" value={p.alt} onChange={v => update('alt', v)} />
                    <SelectField label="Ajuste" value={p.fit} options={[
                        { value: 'cover', label: 'Cubrir' }, { value: 'contain', label: 'Contener' },
                        { value: 'fill', label: 'Rellenar' },
                    ]} onChange={v => update('fit', v)} />
                    <SelectField label="Relación de aspecto" value={p.aspectRatio} options={[
                        { value: '16/9', label: '16:9' }, { value: '4/3', label: '4:3' },
                        { value: '1/1', label: '1:1' }, { value: '9/16', label: '9:16 (vertical)' },
                        { value: '3/1', label: '3:1 (banner)' },
                    ]} onChange={v => update('aspectRatio', v)} />
                    <TextField label="Link (opcional)" value={p.link} onChange={v => update('link', v)} />
                    <NumberField label="Border Radius" value={p.borderRadius} min={0} max={48} onChange={v => update('borderRadius', v)} />
                </PropGroup>
            )

        case 'video':
            return (
                <PropGroup label="Video">
                    <TextField label="URL de video" value={p.src} onChange={v => update('src', v)} placeholder="https://..." />
                    <SelectField label="Relación de aspecto" value={p.aspectRatio} options={[
                        { value: '16/9', label: '16:9' }, { value: '9/16', label: '9:16 (vertical)' }, { value: '1/1', label: '1:1' }
                    ]} onChange={v => update('aspectRatio', v)} />
                    <BooleanField label="Autoplay" value={p.autoplay} onChange={v => update('autoplay', v)} />
                    <BooleanField label="Sin sonido" value={p.muted} onChange={v => update('muted', v)} />
                    <BooleanField label="Loop" value={p.loop} onChange={v => update('loop', v)} />
                    <BooleanField label="Controles" value={p.controls} onChange={v => update('controls', v)} />
                </PropGroup>
            )

        case 'cta':
            return (
                <>
                    <PropGroup label="Contenido">
                        <TextField label="Título" value={p.title} onChange={v => update('title', v)} />
                        <TextareaField label="Descripción" value={p.description} onChange={v => update('description', v)} />
                        <TextField label="Texto botón" value={p.ctaLabel} onChange={v => update('ctaLabel', v)} />
                        <TextField label="Link botón" value={p.ctaLink} onChange={v => update('ctaLink', v)} />
                    </PropGroup>
                    <PropGroup label="Colores">
                        <ColorField label="Color de fondo" value={p.backgroundColor} onChange={v => update('backgroundColor', v)} />
                        <ColorField label="Color acento" value={p.accentColor} onChange={v => update('accentColor', v)} />
                    </PropGroup>
                </>
            )

        case 'products-grid':
            return (
                <PropGroup label="Grilla de Productos">
                    <TextField label="Título" value={p.title} onChange={v => update('title', v)} />
                    <TextField label="Subtítulo" value={p.subtitle} onChange={v => update('subtitle', v)} />
                    <NumberField label="Columnas" value={p.columns} min={1} max={4} onChange={v => update('columns', v)} />
                    <NumberField label="Cantidad de productos" value={p.limit} min={1} max={24} onChange={v => update('limit', v)} />
                    <BooleanField label="Mostrar precio" value={p.showPrice} onChange={v => update('showPrice', v)} />
                    <BooleanField label="Botón agregar al carrito" value={p.showAddToCart} onChange={v => update('showAddToCart', v)} />
                </PropGroup>
            )

        case 'carousel':
            return (
                <PropGroup label="Carousel">
                    <TextField label="Título" value={p.title} onChange={v => update('title', v)} />
                    <NumberField label="Slides desktop" value={p.slidesPerView} min={1} max={6} onChange={v => update('slidesPerView', v)} />
                    <NumberField label="Slides tablet" value={p.slidesPerViewTablet} min={1} max={4} onChange={v => update('slidesPerViewTablet', v)} />
                    <NumberField label="Slides móvil" value={p.slidesPerViewMobile} min={1} max={2} onChange={v => update('slidesPerViewMobile', v)} />
                    <BooleanField label="Autoplay" value={p.autoplay} onChange={v => update('autoplay', v)} />
                    <BooleanField label="Loop" value={p.loop} onChange={v => update('loop', v)} />
                    <BooleanField label="Mostrar flechas" value={p.showArrows} onChange={v => update('showArrows', v)} />
                    <BooleanField label="Mostrar puntos" value={p.showDots} onChange={v => update('showDots', v)} />
                </PropGroup>
            )

        case 'testimonial':
            return (
                <PropGroup label="Testimonial">
                    <TextareaField label="Cita" value={p.quote} onChange={v => update('quote', v)} />
                    <TextField label="Autor" value={p.author} onChange={v => update('author', v)} />
                    <TextField label="Rol" value={p.role} onChange={v => update('role', v)} />
                    <TextField label="URL Avatar" value={p.avatar} onChange={v => update('avatar', v)} />
                    <NumberField label="Calificación (1-5)" value={p.rating} min={1} max={5} onChange={v => update('rating', v)} />
                </PropGroup>
            )

        case 'divider':
            return (
                <PropGroup label="Divisor">
                    <ColorField label="Color" value={p.color} onChange={v => update('color', v)} />
                    <NumberField label="Grosor (px)" value={p.thickness} min={1} max={8} onChange={v => update('thickness', v)} />
                    <SelectField label="Estilo" value={p.style} options={[
                        { value: 'solid', label: 'Sólido' }, { value: 'dashed', label: 'Punteado' }, { value: 'dotted', label: 'Puntos' }
                    ]} onChange={v => update('style', v)} />
                    <NumberField label="Margen vertical (px)" value={p.marginY} min={0} max={128} onChange={v => update('marginY', v)} />
                </PropGroup>
            )

        case 'faq':
            return (
                <PropGroup label="FAQ">
                    <TextField label="Título" value={p.title} onChange={v => update('title', v)} />
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Preguntas</label>
                        {p.items?.map((item: any, i: number) => (
                            <div key={i} className="bg-zinc-900 rounded-lg p-3 space-y-2 border border-white/5">
                                <input
                                    value={item.question}
                                    onChange={e => {
                                        const items = [...p.items]; items[i].question = e.target.value
                                        update('items', items)
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                    placeholder="Pregunta..."
                                />
                                <textarea
                                    value={item.answer}
                                    onChange={e => {
                                        const items = [...p.items]; items[i].answer = e.target.value
                                        update('items', items)
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 min-h-[60px] resize-none"
                                    placeholder="Respuesta..."
                                />
                                <button onClick={() => { const items = p.items.filter((_: any, j: number) => j !== i); update('items', items) }}
                                    className="text-red-500 text-[9px] hover:text-red-400">Eliminar</button>
                            </div>
                        ))}
                        <button
                            onClick={() => update('items', [...(p.items || []), { question: '', answer: '' }])}
                            className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-zinc-700 rounded-lg text-xs text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                        >
                            <Plus className="w-3 h-3" /> Agregar pregunta
                        </button>
                    </div>
                </PropGroup>
            )

        default:
            return (
                <PropGroup label="Propiedades">
                    <p className="text-xs text-zinc-600 italic">Editor de propiedades no disponible para este bloque aún.</p>
                    <pre className="text-[9px] text-zinc-700 bg-black rounded p-2 overflow-auto max-h-32 font-mono">
                        {JSON.stringify(block.props, null, 2)}
                    </pre>
                </PropGroup>
            )
    }
}

// ─── Styles Editor ───────────────────────────────────────────
function StylesEditor({ block, updateStyle }: { block: BuilderBlock; updateStyle: (k: string, v: any) => void }) {
    const s = block.styles || {}
    return (
        <PropGroup label="Espaciado y Fondo" collapsible>
            <div className="grid grid-cols-2 gap-2">
                <NumberField label="Pad. top" value={s.paddingTop ?? 0} min={0} max={200} onChange={v => updateStyle('paddingTop', v)} />
                <NumberField label="Pad. bottom" value={s.paddingBottom ?? 0} min={0} max={200} onChange={v => updateStyle('paddingBottom', v)} />
                <NumberField label="Pad. left" value={s.paddingLeft ?? 0} min={0} max={200} onChange={v => updateStyle('paddingLeft', v)} />
                <NumberField label="Pad. right" value={s.paddingRight ?? 0} min={0} max={200} onChange={v => updateStyle('paddingRight', v)} />
            </div>
            <ColorField label="Color de fondo" value={s.backgroundColor || ''} onChange={v => updateStyle('backgroundColor', v)} />
            <NumberField label="Border radius" value={s.borderRadius ?? 0} min={0} max={64} onChange={v => updateStyle('borderRadius', v)} />
        </PropGroup>
    )
}

// ─── Reusable Form Fields ─────────────────────────────────────
function PropGroup({ label, children, collapsible }: { label: string; children: React.ReactNode; collapsible?: boolean }) {
    const [open, setOpen] = React.useState(true)
    return (
        <div>
            <button
                className="w-full flex items-center justify-between mb-3 group"
                onClick={() => collapsible && setOpen(o => !o)}
            >
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">{label}</span>
                {collapsible && <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>}
            </button>
            {open && <div className="space-y-3">{children}</div>}
        </div>
    )
}

function TextField({ label, value, onChange, placeholder }: any) {
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
            <input
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff007f]/50"
            />
        </div>
    )
}

function TextareaField({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff007f]/50 resize-none"
            />
        </div>
    )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string } | string>; onChange: (v: string) => void }) {
    const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
            <select
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff007f]/50 appearance-none"
            >
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    )
}

function NumberField({ label, value, min, max, onChange }: any) {
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}: <span className="text-white">{value}</span></label>
            <input
                type="range"
                min={min} max={max}
                value={value || 0}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full accent-[#ff007f]"
            />
        </div>
    )
}

function ColorField({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
            <div className="flex gap-2 items-center">
                <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)}
                    className="h-8 w-10 rounded bg-transparent border border-white/10 cursor-pointer p-0.5" />
                <input value={value || ''} onChange={e => onChange(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff007f]/50" />
            </div>
        </div>
    )
}

function AlignField({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
            <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map(a => {
                    const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : AlignRight
                    return (
                        <button key={a} onClick={() => onChange(a)}
                            className={cn('flex-1 py-2 rounded-lg border flex items-center justify-center transition-all', value === a ? 'bg-[#ff007f] border-[#ff007f] text-white' : 'border-white/5 text-zinc-500 hover:text-white hover:border-zinc-600')}
                        >
                            <Icon className="w-3 h-3" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function BooleanField({ label, value, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
            <button
                onClick={() => onChange(!value)}
                className={cn('relative w-9 h-5 rounded-full transition-colors', value ? 'bg-[#ff007f]' : 'bg-zinc-700')}
            >
                <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all', value ? 'left-4' : 'left-0.5')} />
            </button>
        </div>
    )
}
