'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    Layout,
    Globe,
    Check,
    AlertCircle,
    ArrowRight,
    Loader2,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MinimalTheme } from '@/components/templates/MinimalTheme'
import { BoutiqueTheme } from '@/components/templates/BoutiqueTheme'
import { BrutalistTheme } from '@/components/templates/BrutalistTheme'
import { toast } from 'sonner'

import { useVendor } from '@/providers/vendor-provider'

const TEMPLATE_COMPONENTS: Record<string, any> = {
    'minimal': MinimalTheme,
    'boutique': BoutiqueTheme,
    'brutalist': BrutalistTheme
}

export default function StoreDesignPage() {
    const supabase = createClient()
    const { activeStore } = useVendor()
    const [templates, setTemplates] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const { data, error } = await supabase
                    .from('store_templates')
                    .select('*')

                if (data && data.length > 0) {
                    // Filter to only show Minimal Theme as requested
                    const filteredData = data.filter((t: any) => t.config?.component_key === 'minimal')
                    if (filteredData.length > 0) {
                        setTemplates(filteredData)
                    } else {
                        // If Minimal is not in DB, fall back to hardcoded
                        setTemplates([
                            {
                                id: 'minimal',
                                name: 'Minimal Theme',
                                description: 'Clean, whitespace-heavy design for modern brands.',
                                preview_image_url: null,
                                config: {
                                    category: 'Fashion',
                                    component_key: 'minimal'
                                }
                            }
                        ])
                    }
                } else {
                    // Fallback: "Archaeology" result - if not in DB, use these recovered/new ones
                    // Structure matches DB schema now
                    setTemplates([
                        {
                            id: 'minimal',
                            name: 'Minimal Theme',
                            description: 'Clean, whitespace-heavy design for modern brands.',
                            preview_image_url: null,
                            config: {
                                category: 'Fashion',
                                component_key: 'minimal'
                            }
                        }
                    ])
                }
            } catch (error) {
                console.error("Error fetching templates:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTemplates()
    }, [])

    async function handleSelectTemplate(templateId: string) {
        if (!activeStore) return

        // Redirect to Builder Mode instead of immediate update
        const builderUrl = `/shops/${activeStore.slug}?mode=builder&preview_template=${templateId}`
        window.open(builderUrl, '_blank')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#f4256a]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex-1 h-full overflow-y-auto bg-black p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                            Diseño de Tienda
                        </h1>
                        <p className="text-zinc-400 mt-1 flex items-center gap-2">
                            Personaliza la apariencia de tu <span className="text-[#f4256a] font-bold">Tienda Online</span>
                        </p>
                    </div>
                </div>

                {/* Dark Social Banner */}
                <Card className="bg-linear-to-r from-zinc-900 via-zinc-900 to-black border-[#f4256a]/30 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-32 bg-[#f4256a]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="h-24 w-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                            <Globe className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <Badge className="bg-[#f4256a] text-white hover:bg-[#f4256a]/90">Activo Ahora</Badge>
                                <h3 className="text-2xl font-bold text-white">Dark Social Theme</h3>
                            </div>
                            <p className="text-zinc-400 text-lg mb-4 max-w-2xl">
                                Esta es la red social de nuestro marketplace. Tu tienda es parte de esta comunidad global.
                            </p>
                            <div className="flex items-start gap-2 text-sm text-zinc-500 bg-white/5 p-4 rounded-lg border border-white/5">
                                <AlertCircle className="h-4 w-4 text-[#f4256a] mt-0.5 shrink-0" />
                                <p>
                                    <strong className="text-zinc-300">Nota:</strong> También puedes seleccionar uno de los temas premium de abajo para personalizar completamente tu tienda e
                                    <span className="text-white font-medium"> integrar tu propio dominio</span>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Templates Grid Header */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Temas Disponibles</h2>
                </div>

                {/* Templates Grid */}
                {templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <Card key={template.id} className="bg-zinc-900/40 border-white/5 overflow-hidden group hover:border-[#f4256a]/50 transition-all duration-300">
                                <div className="aspect-video w-full bg-zinc-800 relative overflow-hidden">
                                    {template.preview_image_url ? (
                                        <img
                                            src={template.preview_image_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-900 to-black">
                                            <Layout className="h-12 w-12 text-zinc-700 group-hover:text-[#f4256a] transition-colors" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                                        <Badge className="self-start bg-[#f4256a] text-white border-none mb-2">
                                            {template.config?.category || 'E-commerce'}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                                    <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
                                        {template.description || "A clean, modern template for your professional store."}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            className="flex-1 bg-white text-black hover:bg-zinc-200 border-none font-bold group-hover:pl-6 transition-all"
                                            onClick={() => handleSelectTemplate(template.id)}
                                        >
                                            Select Template
                                            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Button>

                                        {/* Preview Button */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="border-white/20 text-white hover:bg-white/10"
                                            onClick={() => {
                                                if (activeStore) {
                                                    window.open(`/shops/${activeStore.slug}?preview_template=${template.id}`, '_blank')
                                                }
                                            }}
                                            title="Live Preview"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-white/10">
                        <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <Globe className="h-8 w-8 text-zinc-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Templates Found</h3>
                        <p className="text-zinc-500 max-w-md text-center">
                            We couldn't find any store templates in the system. Please check back later or contact support.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
