import { create } from 'zustand'
import { temporal } from 'zundo'
import { BuilderBlock, BuilderHistory, DeviceMode, PageLayout, PageTheme, DEFAULT_THEMES } from '@/types/builder'

// ─────────────────────────────────────────────────────────────
// Builder Store — Global state for the page builder editor
// ─────────────────────────────────────────────────────────────

interface BuilderState {
    // Page state
    blocks: BuilderBlock[]
    theme: PageTheme
    deviceMode: DeviceMode
    isDirty: boolean
    isSaving: boolean
    isPreviewMode: boolean

    // Selection
    selectedBlockId: string | null
    hoveredBlockId: string | null

    // Context
    pageContext: 'marketplace' | 'store'
    storeId?: string

    // Actions — blocks
    setBlocks: (blocks: BuilderBlock[]) => void
    addBlock: (block: BuilderBlock, afterId?: string) => void
    removeBlock: (id: string) => void
    updateBlock: (id: string, props: Record<string, any>) => void
    updateBlockStyles: (id: string, styles: Record<string, any>) => void
    moveBlock: (fromIndex: number, toIndex: number) => void
    duplicateBlock: (id: string) => void

    // Actions — selection
    selectBlock: (id: string | null) => void
    hoverBlock: (id: string | null) => void

    // Actions — layout
    setDeviceMode: (mode: DeviceMode) => void
    setTheme: (theme: Partial<PageTheme>) => void
    togglePreview: () => void

    // Actions — persistence
    loadLayout: (layout: PageLayout) => void
    getLayout: () => PageLayout
    setSaving: (state: boolean) => void
    markClean: () => void
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 10)
}

export const useBuilderStore = create<BuilderState>()(
    (set, get) => ({
        // Initial state
        blocks: [],
        theme: DEFAULT_THEMES.default,
        deviceMode: 'desktop',
        isDirty: false,
        isSaving: false,
        isPreviewMode: false,
        selectedBlockId: null,
        hoveredBlockId: null,
        pageContext: 'marketplace',

        // ── Block Actions ─────────────────────────────────────
        setBlocks: (blocks) => set({ blocks, isDirty: true }),

        addBlock: (block, afterId) => {
            const newBlock = { ...block, id: block.id || generateId() }
            set((state) => {
                if (!afterId) {
                    return { blocks: [...state.blocks, newBlock], isDirty: true }
                }
                const idx = state.blocks.findIndex(b => b.id === afterId)
                const newBlocks = [...state.blocks]
                newBlocks.splice(idx + 1, 0, newBlock)
                return { blocks: newBlocks, isDirty: true }
            })
        },

        removeBlock: (id) => {
            set((state) => ({
                blocks: state.blocks.filter(b => b.id !== id),
                selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
                isDirty: true
            }))
        },

        updateBlock: (id, props) => {
            set((state) => ({
                blocks: state.blocks.map(b =>
                    b.id === id ? { ...b, props: { ...b.props, ...props } } : b
                ),
                isDirty: true
            }))
        },

        updateBlockStyles: (id, styles) => {
            set((state) => ({
                blocks: state.blocks.map(b =>
                    b.id === id ? { ...b, styles: { ...b.styles, ...styles } } : b
                ),
                isDirty: true
            }))
        },

        moveBlock: (fromIndex, toIndex) => {
            set((state) => {
                const newBlocks = [...state.blocks]
                const [moved] = newBlocks.splice(fromIndex, 1)
                newBlocks.splice(toIndex, 0, moved)
                return { blocks: newBlocks, isDirty: true }
            })
        },

        duplicateBlock: (id) => {
            set((state) => {
                const idx = state.blocks.findIndex(b => b.id === id)
                if (idx === -1) return state
                const original = state.blocks[idx]
                const clone = { ...original, id: generateId() }
                const newBlocks = [...state.blocks]
                newBlocks.splice(idx + 1, 0, clone)
                return { blocks: newBlocks, isDirty: true }
            })
        },

        // ── Selection ─────────────────────────────────────────
        selectBlock: (id) => set({ selectedBlockId: id }),
        hoverBlock: (id) => set({ hoveredBlockId: id }),

        // ── Layout ───────────────────────────────────────────
        setDeviceMode: (mode) => set({ deviceMode: mode }),
        setTheme: (theme) => set((state) => ({
            theme: { ...state.theme, ...theme },
            isDirty: true
        })),
        togglePreview: () => set((state) => ({
            isPreviewMode: !state.isPreviewMode,
            selectedBlockId: null
        })),

        // ── Persistence ──────────────────────────────────────
        loadLayout: (layout) => set({
            blocks: layout.blocks || [],
            theme: layout.theme || DEFAULT_THEMES.default,
            isDirty: false,
            selectedBlockId: null
        }),

        getLayout: (): PageLayout => {
            const state = get()
            return {
                version: 1,
                blocks: state.blocks,
                theme: state.theme,
            }
        },

        setSaving: (saving) => set({ isSaving: saving }),
        markClean: () => set({ isDirty: false }),
    })
)
