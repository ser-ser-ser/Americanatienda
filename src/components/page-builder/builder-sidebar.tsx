'use client'
import React from 'react'
import { BlockType, BLOCK_LIBRARY, BlockCategory, BlockDefinition } from '@/types/builder'
import { useBuilderStore } from '@/stores/builder-store'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Category config with strong visual identity ─────────────
const CATEGORIES: {
    id: BlockCategory
    label: string
    color: string
    bg: string
    preview: string // visual representation
}[] = [
    { id: 'brand',      label: 'Marca',       color: '#ff007f', bg: 'rgba(255,0,127,0.12)', preview: '◆' },
    { id: 'marketing',  label: 'Marketing',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', preview: '▲' },
    { id: 'ecommerce',  label: 'E-commerce',  color: '#10b981', bg: 'rgba(16,185,129,0.12)', preview: '◼' },
    { id: 'effects',    label: 'Efectos',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', preview: '◉' },
    { id: 'media',      label: 'Media',       color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', preview: '▣' },
    { id: 'text',       label: 'Texto',       color: '#e5e7eb', bg: 'rgba(229,231,235,0.08)', preview: 'T' },
    { id: 'layout',     label: 'Layout',      color: '#6b7280', bg: 'rgba(107,114,128,0.12)', preview: '⊞' },
    { id: 'forms',      label: 'Formularios', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', preview: '▤' },
    { id: 'navigation', label: 'Navegación',  color: '#ec4899', bg: 'rgba(236,72,153,0.12)', preview: '↔' },
]

// ── Visual icon per block type ────────────────────────────────
const BLOCK_VISUALS: Record<string, { emoji: string; shape?: string }> = {
    // Brand
    location:       { emoji: '📍' },
    newsletter:     { emoji: '✉️' },
    'trust-bar':    { emoji: '🛡️' },
    marquee:        { emoji: '📢' },
    'brand-story':  { emoji: '📖' },
    'how-it-works': { emoji: '🔢' },
    // Marketing
    hero:           { emoji: '🎯' },
    feature:        { emoji: '⚡' },
    testimonial:    { emoji: '💬' },
    cta:            { emoji: '🔔' },
    faq:            { emoji: '❓' },
    pricing:        { emoji: '💎' },
    'social-proof': { emoji: '🏆' },
    // E-commerce
    'products-grid':    { emoji: '🛍️' },
    'categories-grid':  { emoji: '🗂️' },
    'product-card':     { emoji: '📦' },
    'cart-block':       { emoji: '🛒' },
    // Effects
    carousel:       { emoji: '🎠' },
    'card-slider':  { emoji: '🃏' },
    // Media
    image:          { emoji: '🖼️' },
    video:          { emoji: '🎬' },
    icon:           { emoji: '⭐' },
    avatar:         { emoji: '👤' },
    // Text
    heading:        { emoji: 'H1' },
    paragraph:      { emoji: '¶' },
    list:           { emoji: '≡' },
    quote:          { emoji: '"' },
    button:         { emoji: '⬚' },
    // Layout
    section:        { emoji: '▬' },
    container:      { emoji: '⊡' },
    columns:        { emoji: '⫴' },
    grid:           { emoji: '⊞' },
    divider:        { emoji: '—' },
}

export function BuilderSidebar() {
    const { addBlock } = useBuilderStore()
    const [openCategory, setOpenCategory] = React.useState<BlockCategory | null>('brand')
    const [search, setSearch] = React.useState('')

    const handleAddBlock = (type: BlockType) => {
        const def = BLOCK_LIBRARY.find(b => b.type === type)
        if (!def) return
        addBlock({ id: '', type, props: { ...def.defaultProps } })
    }

    const filteredBlocks = search.length > 1
        ? BLOCK_LIBRARY.filter(b =>
            b.label.toLowerCase().includes(search.toLowerCase()) ||
            b.type.includes(search.toLowerCase())
        )
        : null

    return (
        <aside className="w-[220px] flex-shrink-0 border-r border-white/5 bg-[#0c0c0c] flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-3 pt-3 pb-2 border-b border-white/[0.05]">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Bloques</p>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full bg-zinc-900/80 border border-white/5 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ff007f]/40 transition-colors"
                    />
                </div>
            </div>

            {/* Block list */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {search.length > 1 && filteredBlocks ? (
                    /* Search results */
                    <div className="p-2 space-y-0.5">
                        {filteredBlocks.map(def => (
                            <BlockItem key={def.type} def={def} onAdd={handleAddBlock} />
                        ))}
                        {filteredBlocks.length === 0 && (
                            <p className="text-center text-[11px] text-zinc-600 py-8">Sin resultados para "{search}"</p>
                        )}
                    </div>
                ) : (
                    /* Categorized accordion */
                    CATEGORIES.map(cat => {
                        const blocks = BLOCK_LIBRARY.filter(b => b.category === cat.id)
                        if (blocks.length === 0) return null
                        const isOpen = openCategory === cat.id

                        return (
                            <div key={cat.id}>
                                {/* Category header */}
                                <button
                                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.03] transition-colors group"
                                >
                                    {/* Color dot */}
                                    <div
                                        className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black flex-shrink-0"
                                        style={{ backgroundColor: cat.bg, color: cat.color }}
                                    >
                                        {cat.preview}
                                    </div>
                                    <span className="flex-1 text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200 uppercase tracking-[0.1em] text-left">
                                        {cat.label}
                                    </span>
                                    <span className="text-[9px] text-zinc-700 mr-1">{blocks.length}</span>
                                    <ChevronRight className={cn('w-3 h-3 text-zinc-700 transition-transform flex-shrink-0', isOpen && 'rotate-90')} />
                                </button>

                                {/* Block items */}
                                {isOpen && (
                                    <div className="bg-black/20 px-2 pb-2 space-y-0.5 border-b border-white/[0.04]">
                                        {blocks.map(def => (
                                            <BlockItem
                                                key={def.type}
                                                def={def}
                                                onAdd={handleAddBlock}
                                                categoryColor={cat.color}
                                                categoryBg={cat.bg}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </aside>
    )
}

function BlockItem({
    def,
    onAdd,
    categoryColor,
    categoryBg,
}: {
    def: BlockDefinition
    onAdd: (type: BlockType) => void
    categoryColor?: string
    categoryBg?: string
}) {
    const visual = BLOCK_VISUALS[def.type] || { emoji: '◻' }
    const isText = ['H1', '¶', '≡', '"', '⬚', '▬', '⊡', '⫴', '⊞', '—'].includes(visual.emoji)

    return (
        <button
            onClick={() => onAdd(def.type)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left group hover:bg-white/[0.05] transition-all active:scale-[0.97] border border-transparent hover:border-white/[0.07]"
        >
            {/* Visual icon */}
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm transition-all group-hover:scale-105"
                style={{
                    backgroundColor: categoryBg || 'rgba(255,255,255,0.05)',
                    color: categoryColor || '#71717a',
                    fontFamily: isText ? 'ui-monospace, monospace' : undefined,
                    fontWeight: isText ? 900 : undefined,
                    fontSize: isText ? 11 : 14,
                }}
            >
                {visual.emoji}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-zinc-300 group-hover:text-white truncate leading-tight">
                    {def.label}
                </p>
                {def.description && (
                    <p className="text-[9px] text-zinc-600 group-hover:text-zinc-500 truncate mt-0.5">
                        {def.description}
                    </p>
                )}
            </div>

            {/* Add icon - shows on hover */}
            <Plus className="w-3.5 h-3.5 text-zinc-700 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
        </button>
    )
}
