'use client'
import React from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import { BuilderBlock, BLOCK_LIBRARY } from '@/types/builder'
import {
    DndContext, closestCenter, PointerSensor,
    useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core'
import {
    SortableContext, verticalListSortingStrategy,
    useSortable, arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    GripVertical, Trash2, Copy, ChevronUp,
    ChevronDown, Eye, EyeOff, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlockRenderer } from './block-renderer'

import { useVendor } from '@/providers/vendor-provider'
import { StoreNavbar } from '@/components/store/store-navbar'
import { StoreFooter } from '@/components/store/store-footer'

export function BuilderCanvas() {
    const {
        blocks, deviceMode, selectedBlockId, hoveredBlockId,
        isPreviewMode, setBlocks, selectBlock, hoverBlock,
        removeBlock, duplicateBlock, moveBlock, addBlock
    } = useBuilderStore()
    
    // Get store data to render real navbar/footer
    const { activeStore } = useVendor()

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 8 }
    }))

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = blocks.findIndex(b => b.id === active.id)
        const newIndex = blocks.findIndex(b => b.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            setBlocks(arrayMove(blocks, oldIndex, newIndex))
        }
    }

    const canvasWidth = {
        desktop: '100%',
        tablet: '768px',
        mobile: '390px',
    }[deviceMode]

    return (
        <div className="flex-1 bg-[#111] overflow-auto flex flex-col items-center">
            {/* Canvas container */}
            <div
                className={cn(
                    'relative min-h-full transition-all duration-300 origin-top',
                    deviceMode !== 'desktop' && 'my-8 shadow-2xl rounded-2xl overflow-hidden border border-white/10'
                )}
                style={{ width: canvasWidth, maxWidth: canvasWidth }}
            >
                {/* Device frame for tablet/mobile */}
                {deviceMode !== 'desktop' && (
                    <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 border-b border-white/10 flex items-center justify-center gap-1 z-20">
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                        <div className="w-16 h-3 rounded-full bg-zinc-800" />
                    </div>
                )}

                <div className={cn(
                    'bg-black min-h-screen flex flex-col relative',
                    deviceMode !== 'desktop' && 'pt-8'
                )}>
                    {/* READ-ONLY NAVBAR OVERLAY */}
                    <div className="pointer-events-none opacity-80" style={{ zIndex: 40 }}>
                        <StoreNavbar store={activeStore || { name: 'Mi Tienda' }} />
                    </div>
                    {/* Protect navbar space with absolute overlay to avoid clicks */}
                    <div className="absolute top-0 left-0 right-0 h-16 z-50 cursor-not-allowed group" title="El menú se edita desde Configuración">
                         <div className="absolute inset-0 bg-[#ff007f]/0 group-hover:bg-[#ff007f]/10 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                             <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Menu Global</span>
                         </div>
                    </div>

                    <div className="flex-1">
                        {blocks.length === 0 ? (
                            <EmptyCanvas onAddBlock={addBlock} />
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={blocks.map(b => b.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {blocks.map((block, index) => (
                                        <SortableBlock
                                            key={block.id}
                                            block={block}
                                            index={index}
                                            isSelected={selectedBlockId === block.id}
                                            isHovered={hoveredBlockId === block.id}
                                            isPreview={isPreviewMode}
                                            onSelect={() => selectBlock(block.id)}
                                            onHover={(h) => hoverBlock(h ? block.id : null)}
                                            onDelete={() => removeBlock(block.id)}
                                            onDuplicate={() => duplicateBlock(block.id)}
                                            onMoveUp={() => moveBlock(index, index - 1)}
                                            onMoveDown={() => moveBlock(index, index + 1)}
                                            canMoveUp={index > 0}
                                            canMoveDown={index < blocks.length - 1}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>

                    {/* READ-ONLY FOOTER OVERLAY */}
                    <div className="mt-auto pointer-events-none opacity-80 relative group">
                        <StoreFooter store={activeStore || { name: 'Mi Tienda' }} />
                        <div className="absolute inset-0 bg-[#ff007f]/0 group-hover:bg-[#ff007f]/10 transition-colors flex items-center justify-center cursor-not-allowed pointer-events-auto backdrop-blur-[1px] opacity-0 group-hover:opacity-100" title="El footer se edita desde Configuración">
                             <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Footer Global</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


function EmptyCanvas({ onAddBlock }: { onAddBlock: any }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-12">
            <div className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Tu página está vacía</h3>
            <p className="text-zinc-500 text-sm mb-8 max-w-sm">
                Agrega bloques desde el panel izquierdo para empezar a construir tu página.
            </p>
        </div>
    )
}

function SortableBlock({
    block, index, isSelected, isHovered, isPreview,
    onSelect, onHover, onDelete, onDuplicate, onMoveUp, onMoveDown,
    canMoveUp, canMoveDown
}: {
    block: BuilderBlock
    index: number
    isSelected: boolean
    isHovered: boolean
    isPreview: boolean
    onSelect: () => void
    onHover: (h: boolean) => void
    onDelete: () => void
    onDuplicate: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    canMoveUp: boolean
    canMoveDown: boolean
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    const def = BLOCK_LIBRARY.find(b => b.type === block.type)

    if (isPreview) {
        return (
            <div ref={setNodeRef} style={style}>
                <BlockRenderer block={block} isEditing={false} />
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative group transition-all',
                isSelected && 'ring-2 ring-[#ff007f] ring-inset',
                isHovered && !isSelected && 'ring-1 ring-white/20 ring-inset',
            )}
            onClick={(e) => { e.stopPropagation(); onSelect() }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            {/* Block Controls — visible on hover/select */}
            {(isHovered || isSelected) && (
                <>
                    {/* Label badge */}
                    <div className="absolute top-0 left-0 z-50 flex items-center gap-0">
                        <div className="bg-[#ff007f] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                            <span>{def?.label || block.type}</span>
                        </div>
                    </div>

                    {/* Right action buttons */}
                    <div className="absolute top-0 right-0 z-50 flex items-center gap-0.5 p-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); onMoveUp() }}
                            disabled={!canMoveUp}
                            className="p-1 bg-black/80 hover:bg-[#ff007f] rounded text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMoveDown() }}
                            disabled={!canMoveDown}
                            className="p-1 bg-black/80 hover:bg-[#ff007f] rounded text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
                            className="p-1 bg-black/80 hover:bg-zinc-700 rounded text-white transition-all"
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete() }}
                            className="p-1 bg-black/80 hover:bg-red-600 rounded text-white transition-all"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                        {/* Drag handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="p-1 bg-black/80 hover:bg-zinc-700 rounded text-white cursor-grab active:cursor-grabbing transition-all ml-1"
                        >
                            <GripVertical className="w-3 h-3" />
                        </button>
                    </div>
                </>
            )}

            {/* Block Content */}
            <BlockRenderer block={block} isEditing={true} />
        </div>
    )
}
