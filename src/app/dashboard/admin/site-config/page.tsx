'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Save, LayoutTemplate } from 'lucide-react'

export default function SiteConfigPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_cta: 'Shop Now',
        featured_collection: ''
    })

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase
                .from('site_content')
                .select('content')
                .eq('section_key', 'landing_hero')
                .single()

            if (data?.content) {
                setConfig(data.content)
            }
            setLoading(false)
        }
        fetchConfig()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.from('site_content').upsert({
                section_key: 'landing_hero',
                content: config,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section_key' })

            if (error) throw error
            toast.success('Landing page updated!')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Site Configuration</h1>
                            <p className="text-zinc-400">Manage the public facing landing page.</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving || loading} className="bg-primary hover:bg-primary/90 text-white">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>

                <div className="grid gap-8">
                    {/* Hero Section */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6 text-xl font-bold">
                            <LayoutTemplate className="h-5 w-5 text-zinc-400" />
                            Hero Section
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Main Title</Label>
                                <Input
                                    value={config.hero_title}
                                    onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                                    className="bg-black/50 border-zinc-700 font-serif text-lg"
                                    placeholder="e.g. CURATED VINTAGE & LIFESTYLE"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Subtitle</Label>
                                <Textarea
                                    value={config.hero_subtitle}
                                    onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                                    className="bg-black/50 border-zinc-700"
                                    placeholder="e.g. Discover unique pieces from the best independent stores."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CTA Button Text</Label>
                                    <Input
                                        value={config.hero_cta}
                                        onChange={(e) => setConfig({ ...config, hero_cta: e.target.value })}
                                        className="bg-black/50 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Featured Collection Slug</Label>
                                    <Input
                                        value={config.featured_collection}
                                        onChange={(e) => setConfig({ ...config, featured_collection: e.target.value })}
                                        className="bg-black/50 border-zinc-700"
                                        placeholder="e.g. new-arrivals"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
