'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { TemplateSelector } from '@/components/vendor/template-selector'
import { Palette, Sparkles, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function StoreDesignPage() {
    const supabase = createClient()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null)
    const [storeName, setStoreName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: storeData, error } = await supabase
                    .from('stores')
                    .select('id, name, active_template_id')
                    .eq('owner_id', user.id)
                    .single()

                if (error) throw error

                if (storeData) {
                    setStoreId(storeData.id)
                    setStoreName(storeData.name)
                    setCurrentTemplateId(storeData.active_template_id)
                }
            } catch (err: any) {
                toast.error('Failed to load store data', {
                    description: err.message
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStoreData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 border-4 border-[#ff007f]/20 border-t-[#ff007f] rounded-full animate-spin mx-auto" />
                    <p className="text-zinc-400">Loading your design studio...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <Palette className="h-6 w-6 text-[#ff007f]" />
                                <h1 className="text-2xl font-bold">Store Design</h1>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Choose a template that reflects your brand aesthetic
                            </p>
                        </div>
                        <Button
                            onClick={() => window.open(`/${storeName}`, '_blank')}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Store
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Info Banner */}
                <div className="mb-8 p-6 bg-gradient-to-r from-[#ff007f]/10 to-transparent border border-[#ff007f]/20 rounded-xl">
                    <div className="flex items-start gap-4">
                        <Sparkles className="h-6 w-6 text-[#ff007f] flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-white mb-2">Professional Design Templates</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Each template has been crafted to showcase your products at their best.
                                Select the style that aligns with your brand identity. You can change
                                your template anytime without losing your products or content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Template Selector */}
                {storeId ? (
                    <TemplateSelector
                        storeId={storeId}
                        currentTemplateId={currentTemplateId}
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-zinc-400">No store found. Please contact support.</p>
                    </div>
                )}

                {/* Customization Coming Soon */}
                <div className="mt-12 p-8 bg-zinc-900/50 border border-white/5 rounded-xl text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 bg-[#ff007f]/10 rounded-full mb-4">
                        <Palette className="h-6 w-6 text-[#ff007f]" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Advanced Customization</h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Full color and font customization is coming soon. For now, select
                        the template that best matches your vision.
                    </p>
                </div>
            </div>
        </div>
    )
}
