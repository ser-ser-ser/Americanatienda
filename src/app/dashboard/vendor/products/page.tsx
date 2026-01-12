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
import { Loader2, Plus, Search, Edit, Trash2, Save, ArrowLeft, Image as ImageIcon, Star, Video, X, Package } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import Image from 'next/image'
import { FileUpload } from '@/components/ui/file-upload'

export default function ProductsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState<any[]>([])
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
    const [store, setStore] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([]) // Local Store Categories
    const [globalCategories, setGlobalCategories] = useState<any[]>([]) // Global Marketplace Categories

    // View State
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Form Data
    const initialForm = {
        name: '',
        slug: '',
        sku: '',
        description: '',
        price: '',
        stock: '',
        category_id: null as string | null, // Global
        store_category_id: '', // Local
        images: [] as string[] // Array of URLs
    }
    const [formData, setFormData] = useState(initialForm)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Get Global Categories (Marketplace)
            const { data: globalCats } = await supabase.from('categories').select('*').order('name')
            setGlobalCategories(globalCats || [])

            // Get ALL Stores owned by user
            const { data: userStores } = await supabase
                .from('stores')
                .select('id, name, slug')
                .eq('owner_id', user.id)

            if (!userStores || userStores.length === 0) {
                toast.error('You need to create a store first')
                router.push('/dashboard/vendor')
                return
            }

            setStores(userStores)
            const currentStore = userStores[0]
            setSelectedStoreId(currentStore.id)
            setStore(currentStore)

            // Load Data for first store
            await loadStoreData(currentStore.id)
        }

        fetchData()
    }, [])

    const loadStoreData = async (storeId: string) => {
        setLoading(true)
        // Get Local Store Categories
        const { data: cats } = await supabase.from('store_categories').select('*').eq('store_id', storeId)
        setCategories(cats || [])

        // Get Products
        // Note: We might want to select category_id too to display it?
        const { data: prods } = await supabase
            .from('products')
            .select(`*, store_categories (name), categories (name)`)
            .eq('store_id', storeId)
            .order('created_at', { ascending: false })
        setProducts(prods || [])
        setLoading(false)
    }

    const handleStoreChange = async (storeId: string) => {
        setSelectedStoreId(storeId)
        const currentStore = stores.find(s => s.id === storeId)
        setStore(currentStore)
        await loadStoreData(storeId)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const newImages = [...formData.images]

        try {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${store.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-media')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-media')
                    .getPublicUrl(filePath)

                newImages.push(publicUrl)
            }
            setFormData(prev => ({ ...prev, images: newImages }))
            toast.success('Media uploaded')
        } catch (error: any) {
            toast.error(error.message || 'Error uploading')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...formData.images]
        newImages.splice(index, 1)
        setFormData(prev => ({ ...prev, images: newImages }))
    }

    const setCoverImage = (index: number) => {
        const newImages = [...formData.images]
        const [selected] = newImages.splice(index, 1)
        newImages.unshift(selected) // Move to front
        setFormData(prev => ({ ...prev, images: newImages }))
        toast.info('Cover image updated')
    }

    const handleSave = async () => {
        if (!formData.name || !formData.price || !selectedStoreId) {
            return toast.error('Required fields missing')
        }

        setSaving(true)
        try {
            const payload = {
                store_id: selectedStoreId,
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                sku: formData.sku,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                store_category_id: formData.store_category_id || null,
                category_id: formData.category_id || null, // Global
                images: formData.images
            }

            if (view === 'create') {
                const { data, error } = await supabase.from('products').insert(payload).select().single()
                if (error) throw error
                setProducts([data, ...products])
                toast.success('Product Created')
            } else if (view === 'edit' && editingId) {
                const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select().single()
                if (error) throw error
                setProducts(products.map(p => p.id === editingId ? data : p))
                toast.success('Product Updated')
            }

            setView('list')
            setFormData(initialForm)
            setEditingId(null)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (product: any) => {
        setEditingId(product.id)
        setFormData({
            name: product.name,
            slug: product.slug,
            sku: product.sku || '',
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            store_category_id: product.store_category_id || '',
            category_id: product.category_id || null,
            images: product.images || []
        })
        setView('edit')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) toast.error(error.message)
        else {
            setProducts(products.filter(p => p.id !== id))
            toast.success('Deleted')
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            <DashboardSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Inventory</h1>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <span>Managing:</span>
                                <Select value={selectedStoreId || ''} onValueChange={handleStoreChange}>
                                    <SelectTrigger className="w-[200px] h-8 bg-zinc-900 border-zinc-700 text-xs uppercase font-bold tracking-wider rounded-full">
                                        <SelectValue placeholder="Select Store" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {stores.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name || 'Unnamed Store'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {view === 'list' && (
                            <Button
                                onClick={() => { setView('create'); setFormData(initialForm); }}
                                className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold px-6"
                            >
                                <Plus className="mr-2 h-4 w-4" /> New Product
                            </Button>
                        )}
                    </div>

                    {/* CONTENT */}
                    {view === 'list' ? (
                        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                            {products.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center">
                                    <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                                        <Package className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
                                    <p className="text-zinc-500 mb-6 max-w-sm">Start adding products to your store to see them appear here.</p>
                                    <Button onClick={() => { setView('create'); setFormData(initialForm); }} variant="outline" className="border-white/10 hover:bg-white hover:text-black">
                                        Add First Product
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-4 p-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                        <div>Preview</div>
                                        <div>Product</div>
                                        <div>Stats</div>
                                        <div>Inventory</div>
                                        <div className="text-right">Actions</div>
                                    </div>

                                    {/* Rows */}
                                    {products.map(product => (
                                        <div key={product.id} className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                                            {/* Preview */}
                                            <div className="h-16 w-16 bg-zinc-800 rounded-lg overflow-hidden relative">
                                                {product.images?.[0] ? (
                                                    product.images[0].endsWith('.mp4') ? (
                                                        <video src={product.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted loop autoPlay playsInline />
                                                    ) : (
                                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon className="h-6 w-6" /></div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div>
                                                <h4 className="font-bold text-lg truncate max-w-[250px]">{product.name}</h4>
                                                {product.sku && <p className="text-xs font-mono text-primary">{product.sku}</p>}
                                                <p className="text-xs text-zinc-500 line-clamp-1">{product.description}</p>
                                            </div>

                                            {/* Stats/Category */}
                                            <div className="text-sm">
                                                <p className="text-zinc-400">{categories.find(c => c.id === product.store_category_id)?.name || 'Uncategorized'}</p>
                                                <p className="font-mono mt-1 text-white">${product.price.toFixed(2)}</p>
                                            </div>

                                            {/* Inventory */}
                                            <div>
                                                <div className={`text-xs font-bold uppercase inline-flex items-center px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="hover:bg-white/10" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                                                <Button size="icon" variant="ghost" className="hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Button variant="ghost" onClick={() => setView('list')} className="mb-6 text-zinc-400 hover:text-white pl-0 gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Products
                            </Button>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Media Gallery */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                                        <CardHeader>
                                            <CardTitle>Media Gallery</CardTitle>
                                            <CardDescription>Upload images and videos. The first item will be your cover.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                {/* Upload Button */}
                                                {/* Upload Button */}
                                                <FileUpload
                                                    bucketName="product-media"
                                                    folderName={store?.id || 'temp'}
                                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                                    aspectRatio={1}
                                                >
                                                    <div className="relative aspect-square bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-zinc-500 transition-colors flex flex-col items-center justify-center cursor-pointer group h-full w-full">
                                                        <Plus className="h-8 w-8 text-zinc-500 group-hover:text-white transition-colors" />
                                                        <span className="text-xs text-zinc-500 mt-2 font-medium">Add Media</span>
                                                    </div>
                                                </FileUpload>

                                                {/* Previews */}
                                                {formData.images.map((url, idx) => (
                                                    <div key={url} className="relative aspect-square bg-zinc-800 rounded-xl overflow-hidden group border border-white/5">
                                                        {url.endsWith('.mp4') ? (
                                                            <video src={url} className="w-full h-full object-cover" muted />
                                                        ) : (
                                                            <Image src={url} alt="Product" fill className="object-cover" />
                                                        )}

                                                        {/* Badge for Cover */}
                                                        {idx === 0 && (
                                                            <div className="absolute top-2 left-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full z-20">
                                                                COVER
                                                            </div>
                                                        )}

                                                        {/* Actions Overlay */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-sm">
                                                            {idx !== 0 && (
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black" onClick={() => setCoverImage(idx)} title="Set as Cover">
                                                                    <Star className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white" onClick={() => removeImage(idx)} title="Remove">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Video Indicator */}
                                                        {url.endsWith('.mp4') && (
                                                            <div className="absolute bottom-2 right-2 text-white/70">
                                                                <Video className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-zinc-500">
                                                <span className="text-zinc-300 font-bold">Pro Tip:</span> Vendors using video reels see 40% higher engagement.
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardHeader>
                                            <CardTitle>Product Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Product Name</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                    className="bg-black/50 border-zinc-700 h-12 text-lg"
                                                    placeholder="e.g. Neon Demon Boots"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={formData.description}
                                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                                    className="bg-black/50 border-zinc-700 min-h-[140px]"
                                                    placeholder="Tell the story of this product..."
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column: Stats & Settings */}
                                <div className="space-y-6">
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardHeader>
                                            <CardTitle>Inventory & Pricing</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Price ($)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                                                    className="bg-black/50 border-zinc-700 font-mono text-lg"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Stock Qty</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))}
                                                    className="bg-black/50 border-zinc-700 font-mono"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SKU / Reference</Label>
                                                <Input
                                                    value={formData.sku}
                                                    onChange={e => setFormData(p => ({ ...p, sku: e.target.value }))}
                                                    className="bg-black/50 border-zinc-700 font-mono text-sm uppercase"
                                                    placeholder="PROD-001"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardHeader>
                                            <CardTitle>Organization</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Marketplace Collection (Global)</Label>
                                                <Select
                                                    value={formData.category_id || ''}
                                                    onValueChange={v => setFormData(p => ({ ...p, category_id: v }))}
                                                >
                                                    <SelectTrigger className="bg-black/50 border-zinc-700">
                                                        <SelectValue placeholder="Select Global Category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        {globalCategories.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[10px] text-zinc-500">Determines where your product appears on the main site (e.g. 'Vapes', 'Fashion').</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Store Category (Local)</Label>
                                                <Select
                                                    value={formData.store_category_id}
                                                    onValueChange={v => setFormData(p => ({ ...p, store_category_id: v }))}
                                                >
                                                    <SelectTrigger className="bg-black/50 border-zinc-700">
                                                        <SelectValue placeholder="Select Store Category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                                        {categories.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-zinc-200 font-bold" disabled={saving}>
                                                {saving ? <Loader2 className="animate-spin h-4 w-4" /> : view === 'create' ? 'Publish Product' : 'Save Changes'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
