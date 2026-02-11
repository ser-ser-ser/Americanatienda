'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { format } from 'date-fns'
import {
    Plus,
    Search,
    FileText,
    MoreHorizontal,
    Loader2,
    Globe,
    EyeOff
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function EditorialPage() {
    const supabase = createClient()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setPosts(data)
        setLoading(false)
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            Editorial Manager
                            <Badge variant="outline" className="border-zinc-800 text-zinc-500">
                                {posts.length} Posts
                            </Badge>
                        </h1>
                        <p className="text-zinc-400 mt-1">Manage articles for "The Club" and site news.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search articles..."
                                className="bg-zinc-900/50 border-zinc-800 pl-10 w-64"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <Link href="/dashboard/admin/editorial/new">
                            <Button className="bg-[#ff007f] hover:bg-[#d6006b] text-white">
                                <Plus className="mr-2 h-4 w-4" /> New Article
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content List */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#ff007f]" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 border border-zinc-800 rounded-xl bg-zinc-900/20 border-dashed">
                        <FileText className="h-12 w-12 text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-300">No articles yet</h3>
                        <p className="text-zinc-500 max-w-sm text-center mt-2 mb-6">
                            Start creating content to engage your community and boost SEO.
                        </p>
                        <Link href="/dashboard/admin/editorial/new">
                            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                                Create your first post
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPosts.map(post => (
                            <div
                                key={post.id}
                                className="group flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:border-[#ff007f]/30 hover:bg-zinc-900/60 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Cover Thumbnail */}
                                    <div className="h-16 w-24 bg-zinc-800 rounded overflow-hidden shrink-0 border border-white/5">
                                        {post.cover_image ? (
                                            <img src={post.cover_image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-700">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-white group-hover:text-[#ff007f] transition-colors line-clamp-1">
                                                {post.title}
                                            </h3>
                                            {post.published ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-none h-5 text-[10px] uppercase">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 h-5 text-[10px] uppercase">Draft</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span>/{post.slug}</span>
                                            <span>•</span>
                                            <span>Updated {format(new Date(post.updated_at), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-black border-zinc-800 text-white">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-zinc-800" />
                                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-[#ff007f] cursor-pointer">
                                                Edit Article
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                                                {post.published ? (
                                                    <span className="flex items-center"><EyeOff className="mr-2 h-3 w-3" /> Unpublish</span>
                                                ) : (
                                                    <span className="flex items-center"><Globe className="mr-2 h-3 w-3" /> Publish</span>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
