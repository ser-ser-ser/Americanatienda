'use client'
import React, { useCallback } from 'react'
import { BlockType, BLOCK_LIBRARY, BlockCategory } from '@/types/builder'
import { useBuilderStore } from '@/stores/builder-store'
import {
    Square, Box, Columns, Grid3X3, Minus,
    Heading, AlignLeft, List, Quote, MousePointer,
    Image, Video, Star, UserCircle,
    TerminalSquare, ChevronDown, AlignJustify, RadioTower, CheckSquare,
    Navigation, Link2, ChevronsRight, Layers as LayersIcon,
    Zap, MessageSquare, Megaphone, HelpCircle, DollarSign,
    ShoppingBag, LayoutGrid, Package,
    GalleryHorizontal, CreditCard, Users,
    ChevronRight, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.FC<any>> = {
    Square, Box, Columns, Grid3X3, Minus,
    Heading, AlignLeft, List, Quote, MousePointer,
    Image, Video, Star, UserCircle,
    Zap, MessageSquare, Megaphone, HelpCircle, DollarSign,
    ShoppingBag, LayoutGrid, Package,
    GalleryHorizontal, CreditCard, Users,
    Layers: LayersIcon,
}

const CATEGORIES: { id: BlockCategory; label: string; emoji: string }[] = [
    { id: 'layout', label: 'Layout', emoji: '📐' },
    { id: 'text', label: 'Texto', emoji: '✍️' },
    { id: 'media', label: 'Media', emoji: '🖼️' },
    { id: 'marketing', label: 'Marketing', emoji: '🎯' },
    { id: 'ecommerce', label: 'E-commerce', emoji: '🛍️' },
    { id: 'effects', label: 'Efectos', emoji: '✨' },
    { id: 'forms', label: 'Formularios', emoji: '📝' },
    { id: 'navigation', label: 'Navegación', emoji: '🔗' },
]

export function BuilderSidebar() {
    const { addBlock } = useBuilderStore()
    const [openCategory, setOpenCategory] = React.useState<BlockCategory | null>('marketing')
    const [search, setSearch] = React.useState('')

    const handleAddBlock = useCallback((type: BlockType) => {
        const def = BLOCK_LIBRARY.find(b => b.type === type)
        if (!def) return
        addBlock({
            id: '',
            type,
            props: { ...def.defaultProps },
        })
    }, [addBlock])

    const filteredBlocks = search
        ? BLOCK_LIBRARY.filter(b =>
            b.label.toLowerCase().includes(search.toLowerCase()) ||
            b.type.toLowerCase().includes(search.toLowerCase())
        )
        : null

    return (
        <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-[#0c0c0c] flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Bloques</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar bloque..."
                        className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff007f]/50"
                    />
                </div>
            </div>

            {/* Block List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {search && filteredBlocks ? (
                    <div className="p-3 space-y-1">
                        {filteredBlocks.map(def => (
                            <BlockItem key={def.type} def={def} onAdd={handleAddBlock} />
                        ))}
                        {filteredBlocks.length === 0 && (
                            <p className="text-xs text-zinc-600 text-center py-8">Sin resultados</p>
                        )}
                    </div>
                ) : (
                    CATEGORIES.map(cat => {
                        const blocks = BLOCK_LIBRARY.filter(b => b.category === cat.id)
                        if (blocks.length === 0) return null
                        const isOpen = openCategory === cat.id
                        return (
                            <div key={cat.id}>
                                <button
                                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider">
                                        <span>{cat.emoji}</span>
                                        {cat.label}
                                    </span>
                                    <ChevronRight
                                        className={cn(
                                            'w-3 h-3 text-zinc-600 transition-transform',
                                            isOpen && 'rotate-90'
                                        )}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-3 pb-3 space-y-1 border-b border-white/5">
                                        {blocks.map(def => (
                                            <BlockItem key={def.type} def={def} onAdd={handleAddBlock} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            `}</style>
        </aside>
    )
}

function BlockItem({ def, onAdd }: { def: any; onAdd: (type: BlockType) => void }) {
    const Icon = ICON_MAP[def.icon] || Square
    return (
        <button
            onClick={() => onAdd(def.type)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left group hover:bg-white/5 transition-all border border-transparent hover:border-white/10 active:scale-95"
        >
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center group-hover:bg-[#ff007f]/10 group-hover:border-[#ff007f]/20 transition-all flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#ff007f]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-400 group-hover:text-white truncate">{def.label}</p>
                {def.description && (
                    <p className="text-[9px] text-zinc-600 truncate">{def.description}</p>
                )}
            </div>
            <Plus className="w-3 h-3 text-zinc-700 group-hover:text-[#ff007f] opacity-0 group-hover:opacity-100 transition-all" />
        </button>
    )
}
