'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Sparkles, LayoutGrid, Type, Video, Image as ImageIcon, Store, Link as LinkIcon, Plus, Trash2, ArrowLeft, Paintbrush } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'
import { Textarea } from '@/components/ui/textarea'

export default function SettingsPage() {
    const [content, setContent] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [categories, setCategories] = useState<{ label: string, link: string, image: string }[]>([])
    const router = useRouter()
    const supabase = createClient()
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const { data } = await supabase
                .from('site_content')
                .select('*')
                .order('key')

            if (data) {
                const contentMap = data.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value
                    return acc
                }, {})
                setContent(contentMap)

                // Parse categories if they exist
                if (contentMap['nav_categories']) {
                    try {
                        setCategories(JSON.parse(contentMap['nav_categories']))
                    } catch (e) {
                        setCategories([])
                    }
                }
            }
        } catch (error) {
            console.error('Settings Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (key: string, value: string, section: string, type: string = 'text') => {
        // Update local state immediately
        setContent(prev => ({ ...prev, [key]: value }))

        // Debounced Auto-Save
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(async () => {
            setSaving('autosave')
            try {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({ key, value, section, type })
                    .select()

                if (!error) {
                    // Optional: subtle indicator
                }
            } catch (e) {
                console.error('Auto-save failed', e)
            } finally {
                setSaving(null)
            }
        }, 2000) // 2 second delay
    }

    const saveSection = async (sectionKeys: string[], sectionName: string) => {
        setSaving(sectionName)
        try {
            const updates = sectionKeys.map(key => ({
                key,
                value: content[key] || '',
                section: sectionName,
                type: key.includes('image') || key.includes('video') ? 'image' : 'text' // simple type inference
            }))

            const { error } = await supabase
                .from('site_content')
                .upsert(updates)
                .select()

            if (error) throw error
            toast.success(`${sectionName} Saved Successfully`)
        } catch (error: any) {
            toast.error('Failed to save: ' + error.message)
        } finally {
            setSaving(null)
        }
    }

    const handleCategoryChange = (index: number, field: 'label' | 'link', value: string) => {
        const newCats = [...categories]
        newCats[index] = { ...newCats[index], [field]: value }
        setCategories(newCats)
        setContent(prev => ({ ...prev, 'nav_categories': JSON.stringify(newCats) }))
    }

    const addCategory = () => {
        const newCats = [...categories, { label: 'New Category', link: '#', image: '' }]
        setCategories(newCats)
        setContent(prev => ({ ...prev, 'nav_categories': JSON.stringify(newCats) }))
    }

    const removeCategory = (index: number) => {
        const newCats = categories.filter((_, i) => i !== index)
        setCategories(newCats)
        setContent(prev => ({ ...prev, 'nav_categories': JSON.stringify(newCats) }))
    }

    const handleCategoryUpload = (index: number, url: string) => {
        const newCats = [...categories]
        newCats[index] = { ...newCats[index], image: url }
        setCategories(newCats)
        setContent(prev => ({ ...prev, 'nav_categories': JSON.stringify(newCats) }))
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-white" /></div>

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Settings</h1>
                    <p className="text-zinc-400">Manage global configurations and site content</p>
                    {saving === 'autosave' && <span className="text-xs text-primary animate-pulse">Saving changes...</span>}
                </div>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-white/10 text-zinc-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            <Tabs defaultValue="branding" className="space-y-6">
                <TabsList className="bg-zinc-900 border border-zinc-800 p-1 flex-wrap h-auto">
                    <TabsTrigger value="branding">Brand & SEO</TabsTrigger>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="stores">Portals (Stores)</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="legal">Legal & Contact</TabsTrigger>
                </TabsList>

                {/* BRANDING SECTION */}
                <TabsContent value="branding" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Paintbrush className="h-5 w-5" /> Brand Identity</CardTitle>
                            <CardDescription>Customize how your site appears in browsers and social media.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6 items-center border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Favicon</h3>
                                    <p className="text-zinc-400 text-sm mb-4">The small icon shown in browser tabs. Recommended: 512x512 PNG.</p>
                                    <FileUpload
                                        onUploadComplete={(url) => handleUpdate('branding_favicon', url, 'branding', 'image')}
                                        label="Upload Favicon"
                                        folderName="branding"
                                        aspectRatio={1}
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <div className="h-24 w-24 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-700 relative overflow-hidden">
                                        {content['branding_favicon'] ? (
                                            <img src={content['branding_favicon']} className="w-16 h-16 object-contain" alt="Favicon" />
                                        ) : (
                                            <div className="text-zinc-600 text-xs">No Icon</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 items-start">
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Social Share Image (OG)</h3>
                                    <p className="text-zinc-400 text-sm mb-4">The image displayed when your link is shared on WhatsApp, Facebook, iMessage, etc.</p>
                                    <p className="text-zinc-500 text-xs mb-4">Recommended: 1200 x 630 pixels.</p>
                                    <FileUpload
                                        onUploadComplete={(url) => handleUpdate('branding_og_image', url, 'branding', 'image')}
                                        label="Upload Share Image"
                                        folderName="branding"
                                        aspectRatio={1.91}
                                    />
                                </div>
                                <div>
                                    <div className="aspect-[1.91/1] bg-black rounded-lg border border-zinc-700 overflow-hidden relative">
                                        {content['branding_og_image'] ? (
                                            <img src={content['branding_og_image']} className="w-full h-full object-cover" alt="OG Preview" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                No Preview
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center text-xs text-zinc-500 mt-2">Preview (1.91:1 Ratio)</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => saveSection(['branding_favicon', 'branding_og_image'], 'branding')} disabled={saving === 'branding'}>
                                {saving === 'branding' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Branding
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* HERO SECTION */}
                <TabsContent value="hero" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Type className="h-5 w-5" /> Hero Text & Visuals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label>Main Title</Label>
                                <Input
                                    value={content['home_hero_title'] || ''}
                                    className="bg-black/50 border-zinc-700 font-serif text-xl"
                                    onChange={(e) => handleUpdate('home_hero_title', e.target.value, 'hero')}
                                    placeholder="e.g. AMERICANA"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtitle / Tagline</Label>
                                <Input
                                    value={content['home_hero_subtitle'] || ''}
                                    className="bg-black/50 border-zinc-700"
                                    onChange={(e) => handleUpdate('home_hero_subtitle', e.target.value, 'hero')}
                                    placeholder="e.g. Curated essentials for the modern provocateur."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>CTA Label</Label>
                                    <Input
                                        value={content['home_hero_cta_label'] || ''}
                                        className="bg-black/50 border-zinc-700"
                                        onChange={(e) => handleUpdate('home_hero_cta_label', e.target.value, 'hero')}
                                        placeholder="e.g. SHOP NOW"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>CTA Link</Label>
                                    <Input
                                        value={content['home_hero_cta_link'] || ''}
                                        className="bg-black/50 border-zinc-700"
                                        onChange={(e) => handleUpdate('home_hero_cta_link', e.target.value, 'hero')}
                                        placeholder="e.g. /#stores"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción Principal (Párrafo)</Label>
                                <Textarea
                                    value={content['home_hero_description'] || ''}
                                    className="bg-black/50 border-zinc-700 min-h-[100px]"
                                    onChange={(e) => handleUpdate('home_hero_description', e.target.value, 'hero')}
                                    placeholder="e.g. Where aesthetics meet indulgence. Explore curated collections..."
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Background Video/Image</Label>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-zinc-700 relative group">
                                    {content['home_hero_video'] ? (
                                        content['home_hero_video'].endsWith('.mp4') ? (
                                            <video src={content['home_hero_video']} autoPlay muted loop className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={content['home_hero_video']} className="w-full h-full object-cover" alt="Hero" />
                                        )
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-500">No media selected</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FileUpload
                                            onUploadComplete={(url) => handleUpdate('home_hero_video', url, 'hero', 'video')}
                                            label="Change Media"
                                            aspectRatio={16 / 9}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
                            <Button onClick={() => saveSection(['home_hero_title', 'home_hero_subtitle', 'home_hero_cta_label', 'home_hero_cta_link', 'home_hero_description', 'home_hero_video'], 'hero')} disabled={saving === 'hero'}>
                                {saving === 'hero' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* STORES / PORTALS SECTION */}
                <TabsContent value="stores" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Sex Shop */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> The Red Room (Sex Shop)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="aspect-[4/5] bg-black rounded-lg overflow-hidden border border-zinc-700 relative group">
                                    {content['store_cover_sex'] ? (
                                        content['store_cover_sex'].match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video src={content['store_cover_sex']} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                        ) : (
                                            <img src={content['store_cover_sex']} className="w-full h-full object-cover" alt="Sex Shop Cover" />
                                        )
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-500 bg-gradient-to-br from-pink-900 to-black">No Cover</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FileUpload
                                            onUploadComplete={(url) => handleUpdate('store_cover_sex', url, 'stores', 'image')}
                                            label="Upload Cover"
                                            folderName="stores"
                                            aspectRatio={4 / 5}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Smoke Shop */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> The Lounge (Smoke Shop)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="aspect-[4/5] bg-black rounded-lg overflow-hidden border border-zinc-700 relative group">
                                    {content['store_cover_smoke'] ? (
                                        content['store_cover_smoke'].match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video src={content['store_cover_smoke']} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                        ) : (
                                            <img src={content['store_cover_smoke']} className="w-full h-full object-cover" alt="Smoke Shop Cover" />
                                        )
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-500 bg-gradient-to-br from-green-900 to-black">No Cover</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FileUpload
                                            onUploadComplete={(url) => handleUpdate('store_cover_smoke', url, 'stores', 'image')}
                                            label="Upload Cover"
                                            folderName="stores"
                                            aspectRatio={4 / 5}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => saveSection(['store_cover_sex', 'store_cover_smoke'], 'stores')} disabled={saving === 'stores'}>
                            {saving === 'stores' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Portals
                        </Button>
                    </div>
                </TabsContent>

                {/* NAVIGATION SECTION */}
                <TabsContent value="navigation" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle>Menu Categories</CardTitle>
                            <CardDescription>Manage your top navigation tabs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categories.map((cat, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <Input
                                        value={cat.label}
                                        onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                                        className="bg-black/50 border-zinc-700 w-1/3"
                                        placeholder="Label (e.g. Lingerie)"
                                    />
                                    <div className="flex-1 flex items-center gap-2">
                                        {cat.image ? (
                                            <div className="h-10 w-10 relative rounded overflow-hidden border border-zinc-700">
                                                <img src={cat.image} className="h-full w-full object-cover" />
                                            </div>
                                        ) : <div className="h-10 w-10 bg-zinc-800 rounded border border-zinc-700" />}

                                        <FileUpload
                                            onUploadComplete={(url) => handleCategoryUpload(idx, url)}
                                            label={cat.image ? "Change" : "Image"}
                                            folderName="categories"
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeCategory(idx)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addCategory} className="border-dashed border-zinc-700 text-zinc-400 hover:text-white">
                                <Plus className="h-4 w-4 mr-2" /> Add Category
                            </Button>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
                            <Button onClick={() => saveSection(['nav_categories'], 'navigation')} disabled={saving === 'navigation'}>
                                {saving === 'navigation' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Menu
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* SOCIAL / INSTAGRAM SECTION */}
                <TabsContent value="social" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Social Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <Label>Instagram Profile URL</Label>
                                <Input
                                    value={content['social_instagram_url'] || ''}
                                    placeholder="https://instagram.com/americanatienda"
                                    className="bg-black/50 border-zinc-700"
                                    onChange={(e) => handleUpdate('social_instagram_url', e.target.value, 'social')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Facebook URL</Label>
                                <Input
                                    value={content['social_facebook_url'] || ''}
                                    placeholder="https://facebook.com/americanatienda"
                                    className="bg-black/50 border-zinc-700"
                                    onChange={(e) => handleUpdate('social_facebook_url', e.target.value, 'social')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Twitter / X URL</Label>
                                <Input
                                    value={content['social_twitter_url'] || ''}
                                    placeholder="https://twitter.com/americanatienda"
                                    className="bg-black/50 border-zinc-700"
                                    onChange={(e) => handleUpdate('social_twitter_url', e.target.value, 'social')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>GitHub URL</Label>
                                <Input
                                    value={content['social_github_url'] || ''}
                                    placeholder="https://github.com/americanatienda"
                                    className="bg-black/50 border-zinc-700"
                                    onChange={(e) => handleUpdate('social_github_url', e.target.value, 'social')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><LayoutGrid className="h-5 w-5" /> Grid Manager</CardTitle>
                            <CardDescription>Click any box to upload/replace the image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => {
                                    const key = `social_img_${i}`
                                    const val = content[key]
                                    return (
                                        <div key={i} className="aspect-square bg-black rounded-xl border border-zinc-800 relative group overflow-hidden">
                                            {val ? (
                                                val.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video src={val} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                                ) : (
                                                    <img src={val} className="w-full h-full object-cover" alt="Social" />
                                                )
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                    <ImageIcon className="h-8 w-8" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FileUpload
                                                    onUploadComplete={(url) => handleUpdate(key, url, 'social', 'image')}
                                                    label="Replace"
                                                    folderName="social"
                                                    aspectRatio={1}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
                            {/* Saving all social/grid items */}
                            <Button onClick={() => saveSection(['social_instagram_url', 'social_facebook_url', 'social_twitter_url', 'social_github_url', 'social_img_1', 'social_img_2', 'social_img_3', 'social_img_4'], 'social')} disabled={saving === 'social'}>
                                {saving === 'social' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Social
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* LEGAL SECTION */}
                <TabsContent value="legal" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle>Legal Pages & Footer Contact</CardTitle>
                            <CardDescription>Manage privacy policy and contact info</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Footer Description</Label>
                                <Textarea
                                    value={content['footer_description'] || ''}
                                    onChange={(e) => handleUpdate('footer_description', e.target.value, 'legal')}
                                    className="bg-black/50 border-zinc-700 min-h-[80px]"
                                    placeholder="e.g. Curated essentials for the modern provocateur."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Footer Contact Email</Label>
                                <Input
                                    value={content['footer_contact_email'] || ''}
                                    onChange={(e) => handleUpdate('footer_contact_email', e.target.value, 'legal')}
                                    className="bg-black/50 border-zinc-700"
                                    placeholder="info@americanatienda.mx"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Privacy Policy Text (Markdown supported)</Label>
                                <textarea
                                    value={content['privacy_policy_text'] || ''}
                                    className="flex min-h-[300px] w-full rounded-md border border-zinc-700 bg-black/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                    onChange={(e) => handleUpdate('privacy_policy_text', e.target.value, 'legal')}
                                    placeholder="# Privacy Policy..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => saveSection(['footer_description', 'footer_contact_email', 'privacy_policy_text'], 'Legal')} disabled={saving === 'Legal'}>
                                {saving === 'Legal' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Legal
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
