'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function EditorialPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false })

            if (data) setPosts(data)
            setLoading(false)
        }

        fetchPosts()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Header / Hero */}
            <div className="relative border-b border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none opacity-50" />
                <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="mb-8">
                        <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider group">
                            <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 block">
                        The Journal
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter mb-8">
                        Editorial.
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Curated stories, industry insights, and cultural deep dives from the Americana universe.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                {posts.length === 0 ? (
                    <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/50">
                        <p className="text-zinc-500 italic">No stories published yet. Stay tuned.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/editorial/${post.slug}`} className="group block">
                                <article className="flex flex-col h-full">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-zinc-900 mb-6 border border-zinc-800 cursor-pointer">
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-800">
                                                <span className="font-serif text-4xl opacity-20">Aa.</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all rounded-sm" />
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4 uppercase tracking-wider font-medium">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(post.created_at), 'MMMM d, yyyy')}
                                        </div>

                                        <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-zinc-300 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-zinc-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {post.excerpt}
                                        </p>

                                        <div className="inline-flex items-center text-white text-sm font-bold tracking-wide group-hover:underline decoration-zinc-500 underline-offset-4">
                                            Read Story <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
