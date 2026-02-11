'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default function NewPostPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form State
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [content, setContent] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTitle(val)
        // Simple slugify
        const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        setSlug(slugified)
    }

    const handleSave = async () => {
        if (!title || !slug) {
            toast.error("Title and Slug are required")
            return
        }
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { error } = await supabase.from('posts').insert({
                title,
                slug,
                excerpt,
                content,
                cover_image: coverImage,
                published,
                author_id: user?.id
            })

            if (error) throw error

            toast.success("Post created successfully!")
            router.push('/dashboard/admin/editorial')

        } catch (error: any) {
            toast.error("Failed to create post", { description: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin/editorial">
                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">New Article</h1>
                            <p className="text-zinc-400 text-sm">Write something that surprises the world.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch checked={published} onCheckedChange={setPublished} id="pub-mode" />
                            <Label htmlFor="pub-mode" className={`text-xs uppercase font-bold tracking-wider ${published ? 'text-green-500' : 'text-zinc-500'}`}>
                                {published ? 'Publishing Live' : 'Draft Mode'}
                            </Label>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#ff007f] hover:bg-[#d6006b] text-white min-w-[120px]"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Post
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <Input
                                placeholder="Article Title"
                                className="bg-transparent border-none text-4xl font-black placeholder:text-zinc-700 focus-visible:ring-0 px-0 h-auto leading-tight"
                                value={title}
                                onChange={handleTitleChange}
                            />
                            <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono">
                                <LinkIcon className="h-3 w-3" />
                                <span>/posts/</span>
                                <input
                                    className="bg-transparent border-none text-zinc-400 focus:text-[#ff007f] focus:outline-none w-full"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                />
                            </div>
                        </div>

                        <Textarea
                            className="min-h-[500px] bg-zinc-900/30 border-none resize-y text-lg leading-relaxed text-zinc-300 focus-visible:ring-0 p-6 placeholder:text-zinc-800"
                            placeholder="Tell your story... (Supports Markdown)"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6 h-fit sticky top-8">
                        {/* Cover Image */}
                        <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <Label className="uppercase text-[10px] tracking-wider font-bold text-zinc-500">Cover Media</Label>

                            <div className="aspect-video bg-black rounded-lg border border-zinc-800 overflow-hidden flex items-center justify-center relative group">
                                {coverImage ? (
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-zinc-700 flex flex-col items-center">
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-xs">No image selected</span>
                                    </div>
                                )}
                            </div>

                            <Input
                                placeholder="Paste Image/GIF URL..."
                                className="bg-black border-zinc-800 text-xs"
                                value={coverImage}
                                onChange={e => setCoverImage(e.target.value)}
                            />
                            <p className="text-[10px] text-zinc-500">
                                Supports .gif for animated covers.
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <Label className="uppercase text-[10px] tracking-wider font-bold text-zinc-500">Excerpt / SEO</Label>
                            <Textarea
                                placeholder="Short summary for preview cards..."
                                className="bg-black border-zinc-800 text-sm min-h-[100px]"
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                            />
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}
