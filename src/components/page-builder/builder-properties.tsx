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
                        <TextField label="Título" value={p.title} onChange={(v: string) => update('title', v)} />
                        <TextField label="Subtítulo" value={p.subtitle} onChange={(v: string) => update('subtitle', v)} />
                        <TextareaField label="Descripción" value={p.description} onChange={(v: string) => update('description', v)} />
                    </PropGroup>
                    <PropGroup label="Botón Principal">
                        <TextField label="Texto CTA" value={p.ctaLabel} onChange={(v: string) => update('ctaLabel', v)} />
                        <TextField label="Link" value={p.ctaLink} onChange={(v: string) => update('ctaLink', v)} />
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
                            onChange={(v: string) => update('backgroundType', v)}
                        />
                        {p.backgroundType === 'video' && (
                            <TextField label="URL Video" value={p.backgroundVideo} onChange={(v: string) => update('backgroundVideo', v)} />
                        )}
                        {p.backgroundType === 'image' && (
                            <TextField label="URL Imagen" value={p.backgroundImage} onChange={(v: string) => update('backgroundImage', v)} />
                        )}
                        <NumberField label="Opacidad overlay (%)" value={p.overlayOpacity} min={0} max={100} onChange={(v: number) => update('overlayOpacity', v)} />
                    </PropGroup>
                    <PropGroup label="Layout">
                        <AlignField label="Alineación" value={p.contentAlign} onChange={(v: string) => update('contentAlign', v)} />
                        <NumberField label="Alto mínimo (vh)" value={p.minHeight} min={30} max={100} onChange={(v: number) => update('minHeight', v)} />
                    </PropGroup>
                </>
            )

        case 'marquee':
            return (
                <>
                    <PropGroup label="Marquee / Ticker">
                        <NumberField label="Velocidad (segundos)" value={p.speed} min={5} max={60} onChange={(v: number) => update('speed', v)} />
                        <TextField label="Separador" value={p.separator} onChange={(v: string) => update('separator', v)} placeholder="Ej: ✦" />
                        <ColorField label="Color de Fondo" value={p.backgroundColor} onChange={(v: string) => update('backgroundColor', v)} />
                        <ColorField label="Color de Texto" value={p.textColor} onChange={(v: string) => update('textColor', v)} />
                    </PropGroup>
                    <PropGroup label="Anuncios">
                        <div className="space-y-2">
                            {p.items?.map((item: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        value={item}
                                        onChange={e => {
                                            const items = [...p.items]; items[i] = e.target.value
                                            update('items', items)
                                        }}
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-xs text-white uppercase"
                                    />
                                    <button onClick={() => update('items', p.items.filter((_: any, j: number) => j !== i))}
                                        className="text-red-500 text-[10px] hover:text-red-400 px-2 bg-red-500/10 rounded">X</button>
                                </div>
                            ))}
                            <button onClick={() => update('items', [...(p.items || []), 'NUEVO ANUNCIO'])}
                                className="w-full py-1.5 border border-dashed border-white/20 rounded text-xs text-zinc-400 hover:text-white transition-all">+ Añadir anuncio</button>
                        </div>
                    </PropGroup>
                </>
            )

        case 'trust-bar':
            return (
                <PropGroup label="Barra de Confianza">
                    <SelectField label="Tipo" value={p.type} options={[{ value: 'press', label: 'Prensa' }, { value: 'stats', label: 'Estadísticas' }, { value: 'logos', label: 'Logos' }]} onChange={(v: string) => update('type', v)} />
                    <ColorField label="Color de Fondo" value={p.backgroundColor} onChange={(v: string) => update('backgroundColor', v)} />
                    <div className="mt-4 space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Elementos</label>
                        {p.items?.map((item: any, i: number) => (
                            <div key={i} className="flex gap-2 bg-zinc-900 border border-white/5 p-2 rounded">
                                <input
                                    value={item.label}
                                    onChange={e => { const items = [...p.items]; items[i].label = e.target.value; update('items', items) }}
                                    className="flex-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                    placeholder="Texto o nombre..."
                                />
                                <button onClick={() => update('items', p.items.filter((_: any, j: number) => j !== i))} className="text-red-500 text-[10px] hover:text-red-400">X</button>
                            </div>
                        ))}
                        <button onClick={() => update('items', [...(p.items || []), { label: 'Nuevo elemento' }])}
                            className="w-full py-1.5 border border-dashed border-white/20 rounded text-xs text-zinc-400 hover:text-white transition-all">+ Añadir</button>
                    </div>
                </PropGroup>
            )

        case 'brand-story':
            return (
                <>
                    <PropGroup label="Contenido">
                        <TextField label="Eyebrow (Texto pequeño)" value={p.eyebrow} onChange={(v: string) => update('eyebrow', v)} />
                        <TextField label="Título Principal" value={p.title} onChange={(v: string) => update('title', v)} />
                        <TextareaField label="Texto / Historia" value={p.body} onChange={(v: string) => update('body', v)} />
                        <TextField label="Botón" value={p.ctaLabel} onChange={(v: string) => update('ctaLabel', v)} />
                        <TextField label="Link del botón" value={p.ctaLink} onChange={(v: string) => update('ctaLink', v)} />
                    </PropGroup>
                    <PropGroup label="Multimedia y Estilos">
                        <TextField label="URL de Imagen Fija" value={p.image} onChange={(v: string) => update('image', v)} />
                        <SelectField label="Posición de Imagen" value={p.imagePosition} options={[{ value: 'left', label: 'Izquierda' }, { value: 'right', label: 'Derecha' }]} onChange={(v: string) => update('imagePosition', v)} />
                        <ColorField label="Color de Fondo" value={p.backgroundColor} onChange={(v: string) => update('backgroundColor', v)} />
                    </PropGroup>
                </>
            )

        case 'newsletter':
            return (
                <>
                    <PropGroup label="Textos">
                        <TextField label="Título" value={p.title} onChange={(v: string) => update('title', v)} />
                        <TextareaField label="Descripción corta" value={p.description} onChange={(v: string) => update('description', v)} />
                        <TextField label="Placeholder del input" value={p.placeholder} onChange={(v: string) => update('placeholder', v)} />
                        <TextField label="Texto del Botón" value={p.ctaLabel} onChange={(v: string) => update('ctaLabel', v)} />
                    </PropGroup>
                    <PropGroup label="Colores">
                        <ColorField label="Color de Acento" value={p.accentColor} onChange={(v: string) => update('accentColor', v)} />
                        <ColorField label="Color de Fondo" value={p.backgroundColor} onChange={(v: string) => update('backgroundColor', v)} />
                    </PropGroup>
                </>
            )

        case 'how-it-works':
            return (
                <PropGroup label="Cómo Funciona">
                    <TextField label="Título Principal" value={p.title} onChange={(v: string) => update('title', v)} />
                    <SelectField label="Diseño" value={p.layout} options={[{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }]} onChange={(v: string) => update('layout', v)} />

                    <div className="mt-4 space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Pasos</label>
                        {p.steps?.map((step: any, i: number) => (
                            <div key={i} className="bg-zinc-900 border border-white/5 p-3 rounded space-y-2 relative">
                                <button onClick={() => update('steps', p.steps.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-red-500 text-[10px] hover:text-red-400">X</button>
                                <TextField label="Número/Icono" value={step.number} onChange={(v: string) => { const steps = [...p.steps]; steps[i].number = v; update('steps', steps) }} />
                                <TextField label="Título" value={step.title} onChange={(v: string) => { const steps = [...p.steps]; steps[i].title = v; update('steps', steps) }} />
                                <TextareaField label="Descripción" value={step.description} onChange={(v: string) => { const steps = [...p.steps]; steps[i].description = v; update('steps', steps) }} />
                            </div>
                        ))}
                        <button onClick={() => update('steps', [...(p.steps || []), { number: '0X', title: 'Nuevo Paso', description: 'Describe este paso.' }])}
                            className="w-full py-1.5 border border-dashed border-white/20 rounded text-xs text-zinc-400 hover:text-white transition-all">+ Agregar Paso</button>
                    </div>
                </PropGroup>
            )

        case 'location':
            return (
                <>
                    <PropGroup label="Información">
                        <TextField label="Título Principal" value={p.title} onChange={(v: string) => update('title', v)} />
                        <TextField label="Dirección" value={p.address} onChange={(v: string) => update('address', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <TextField label="Ciudad" value={p.city} onChange={(v: string) => update('city', v)} />
                            <TextField label="País" value={p.country} onChange={(v: string) => update('country', v)} />
                        </div>
                        <TextField label="Email" value={p.email} onChange={(v: string) => update('email', v)} />
                        <TextField label="Teléfono" value={p.phone} onChange={(v: string) => update('phone', v)} />
                    </PropGroup>
                    <PropGroup label="Diseño y Mapa">
                        <SelectField label="Diseño" value={p.layout} options={[{ value: 'split', label: 'Dividido (Split)' }, { value: 'minimal', label: 'Minimalista' }]} onChange={(v: string) => update('layout', v)} />
                        <BooleanField label="Mostrar Mapa" value={p.showMap} onChange={(v: boolean) => update('showMap', v)} />
                        {p.showMap && <TextField label="URL de Google Maps (Embed)" value={p.mapUrl} onChange={(v: string) => update('mapUrl', v)} />}
                    </PropGroup>
                    <PropGroup label="Horarios">
                        <div className="space-y-2">
                            {p.hours?.map((item: any, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input value={item.day} onChange={e => { const h = [...p.hours]; h[i].day = e.target.value; update('hours', h) }} className="w-1/3 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Día" />
                                    <input value={item.hours} onChange={e => { const h = [...p.hours]; h[i].hours = e.target.value; update('hours', h) }} className="flex-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Horario" />
                                    <button onClick={() => update('hours', p.hours.filter((_: any, j: number) => j !== i))} className="text-red-500 px-1">X</button>
                                </div>
                            ))}
                            <button onClick={() => update('hours', [...(p.hours || []), { day: 'Lunes', hours: '9:00 - 18:00' }])}
                                className="w-full py-1.5 border border-dashed border-white/20 rounded text-xs text-zinc-400 hover:text-white transition-all">+ Agregar Horario</button>
                        </div>
                    </PropGroup>
                </>
            )

        case 'card-slider':
            return (
                <PropGroup label="Tarjetas / Slider">
                    <TextField label="Título Slider" value={p.title} onChange={(v: string) => update('title', v)} />
                    <BooleanField label="Mostrar Flechas" value={p.showArrows} onChange={(v: boolean) => update('showArrows', v)} />
                    <NumberField label="Ancho de Tarjeta (px)" value={p.cardWidth} min={200} max={600} onChange={(v: number) => update('cardWidth', v)} />
                    <NumberField label="Espacio (rem)" value={p.gap} min={0} max={8} onChange={(v: number) => update('gap', v)} />

                    <div className="mt-4 space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Tarjetas</label>
                        {p.cards?.map((card: any, i: number) => (
                            <div key={i} className="bg-zinc-900 border border-white/5 p-3 rounded space-y-2 relative">
                                <button onClick={() => update('cards', p.cards.filter((_: any, j: number) => j !== i))} className="absolute top-2 right-2 text-red-500 text-[10px] hover:text-red-400">X</button>
                                <TextField label="URL de Imagen" value={card.image} onChange={(v: string) => { const c = [...p.cards]; c[i].image = v; update('cards', c) }} />
                                <TextField label="Título" value={card.title} onChange={(v: string) => { const c = [...p.cards]; c[i].title = v; update('cards', c) }} />
                                <TextField label="Descripción corta" value={card.description} onChange={(v: string) => { const c = [...p.cards]; c[i].description = v; update('cards', c) }} />
                            </div>
                        ))}
                        <button onClick={() => update('cards', [...(p.cards || []), { image: '', title: 'Nueva Tarjeta', description: 'Detalles...' }])}
                            className="w-full py-1.5 border border-dashed border-white/20 rounded text-xs text-zinc-400 hover:text-white transition-all">+ Agregar Tarjeta</button>
                    </div>
                </PropGroup>
            )

        case 'heading':
            return (
                <PropGroup label="Encabezado">
                    <TextField label="Texto" value={p.text} onChange={(v: string) => update('text', v)} />
                    <SelectField label="Nivel" value={p.level} options={['h1','h2','h3','h4','h5','h6'].map(v => ({ value: v, label: v.toUpperCase() }))} onChange={(v: string) => update('level', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'xl', label: 'Mediano' },
                        { value: '3xl', label: 'Grande' }, { value: '5xl', label: 'Extra Grande' },
                        { value: '8xl', label: 'Gigante' },
                    ]} onChange={(v: string) => update('size', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={(v: string) => update('align', v)} />
                    <ColorField label="Color" value={p.color} onChange={(v: string) => update('color', v)} />
                    <SelectField label="Estilo" value={p.fontStyle} options={[
                        { value: 'normal', label: 'Normal' }, { value: 'italic', label: 'Itálica' }
                    ]} onChange={(v: string) => update('fontStyle', v)} />
                </PropGroup>
            )

        case 'paragraph':
            return (
                <PropGroup label="Párrafo">
                    <TextareaField label="Texto" value={p.text} onChange={(v: string) => update('text', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={(v: string) => update('align', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'base', label: 'Normal' },
                        { value: 'lg', label: 'Grande' }, { value: 'xl', label: 'Extra Grande' },
                    ]} onChange={(v: string) => update('size', v)} />
                    <ColorField label="Color" value={p.color} onChange={(v: string) => update('color', v)} />
                </PropGroup>
            )

        case 'button':
            return (
                <PropGroup label="Botón">
                    <TextField label="Texto" value={p.label} onChange={(v: string) => update('label', v)} />
                    <TextField label="Link" value={p.link} onChange={(v: string) => update('link', v)} />
                    <SelectField label="Estilo" value={p.variant} options={[
                        { value: 'primary', label: 'Primario' },
                        { value: 'secondary', label: 'Secundario' },
                        { value: 'outline', label: 'Outline' },
                        { value: 'ghost', label: 'Ghost' },
                    ]} onChange={(v: string) => update('variant', v)} />
                    <SelectField label="Tamaño" value={p.size} options={[
                        { value: 'sm', label: 'Pequeño' }, { value: 'md', label: 'Mediano' }, { value: 'lg', label: 'Grande' }
                    ]} onChange={(v: string) => update('size', v)} />
                    <AlignField label="Alineación" value={p.align} onChange={(v: string) => update('align', v)} />
                    <BooleanField label="Abrir en nueva pestaña" value={p.newTab} onChange={(v: boolean) => update('newTab', v)} />
                </PropGroup>
            )

        case 'image':
            return (
                <PropGroup label="Imagen">
                    <TextField label="URL de imagen" value={p.src} onChange={(v: string) => update('src', v)} placeholder="https://..." />
                    <TextField label="Texto alternativo" value={p.alt} onChange={(v: string) => update('alt', v)} />
                    <SelectField label="Ajuste" value={p.fit} options={[
                        { value: 'cover', label: 'Cubrir' }, { value: 'contain', label: 'Contener' },
                        { value: 'fill', label: 'Rellenar' },
                    ]} onChange={(v: string) => update('fit', v)} />
                    <SelectField label="Relación de aspecto" value={p.aspectRatio} options={[
                        { value: '16/9', label: '16:9' }, { value: '4/3', label: '4:3' },
                        { value: '1/1', label: '1:1' }, { value: '9/16', label: '9:16 (vertical)' },
                        { value: '3/1', label: '3:1 (banner)' },
                    ]} onChange={(v: string) => update('aspectRatio', v)} />
                    <TextField label="Link (opcional)" value={p.link} onChange={(v: string) => update('link', v)} />
                    <NumberField label="Border Radius" value={p.borderRadius} min={0} max={48} onChange={(v: number) => update('borderRadius', v)} />
                </PropGroup>
            )

        case 'video':
            return (
                <PropGroup label="Video">
                    <TextField label="URL de video" value={p.src} onChange={(v: string) => update('src', v)} placeholder="https://..." />
                    <SelectField label="Relación de aspecto" value={p.aspectRatio} options={[
                        { value: '16/9', label: '16:9' }, { value: '9/16', label: '9:16 (vertical)' }, { value: '1/1', label: '1:1' }
                    ]} onChange={(v: string) => update('aspectRatio', v)} />
                    <BooleanField label="Autoplay" value={p.autoplay} onChange={(v: boolean) => update('autoplay', v)} />
                    <BooleanField label="Sin sonido" value={p.muted} onChange={(v: boolean) => update('muted', v)} />
                    <BooleanField label="Loop" value={p.loop} onChange={(v: boolean) => update('loop', v)} />
                    <BooleanField label="Controles" value={p.controls} onChange={(v: boolean) => update('controls', v)} />
                </PropGroup>
            )

        case 'products-grid':
            return (
                <PropGroup label="Grilla de Productos">
                    <TextField label="Título" value={p.title} onChange={(v: string) => update('title', v)} />
                    <TextField label="Subtítulo" value={p.subtitle} onChange={(v: string) => update('subtitle', v)} />
                    <NumberField label="Columnas" value={p.columns} min={1} max={4} onChange={(v: number) => update('columns', v)} />
                    <NumberField label="Cantidad de productos" value={p.limit} min={1} max={24} onChange={(v: number) => update('limit', v)} />
                    <BooleanField label="Mostrar precio" value={p.showPrice} onChange={(v: boolean) => update('showPrice', v)} />
                    <BooleanField label="Botón agregar al carrito" value={p.showAddToCart} onChange={(v: boolean) => update('showAddToCart', v)} />
                </PropGroup>
            )

        case 'divider':
            return (
                <PropGroup label="Divisor">
                    <ColorField label="Color" value={p.color} onChange={(v: string) => update('color', v)} />
                    <NumberField label="Grosor (px)" value={p.thickness} min={1} max={8} onChange={(v: number) => update('thickness', v)} />
                    <SelectField label="Estilo" value={p.style} options={[
                        { value: 'solid', label: 'Sólido' }, { value: 'dashed', label: 'Punteado' }, { value: 'dotted', label: 'Puntos' }
                    ]} onChange={(v: string) => update('style', v)} />
                    <NumberField label="Margen vertical (px)" value={p.marginY} min={0} max={128} onChange={(v: number) => update('marginY', v)} />
                </PropGroup>
            )

        case 'faq':
            return (
                <PropGroup label="FAQ">
                    <TextField label="Título" value={p.title} onChange={(v: string) => update('title', v)} />
                    <div className="space-y-2 mt-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Preguntas</label>
                        {p.items?.map((item: any, i: number) => (
                            <div key={i} className="bg-zinc-900 rounded-lg p-3 space-y-2 border border-white/5 relative">
                                <button onClick={() => update('items', p.items.filter((_: any, j: number) => j !== i))}
                                    className="absolute top-2 right-2 text-red-500 text-[10px] hover:text-red-400">X</button>
                                <input
                                    value={item.question}
                                    onChange={e => {
                                        const items = [...p.items]; items[i].question = e.target.value
                                        update('items', items)
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white pr-6"
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
                            </div>
                        ))}
                        <button
                            onClick={() => update('items', [...(p.items || []), { question: 'Nueva pregunta', answer: 'Respuesta' }])}
                            className="w-full py-2 border border-dashed border-zinc-700 rounded-lg text-xs text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                        >
                            + Agregar Pregunta
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
