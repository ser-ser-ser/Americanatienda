import { create } from 'zustand'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface BuilderState {
    device: DeviceType
    viewportSize: { width: string; height: string }
    activePanel: 'elements' | 'pages' | 'layout' | 'styles' | 'media' | 'settings' | 'motion'
    activeModal: 'help' | 'media' | 'infrastructure' | null
    zoom: number
    isMobileOverrideActive: boolean

    // Actions
    setDevice: (device: DeviceType) => void
    setActivePanel: (panel: BuilderState['activePanel']) => void
    setActiveModal: (modal: BuilderState['activeModal']) => void
    setZoom: (zoom: number) => void
    toggleMobileOverride: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
    device: 'desktop',
    viewportSize: { width: '100%', height: '100%' },
    activePanel: 'elements',
    activeModal: null,
    zoom: 100,
    isMobileOverrideActive: false,

    setDevice: (device) => set((state) => {
        let width = '100%'
        let height = '100%'

        if (device === 'mobile') {
            width = '375px'
            height = '667px'
        } else if (device === 'tablet') {
            width = '768px'
            height = '1024px'
        }

        return {
            device,
            viewportSize: { width, height },
            // Auto-switch to 85% zoom on mobile to fit nicely if needed, or keep 100
            zoom: device === 'mobile' ? 100 : 100
        }
    }),

    setActivePanel: (panel) => set({ activePanel: panel }),

    setActiveModal: (modal) => set({ activeModal: modal }),

    setZoom: (zoom) => set({ zoom }),

    toggleMobileOverride: () => set((state) => ({ isMobileOverrideActive: !state.isMobileOverrideActive }))
}))
