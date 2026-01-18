'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Save, Layout, Menu, Newspaper, Globe, Play, Code, UploadCloud } from 'lucide-react'

export default function AdminCmsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [content, setContent] = useState<Record<string, string>>({})

    // Fetch initial content
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/admin/cms')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setContent(data)
            } catch (error) {
                toast.error('Could not load CMS content')
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Convert state object back to array for API
            const updates = Object.entries(content).map(([key, value]) => ({
                key,
                value
            }))

            const res = await fetch('/api/admin/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates })
            })

            if (!res.ok) throw new Error('Failed to save')

            toast.success('Changes published successfully!')
        } catch (error) {
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff007f]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Platform CMS</h1>
                        <p className="text-zinc-400">Manage global content, navigation, and branding.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#ff007f] hover:bg-[#d6006b] text-white"
                    >
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Publish Changes
                    </Button>
                </div>

                <Tabs defaultValue="branding" className="w-full">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="branding" className="data-[state=active]:bg-[#ff007f] data-[state=active]:text-white">
                            <Layout className="mr-2 h-4 w-4" /> Branding & Hero
                        </TabsTrigger>
                        <TabsTrigger value="navigation" className="data-[state=active]:bg-[#ff007f] data-[state=active]:text-white">
                            <Menu className="mr-2 h-4 w-4" /> Navigation
                        </TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-[#ff007f] data-[state=active]:text-white">
                            <Globe className="mr-2 h-4 w-4" /> Social Proof
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white ml-auto">
                            <Code className="mr-2 h-4 w-4" /> Dev Mode
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: BRANDING */}
                    <TabsContent value="branding" className="space-y-6 mt-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Hero Title (Main)</Label>
                                    <Input
                                        value={content['home_hero_title'] || ''}
                                        onChange={e => handleChange('home_hero_title', e.target.value)}
                                        className="bg-black border-zinc-800"
                                        placeholder="AMERICANA"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hero Subtitle (Italic)</Label>
                                    <Input
                                        value={content['home_hero_subtitle'] || ''}
                                        onChange={e => handleChange('home_hero_subtitle', e.target.value)}
                                        className="bg-black border-zinc-800"
                                        placeholder="REBEL. RESIST. EXIST."
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Hero Description</Label>
                                    <Textarea
                                        value={content['home_hero_description'] || ''}
                                        onChange={e => handleChange('home_hero_description', e.target.value)}
                                        className="bg-black border-zinc-800 min-h-[80px]"
                                        placeholder="Join the anti-system..."
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 p-6 space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Play className="h-4 w-4 text-[#ff007f]" /> Background Media
                            </h3>

                            {/* LIQUID DRAG & DROP ZONE */}
                            <div className="group relative border-2 border-dashed border-zinc-800 hover:border-[#ff007f] hover:bg-[#ff007f]/5 rounded-xl transition-all duration-500 p-8 text-center cursor-pointer overflow-hidden">
                                {content['home_hero_video'] ? (
                                    <div className="relative z-10">
                                        <video
                                            src={content['home_hero_video']}
                                            className="w-full max-h-[300px] object-cover rounded-lg shadow-2xl"
                                            autoPlay muted loop
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-[#ff007f] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <UploadCloud className="h-5 w-5" /> Replace Media
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10">
                                        <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#ff007f] transition-all duration-300">
                                            <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-white" />
                                        </div>
                                        <h4 className="text-zinc-300 font-bold mb-1 group-hover:text-white">Drag & Drop Hero Video</h4>
                                        <p className="text-zinc-500 text-xs">Supports .mp4, .webm (Max 50MB)</p>
                                    </div>
                                )}

                                {/* Hidden input for functionality, or text input below for fallback */}
                                <Input
                                    value={content['home_hero_video'] || ''}
                                    onChange={e => handleChange('home_hero_video', e.target.value)}
                                    className="mt-6 bg-black/50 border-zinc-700 text-center font-mono text-xs text-[#ff007f]"
                                    placeholder="Or paste URL here..."
                                />
                            </div>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: NAVIGATION (Visual Builder) */}
                    <TabsContent value="navigation" className="space-y-6 mt-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Main Menu Items</Label>
                                    <p className="text-xs text-zinc-500">Drag to reorder (coming soon)</p>
                                </div>

                                <div className="space-y-3">
                                    {(() => {
                                        // Safely parse existing JSON
                                        let items: { label: string, link: string }[] = []
                                        try {
                                            items = JSON.parse(content['nav_categories'] || '[]')
                                        } catch (e) { items = [] }

                                        const updateItems = (newItems: typeof items) => {
                                            handleChange('nav_categories', JSON.stringify(newItems))
                                        }

                                        return (
                                            <>
                                                {items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <Input
                                                            placeholder="Label (e.g. Shop)"
                                                            className="bg-black border-zinc-800 w-1/3"
                                                            value={item.label}
                                                            onChange={(e) => {
                                                                const newItems = [...items]
                                                                newItems[idx].label = e.target.value
                                                                updateItems(newItems)
                                                            }}
                                                        />
                                                        <Input
                                                            placeholder="Link (e.g. /shop)"
                                                            className="bg-black border-zinc-800 flex-1"
                                                            value={item.link}
                                                            onChange={(e) => {
                                                                const newItems = [...items]
                                                                newItems[idx].link = e.target.value
                                                                updateItems(newItems)
                                                            }}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-zinc-500 hover:text-red-500 hover:bg-red-950/20"
                                                            onClick={() => {
                                                                const newItems = items.filter((_, i) => i !== idx)
                                                                updateItems(newItems)
                                                            }}
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11.2972L10.8535 13.1025C10.8297 13.5893 10.4273 13.9688 9.94056 13.9688H5.05937C4.57262 13.9688 4.17028 13.5893 4.14649 13.1025L3.70278 4H3.5C3.22386 4 3 3.77614 3 3.5ZM4.70959 4L5.13824 12.9688H9.86171L10.2904 4H4.70959Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                                        </Button>
                                                    </div>
                                                ))}

                                                {/* Add New Row */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                        onClick={() => {
                                                            updateItems([...items, { label: '', link: '/' }])
                                                        }}
                                                    >
                                                        + Add Menu Item
                                                    </Button>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* TAB 3: SOCIAL */}
                    <TabsContent value="social" className="space-y-6 mt-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Instagram Profile URL</Label>
                                    <Input
                                        value={content['social_instagram_url'] || ''}
                                        onChange={e => handleChange('social_instagram_url', e.target.value)}
                                        className="bg-black border-zinc-800"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="space-y-2">
                                            <Label>Grid Image {i} (URL)</Label>
                                            <Input
                                                value={content[`social_img_${i}`] || ''}
                                                onChange={e => handleChange(`social_img_${i}`, e.target.value)}
                                                className="bg-black border-zinc-800"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* TAB 4: ADVANCED / DEV MODE */}
                    <TabsContent value="advanced" className="space-y-6 mt-6">
                        <Card className="bg-zinc-900/50 border-pink-900/20 p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-pink-900/20 rounded-lg">
                                    <Code className="h-5 w-5 text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Developer Overrides</h3>
                                    <p className="text-xs text-zinc-400">Inject custom logic for "Perrísima" animations.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono text-pink-500">Global Custom CSS</Label>
                                    <Textarea
                                        value={content['custom_css'] || ''}
                                        onChange={e => handleChange('custom_css', e.target.value)}
                                        className="bg-[#0a0a0a] border-zinc-800 font-mono text-xs min-h-[150px] text-green-400"
                                        placeholder=".hero-title { animation: glitch 1s infinite; }"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-mono text-yellow-500">Custom JavaScript (Snippet)</Label>
                                    <Textarea
                                        value={content['custom_js'] || ''}
                                        onChange={e => handleChange('custom_js', e.target.value)}
                                        className="bg-[#0a0a0a] border-zinc-800 font-mono text-xs min-h-[150px] text-yellow-200/80"
                                        placeholder="console.log('Hello Rebellion');"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <Label className="text-xs font-mono text-zinc-500 mb-2 block">Raw Config Dump (Read Only)</Label>
                                    <div className="bg-black p-4 rounded-lg border border-white/5 overflow-auto max-h-48">
                                        <pre className="text-[10px] text-zinc-600 font-mono">
                                            {JSON.stringify(content, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}
