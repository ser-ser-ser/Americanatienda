'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, ArrowLeft, Heart, Share2, Calendar, User, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown' // Ideally, or basic HTML render

export default function ArticlePage() {
    const params = useParams()
    const slug = params.slug
    const supabase = createClient()

    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return

            const { data, error } = await supabase
                .from('posts')
                .select('*, author:author_id(email)') // Basic author fetch
                .eq('slug', slug)
                .single() // Expects one

            if (data) setPost(data)
            setLoading(false)
        }

        fetchPost()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#ff007f] animate-spin" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-4">
                <h1 className="text-4xl font-bold font-display tracking-tighter">404</h1>
                <p className="text-zinc-500 uppercase tracking-widest text-xs">Signal Lost</p>
                <Link href="/">
                    <Button variant="outline" className="text-white border-zinc-800 hover:bg-zinc-900">Return Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <article className="bg-[#050505] text-zinc-200 min-h-screen font-sans selection:bg-[#ff007f] selection:text-white">

            {/* PROGRESS BAR (Simulated) */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
                <div className="h-full bg-gradient-to-r from-[#ff007f] to-purple-600 w-full animate-[progress_1s_ease-out_forwards]" style={{ width: '100%' }}></div>
            </div>

            {/* HERO SECTION - IMMERSIVE MEDIA */}
            <header className="relative w-full h-[60vh] md:h-[70vh] flex items-end">
                {/* Background Image/GIF */}
                <div className="absolute inset-0 z-0 select-none">
                    {post.cover_image ? (
                        <img src={post.cover_image} className="w-full h-full object-cover opacity-60" alt={post.title} />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-[#050505]"></div>
                    )}
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
                </div>

                {/* Navbar Placeholder - Or just Back Button */}
                <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                    <Link href="/">
                        <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer group">
                            <div className="size-8 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center group-hover:bg-[#ff007f] group-hover:border-[#ff007f] transition-all">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider hidden md:block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Back</span>
                        </div>
                    </Link>
                    {/* Brand */}
                    <div className="text-[#ff007f] font-bold text-xs tracking-[0.3em] uppercase mix-blend-screen">Americana</div>
                </div>

                {/* Title Container */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12 md:pb-20">

                    <div className="flex items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-[#ff007f]">
                        <span className="bg-[#ff007f]/10 px-2 py-1 rounded border border-[#ff007f]/20">The Club</span>
                        <span className="text-zinc-400 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200) || 1} min read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10"></div>
                            <div>
                                <p className="text-sm font-bold text-white">Editorial Team</p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{format(new Date(post.created_at), 'MMMM dd, yyyy')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT BODY */}
            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20">
                {/* Excerpt */}
                {post.excerpt && (
                    <div className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed mb-12 border-l-2 border-[#ff007f] pl-6 italic">
                        {post.excerpt}
                    </div>
                )}

                {/* Main Text */}
                <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-p:text-zinc-300 prose-p:font-light prose-p:leading-8 prose-a:text-[#ff007f] prose-img:rounded-xl prose-img:border prose-img:border-white/10">
                    {/* We can render Markdown here, but for now simple whitespace preserve */}
                    <div className="whitespace-pre-wrap font-serif text-lg leading-loose text-zinc-300">
                        {post.content}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 hover:bg-white/5 hover:text-[#ff007f] hover:border-[#ff007f]/50 transition-all gap-2 group">
                            <Heart className="w-4 h-4 group-hover:fill-[#ff007f] transition-colors" />
                            <span>Like</span>
                        </Button>
                        <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-400/50 transition-all gap-2">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </Button>
                    </div>
                    <div className="text-xs text-zinc-600 font-mono">
                        ID: {post.slug}
                    </div>
                </div>

            </main>

        </article>
    )
}
