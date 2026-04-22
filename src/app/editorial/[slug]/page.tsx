'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Calendar, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

export default function BlogPostPage() {
    const params = useParams()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchPost = async () => {
            if (!params.slug) return

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', params.slug)
                .single()

            if (error || !data) {
                // If not found, maybe redirect or show error?
                console.error('Post not found', error)
            } else {
                setPost(data)
            }
            setLoading(false)
        }

        fetchPost()
    }, [params.slug])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
                <p className="text-zinc-500 mb-8">This article doesn't exist.</p>
                <Link href="/editorial">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                        Back to Editorial
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <article className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-24">
            {/* Minimal Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 h-16 flex items-center justify-between">
                <Link href="/editorial" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" /> Back to Journal
                </Link>
                <div className="font-serif font-bold tracking-tight text-lg hidden sm:block">Americana Editorial</div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Hero Image */}
            {post.image_url && (
                <div className="w-full h-[50vh] md:h-[70vh] relative">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
            )}

            {/* Content Container */}
            <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.created_at), 'MMMM d, yyyy')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-white drop-shadow-xl border-white/5">
                        {post.title}
                    </h1>
                </div>

                <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-zinc-300 leading-relaxed font-serif">
                    {/* 
                       DANGER: We are rendering raw HTML/Markdown here. 
                       In a real app, use a proper Markdown renderer like `react-markdown`.
                       For this monolithic MVP, assuming 'content' is plain text or basic strings is safer, 
                       or simply rendering it as text if it's not HTML. 
                       If it IS HTML, use dangerouslySetInnerHTML only if trusted.
                   */}
                    {/* Simple Paragraph Rendering for now */}
                    {post.content ? post.content.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="mb-6">{paragraph}</p>
                    )) : (
                        <p className="italic text-zinc-500">No content.</p>
                    )}
                </div>

                {/* Author / Footer */}
                <div className="mt-20 pt-10 border-t border-zinc-900 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center font-serif font-bold text-xl mb-4 border border-zinc-700">
                        A.
                    </div>
                    <p className="text-zinc-500 text-sm italic">
                        Published by Americana Editorial Team
                    </p>
                </div>
            </div>
        </article>
    )
}
