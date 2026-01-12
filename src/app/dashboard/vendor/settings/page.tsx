'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, Store, Save, ExternalLink, Plus, Trash2, Image as ImageIcon, ChevronLeft, LayoutGrid } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/components/ui/file-upload'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Link from 'next/link'

export default function VendorPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Multi-Store State
    const [stores, setStores] = useState<any[]>([])
    const [selectedStore, setSelectedStore] = useState<any>(null)
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list')

    const [categories, setCategories] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        theme_color: '#000000',
        logo_url: '',
        cover_image_url: ''
    })

    // New Category State
    const [newCategory, setNewCategory] = useState({ name: '', image: '' })

    useEffect(() => {
        const checkUserAndStores = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Fetch User's Stores (All)
            const { data: userStores } = await supabase
                .from('stores')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })

            if (userStores) {
                setStores(userStores)
                // Removed auto-redirect to 'create' so users see the proper dashboard state
            }

            setLoading(false)
        }

        checkUserAndStores()
    }, [router, supabase])

    const loadStoreDetails = async (store: any) => {
        setLoading(true)
        setSelectedStore(store)
        setFormData({
            name: store.name,
            slug: store.slug,
            description: store.description || '',
            theme_color: store.theme_color || '#000000',
            logo_url: store.logo_url || '',
            cover_image_url: store.cover_image_url || ''
        })

        // Fetch Categories for this store
        const { data: cats } = await supabase
            .from('store_categories')
            .select('*')
            .eq('store_id', store.id)
            .order('created_at', { ascending: true })

        setCategories(cats || [])
        setView('edit')
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            theme_color: '#000000',
            logo_url: '',
            cover_image_url: ''
        })
        setAcceptedTerms(false)
    }

    const handleCreateNew = () => {
        setSelectedStore(null)
        resetForm()
        setView('create')
    }

    const handleBackToList = () => {
        setView('list')
        setSelectedStore(null)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        // Auto-generate slug only on create mode
        if (!selectedStore) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            setFormData(prev => ({ ...prev, name, slug }))
        } else {
            setFormData(prev => ({ ...prev, name }))
        }
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            if (selectedStore) {
                // Update
                const { error } = await supabase
                    .from('stores')
                    .update({
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description,
                        theme_color: formData.theme_color,
                        logo_url: formData.logo_url,
                        cover_image_url: formData.cover_image_url
                    })
                    .eq('id', selectedStore.id)

                if (error) throw error
                toast.success('Store updated successfully')

                // Update local list
                setStores(stores.map(s => s.id === selectedStore.id ? { ...s, ...formData } : s))
            } else {
                // Create
                if (!acceptedTerms) {
                    toast.error('You must accept the terms and conditions.')
                    setSaving(false)
                    return
                }

                const { data: newStore, error } = await supabase
                    .from('stores')
                    .insert({
                        owner_id: user.id,
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description,
                        logo_url: formData.logo_url,
                        cover_image_url: formData.cover_image_url,
                        theme_color: formData.theme_color
                    })
                    .select()
                    .single()

                if (error) throw error
                toast.success('Store created successfully!')

                // Add to list and switch to edit mode
                setStores([newStore, ...stores])
                setSelectedStore(newStore)
                setView('edit') // Or keep in list? standard UX is usually go to edit or list. Let's go to edit.
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save store')
        } finally {
            setSaving(false)
        }
    }

    const handleAddCategory = async () => {
        if (!newCategory.name) return toast.error('Category Name is required')
        const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        try {
            const { data, error } = await supabase
                .from('store_categories')
                .insert({
                    store_id: selectedStore.id,
                    name: newCategory.name,
                    slug: slug,
                    image_url: newCategory.image
                })
                .select()
                .single()

            if (error) throw error
            setCategories([...categories, data])
            setNewCategory({ name: '', image: '' })
            toast.success('Category added')
        } catch (error: any) {
            toast.error(error.message || 'Failed to add category')
        }
    }

    const handleDeleteCategory = async (id: string) => {
        try {
            const { error } = await supabase.from('store_categories').delete().eq('id', id)
            if (error) throw error
            setCategories(categories.filter(c => c.id !== id))
            toast.success('Category deleted')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete category')
        }
    }
    const handleInitializeDefaults = async () => {
        setSaving(true)
        try {
            // 1. Fetch existing CMS content (images)
            const { data: contentData } = await supabase.from('site_content').select('*')
            let coverSex = ''
            let coverSmoke = ''

            if (contentData) {
                const map = contentData.reduce((acc: any, item: any) => { acc[item.key] = item.value; return acc }, {})
                coverSex = map['store_cover_sex'] || ''
                coverSmoke = map['store_cover_smoke'] || ''
            }

            // Create Sex Shop -> "The Red Room"
            const { error: error1 } = await supabase.from('stores').upsert({
                owner_id: user.id,
                name: 'The Red Room',
                slug: 'the-red-room',
                description: 'Explore your desires in The Red Room. Premium adult wellness and intimacy.',
                theme_color: '#dc2626', // Red
                cover_image_url: coverSex // Sync from CMS
            }, { onConflict: 'slug' })

            if (error1) {
                console.error('Error init red room', error1)
                throw error1
            }

            // Create Smoke Shop -> "The Lounge"
            const { error: error2 } = await supabase.from('stores').upsert({
                owner_id: user.id,
                name: 'The Lounge',
                slug: 'the-lounge',
                description: 'Relax and unwind at The Lounge. Exclusive smoking accessories.',
                theme_color: '#16a34a', // Green
                cover_image_url: coverSmoke // Sync from CMS
            }, { onConflict: 'slug' })

            if (error2) {
                console.error('Error init lounge', error2)
                throw error2
            }

            toast.success('Stores imported successfully! Reloading...')
            window.location.reload()

        } catch (error: any) {
            console.error(error)
            toast.error('Failed to import: ' + (error.message || 'Unknown error'))
        } finally {
            setSaving(false)
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            {view === 'list' ? (
                                <>
                                    <h1 className="text-3xl font-serif font-bold text-white mb-2">My Stores</h1>
                                    <p className="text-zinc-400">Manage your stores and products.</p>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" onClick={handleBackToList}>
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold text-white mb-2">
                                            {view === 'create' ? 'Create New Store' : selectedStore?.name}
                                        </h1>
                                        <p className="text-zinc-400">
                                            {view === 'create' ? 'Launch a new brand' : 'Manage details & categories'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {view === 'list' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={handleInitializeDefaults} className="border-zinc-700 text-zinc-400 hover:text-white">
                                    Initialize Defaults
                                </Button>
                                <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
                                    <Plus className="mr-2 h-4 w-4" /> Create Store
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Stores List View */}
                    {view === 'list' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stores.length === 0 ? (
                                <Card className="bg-zinc-900 border-zinc-800 col-span-full py-12">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <Store className="h-12 w-12 text-zinc-600" />
                                        <h3 className="text-xl font-medium text-white">Welcome, Admin</h3>
                                        <p className="text-zinc-500 max-w-sm">
                                            You can start from scratch or import the example stores from the landing page.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button onClick={handleInitializeDefaults} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                                                Import "Red Room" & "The Lounge"
                                            </Button>
                                            <Button onClick={handleCreateNew}>Create Empty Store</Button>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                stores.map(store => (
                                    <Card key={store.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden">
                                        <div className="h-32 bg-zinc-800 relative">
                                            {store.cover_image_url ? (
                                                <img src={store.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div
                                                    className="w-full h-full"
                                                    style={{ background: `linear-gradient(to bottom right, ${store.theme_color || '#333'}, #000)` }}
                                                />
                                            )}
                                            <div className="absolute -bottom-6 left-6 h-12 w-12 rounded-full border-2 border-zinc-900 bg-black overflow-hidden shadow-lg">
                                                {store.logo_url ? (
                                                    <img src={store.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-serif font-bold">
                                                        {store.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <CardContent className="pt-10 pb-6 px-6">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{store.name}</h3>
                                            <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{store.description || 'No description'}</p>

                                            <div className="flex gap-3">
                                                <Button onClick={() => loadStoreDetails(store)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                                                    Manage
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={`/shops/${store.slug}`} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4 text-zinc-400" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {/* Create / Edit View */}
                    {(view === 'create' || view === 'edit') && (
                        <div className="grid gap-6">
                            {view === 'create' ? (
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Store Name</Label>
                                                <Input value={formData.name} onChange={handleNameChange} placeholder="e.g. Neon Dreams" className="bg-black/50 border-zinc-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>URL Slug</Label>
                                                <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))} className="bg-black/50 border-zinc-700" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="bg-black/50 border-zinc-700 min-h-[100px]" />
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                                                <label htmlFor="terms" className="text-sm font-medium leading-none text-zinc-400">
                                                    Acepto los <Link href="/terms" target="_blank" className="text-primary hover:underline">términos y condiciones</Link>.
                                                </label>
                                            </div>
                                            <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-white w-full md:w-auto">
                                                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Create Store'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Tabs defaultValue="settings" className="space-y-6">
                                    <TabsList className="bg-zinc-900 border border-zinc-800">
                                        <TabsTrigger value="settings">Settings</TabsTrigger>
                                        <TabsTrigger value="categories">Categories</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="settings">
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardContent className="space-y-6 pt-6">
                                                {/* Same Settings Form as before */}
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Store Name</Label>
                                                        <Input value={formData.name} onChange={handleNameChange} className="bg-black/50 border-zinc-700" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>URL Slug</Label>
                                                        <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))} className="bg-black/50 border-zinc-700" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="bg-black/50 border-zinc-700 min-h-[100px]" />
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Theme Color</Label>
                                                        <div className="flex gap-2">
                                                            <Input type="color" value={formData.theme_color} onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))} className="w-12 h-10 p-1 bg-black/50 border-zinc-700 cursor-pointer" />
                                                            <Input value={formData.theme_color} onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))} className="flex-1 bg-black/50 border-zinc-700" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Logo</Label>
                                                        <div className="flex gap-2 items-center">
                                                            {formData.logo_url && <img src={formData.logo_url} className="h-10 w-10 rounded border border-white/10" />}
                                                            <FileUpload
                                                                label={formData.logo_url ? "Change" : "Upload"}
                                                                bucketName="cms_media"
                                                                folderName="stores"
                                                                aspectRatio={1}
                                                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 col-span-2">
                                                        <Label>Cover Image</Label>
                                                        <div className="space-y-3">
                                                            {formData.cover_image_url && (
                                                                <div className="h-32 w-full relative rounded-lg border border-white/10 overflow-hidden">
                                                                    <img src={formData.cover_image_url} className="object-cover w-full h-full" />
                                                                </div>
                                                            )}
                                                            <FileUpload
                                                                label={formData.cover_image_url ? "Change Cover" : "Upload Cover"}
                                                                bucketName="cms_media"
                                                                folderName="stores"
                                                                aspectRatio={16 / 9}
                                                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-white/5 flex justify-between">
                                                    <Button variant="outline" asChild className="border-zinc-700">
                                                        <a href={`/shops/${selectedStore.slug}`} target="_blank">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> View Live
                                                        </a>
                                                    </Button>
                                                    <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-white">
                                                        {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="categories">
                                        <Card className="bg-zinc-900 border-zinc-800">
                                            <CardHeader>
                                                <CardTitle>Store Categories</CardTitle>
                                                <CardDescription>Organize products for {selectedStore.name}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="bg-black/30 border border-white/5 rounded-lg p-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
                                                    <div className="space-y-2">
                                                        <Label>Name</Label>
                                                        <Input value={newCategory.name} onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))} placeholder="New Category" className="bg-black/50 border-zinc-700" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Image</Label>
                                                        <div className="flex gap-2 items-center">
                                                            {newCategory.image && <img src={newCategory.image} className="h-10 w-10 rounded" />}
                                                            <FileUpload label="Upload" bucketName="cms_media" folderName="categories" onUploadComplete={(url) => setNewCategory(prev => ({ ...prev, image: url }))} />
                                                        </div>
                                                    </div>
                                                    <Button onClick={handleAddCategory}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                                                </div>

                                                <div className="space-y-2">
                                                    {categories.map(cat => (
                                                        <div key={cat.id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5 rounded-md">
                                                            <div className="flex items-center gap-3">
                                                                {cat.image_url ? <img src={cat.image_url} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 bg-zinc-800 rounded flex items-center justify-center"><ImageIcon className="h-5 w-5 text-zinc-500" /></div>}
                                                                <div>
                                                                    <div className="font-bold text-white text-sm">{cat.name}</div>
                                                                    <div className="text-xs text-zinc-500">/{cat.slug}</div>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-400" /></Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
