'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminEditorialPage() {
    const supabase = createClient()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
        if (data) setPosts(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

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
                            <h1 className="text-3xl font-serif font-bold">Editorial Manager</h1>
                            <p className="text-zinc-400">Manage blog posts, articles, and news.</p>
                        </div>
                    </div>
                    <Button className="bg-white text-black hover:bg-zinc-200">
                        <Plus className="mr-2 h-4 w-4" /> New Article
                    </Button>
                </div>

                {loading ? (
                    <div className="text-zinc-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                                <div className="h-40 w-full relative bg-zinc-950">
                                    {post.image_url ? (
                                        <Image
                                            src={post.image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <FileText size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {post.published ? 'Published' : 'Draft'} • {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-xl">
                                <p className="text-zinc-500">No articles yet. Start writing!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
