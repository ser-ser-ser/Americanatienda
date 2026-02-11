'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, FolderOpen, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { FileUpload } from '@/components/ui/file-upload'
import Image from 'next/image'

interface Category {
    id: string
    name: string
    slug: string
    store_context: string
    image_url: string | null
}

export default function AdminCategoriesPage() {
    const supabase = createClient()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        store_context: 'general',
        image_url: ''
    })

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (error) {
            toast.error('Failed to load categories')
            console.error(error)
        } else {
            setCategories(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category)
            setFormData({
                name: category.name,
                store_context: category.store_context || 'general',
                image_url: category.image_url || ''
            })
        } else {
            setEditingCategory(null)
            setFormData({
                name: '',
                store_context: 'general',
                image_url: ''
            })
        }
        setIsDialogOpen(true)
    }

    // Extract unique contexts from existing categories for "Smart Chips"
    const uniqueContexts = Array.from(new Set(categories.map(c => c.store_context).filter(Boolean))).sort()
    const allContexts = Array.from(new Set([...['General', 'Sex Shop', 'Smoke Shop'], ...uniqueContexts]))

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const { error } = await supabase.from('categories').delete().eq('id', id)
            if (error) throw error
            toast.success('Category deleted')
            fetchCategories()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name) return toast.error('Name is required')

        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: formData.name,
                        slug: slug,
                        store_context: formData.store_context,
                        image_url: formData.image_url
                    })
                    .eq('id', editingCategory.id)

                if (error) throw error
                toast.success('Category updated')
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert({
                        name: formData.name,
                        slug: slug,
                        store_context: formData.store_context,
                        image_url: formData.image_url
                    })

                if (error) throw error
                toast.success('Category created')
            }

            setIsDialogOpen(false)
            fetchCategories()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Operation failed')
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Category Manager</h1>
                            <p className="text-zinc-400">Manage global marketplace collections</p>
                        </div>
                    </div>
                    <Button onClick={() => handleOpenDialog()} className="bg-white text-black hover:bg-zinc-200">
                        <Plus className="mr-2 h-4 w-4" /> Add Collection
                    </Button>
                </div>

                {loading ? (
                    <div className="text-zinc-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                                {/* Cover Media */}
                                <div className="h-40 w-full relative bg-zinc-950">
                                    {cat.image_url ? (
                                        cat.image_url.endsWith('.mp4') || cat.image_url.endsWith('.webm') ? (
                                            <video
                                                src={cat.image_url}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <Image
                                                src={cat.image_url}
                                                alt={cat.name}
                                                fill
                                                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <FolderOpen size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleOpenDialog(cat)}>
                                            <Pencil size={14} />
                                        </Button>
                                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{cat.name}</h3>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-zinc-400">
                                            {cat.store_context || 'Global'}
                                        </span>
                                        <span className="text-xs uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-zinc-400 font-mono">
                                            /{cat.slug}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit/Create Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
                            <DialogDescription>
                                Set the category name and upload a cover image (or video) for the marketplace.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-black border-zinc-800"
                                    placeholder="e.g. Vaporizers"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Store Context</Label>
                                <div className="space-y-3">
                                    <Label>Department / Context</Label>
                                    <Input
                                        value={formData.store_context}
                                        onChange={(e) => setFormData(prev => ({ ...prev, store_context: e.target.value }))}
                                        className="bg-black border-zinc-800"
                                        placeholder="e.g. Sex Shop, Art, General, Pharmacy..."
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {allContexts.map(ctx => (
                                            <Badge
                                                key={ctx}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-white hover:text-black transition-colors"
                                                onClick={() => setFormData(prev => ({ ...prev, store_context: ctx.toLowerCase().replace(' ', '-') }))}
                                            >
                                                {ctx}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Type any department name you want. This groups categories on the storefront.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Media (Image or Video)</Label>
                                <div className="border border-dashed border-zinc-800 rounded-lg p-2">
                                    <FileUpload
                                        bucketName="cms_media"
                                        folderName="categories"
                                        label={formData.image_url ? "Change Media" : "Upload Media"}
                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                                        accept="image/*,video/*"
                                    />
                                </div>
                                {formData.image_url && (
                                    <div className="relative h-32 w-full rounded-md overflow-hidden mt-2 bg-black">
                                        {formData.image_url.endsWith('.mp4') || formData.image_url.endsWith('.webm') ? (
                                            <video
                                                src={formData.image_url}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-800 hover:bg-zinc-800 text-white">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} className="bg-white text-black hover:bg-zinc-200">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
