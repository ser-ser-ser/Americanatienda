'use client'
import React from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import {
    Monitor, Tablet, Smartphone, Eye, EyeOff,
    Save, RotateCcw, RotateCw, ArrowLeft, Zap, CheckCircle2, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeviceMode } from '@/types/builder'
import Link from 'next/link'

interface BuilderToolbarProps {
    title: string
    backHref: string
    onSave: () => Promise<void>
    liveUrl?: string
}

export function BuilderToolbar({ title, backHref, onSave, liveUrl }: BuilderToolbarProps) {
    const {
        deviceMode, setDeviceMode, togglePreview, isPreviewMode,
        isDirty, isSaving, setSaving, markClean
    } = useBuilderStore()

    const [saved, setSaved] = React.useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            await onSave()
            markClean()
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } finally {
            setSaving(false)
        }
    }

    const devices: { mode: DeviceMode; icon: React.FC<any>; label: string }[] = [
        { mode: 'desktop', icon: Monitor, label: 'Desktop' },
        { mode: 'tablet', icon: Tablet, label: 'Tablet' },
        { mode: 'mobile', icon: Smartphone, label: 'Móvil' },
    ]

    return (
        <header className="h-12 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0 z-50">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3 flex-1">
                <Link href={backHref} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden md:inline">Volver</span>
                </Link>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-[#ff007f]/10 rounded flex items-center justify-center">
                        <Zap className="w-3 h-3 text-[#ff007f]" />
                    </div>
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{title}</span>
                </div>
            </div>

            {/* Center: Device Mode */}
            <div className="flex items-center gap-0.5 bg-zinc-900 rounded-lg p-1">
                {devices.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => setDeviceMode(mode)}
                        title={label}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all',
                            deviceMode === mode
                                ? 'bg-white text-black'
                                : 'text-zinc-500 hover:text-white'
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Right: Preview + Save */}
            <div className="flex items-center gap-2 flex-1 justify-end">
                {liveUrl && (
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                        <Eye className="w-3 h-3" /> Live
                    </a>
                )}

                <button
                    onClick={togglePreview}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                        isPreviewMode
                            ? 'bg-white text-black border-white'
                            : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                    )}
                >
                    {isPreviewMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {isPreviewMode ? 'Editar' : 'Vista previa'}
                </button>

                <button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className={cn(
                        'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                        saved
                            ? 'bg-green-600 text-white'
                            : isDirty
                                ? 'bg-[#ff007f] text-white hover:bg-[#d6006b] shadow-[0_0_20px_rgba(255,0,127,0.3)]'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    )}
                >
                    {isSaving
                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</>
                        : saved
                            ? <><CheckCircle2 className="w-3 h-3" /> ¡Publicado!</>
                            : <><Save className="w-3 h-3" /> Publicar</>
                    }
                </button>

                {isDirty && !isSaving && (
                    <div className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse" title="Cambios sin guardar" />
                )}
            </div>
        </header>
    )
}
