'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

type Template = {
    id: string
    name: string
    description: string
    preview_image_url: string | null
    config: {
        theme: string
        colors: {
            primary: string
            secondary: string
            accent: string
            background: string
        }
        fonts: {
            heading: string
            body: string
        }
    }
}

type TemplateProps = {
    storeId: string
    currentTemplateId?: string | null
}

export function TemplateSelector({ storeId, currentTemplateId }: TemplateProps) {
    const supabase = createClient()
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState<string | null>(null)

    useEffect(() => {
        const fetchTemplates = async () => {
            const { data, error } = await supabase
                .from('store_templates')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true })

            if (data) setTemplates(data)
            setLoading(false)
        }
        fetchTemplates()
    }, [])

    const applyTemplate = async (templateId: string) => {
        setApplying(templateId)
        try {
            const { error } = await supabase.rpc('apply_template_to_store', {
                p_store_id: storeId,
                p_template_id: templateId
            })

            if (error) throw error

            toast.success('Template applied successfully! Your store has been updated.')
            // Optionally reload or update parent state
        } catch (err: any) {
            toast.error('Failed to apply template', {
                description: err.message
            })
        } finally {
            setApplying(null)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="h-96 animate-pulse bg-zinc-800/50" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Sparkles className="h-4 w-4" />
                <span>Choose a template that matches your brand aesthetic</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map(template => {
                    const isActive = template.id === currentTemplateId
                    const colors = template.config.colors

                    return (
                        <Card
                            key={template.id}
                            className={`relative overflow-hidden transition-all hover:shadow-xl ${isActive
                                    ? 'ring-2 ring-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.3)]'
                                    : 'bg-zinc-900 border-zinc-800'
                                }`}
                        >
                            {/* Preview Image */}
                            <div className="aspect-video bg-zinc-800 relative">
                                {template.preview_image_url ? (
                                    <Image
                                        src={template.preview_image_url}
                                        alt={template.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                        No Preview
                                    </div>
                                )}
                                {isActive && (
                                    <Badge className="absolute top-4 right-4 bg-[#ff007f] text-white border-none">
                                        <Check className="h-3 w-3 mr-1" />
                                        Active
                                    </Badge>
                                )}
                            </div>

                            {/* Template Info */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        {template.description}
                                    </p>
                                </div>

                                {/* Color Palette */}
                                <div className="flex gap-2">
                                    <div
                                        className="w-8 h-8 rounded-full border border-white/10"
                                        style={{ backgroundColor: colors.primary }}
                                        title={`Primary: ${colors.primary}`}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-full border border-white/10"
                                        style={{ backgroundColor: colors.secondary }}
                                        title={`Secondary: ${colors.secondary}`}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-full border border-white/10"
                                        style={{ backgroundColor: colors.accent }}
                                        title={`Accent: ${colors.accent}`}
                                    />
                                </div>

                                {/* Fonts */}
                                <div className="text-xs text-zinc-500 space-y-1">
                                    <div>Heading: {template.config.fonts.heading}</div>
                                    <div>Body: {template.config.fonts.body}</div>
                                </div>

                                {/* Action Button */}
                                <Button
                                    onClick={() => applyTemplate(template.id)}
                                    disabled={isActive || applying === template.id}
                                    className={`w-full ${isActive
                                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                            : 'bg-[#ff007f] hover:bg-[#d91b60] text-white'
                                        }`}
                                >
                                    {applying === template.id
                                        ? 'Applying...'
                                        : isActive
                                            ? 'Currently Active'
                                            : 'Apply Template'}
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
