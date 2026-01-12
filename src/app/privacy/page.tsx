'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Footer } from '@/components/footer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
    const supabase = createClient()
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPolicy = async () => {
            const { data } = await supabase
                .from('site_content')
                .select('value')
                .eq('key', 'privacy_policy_text')
                .single()

            if (data) setText(data.value)
            setLoading(false)
        }
        fetchPolicy()
    }, [supabase])

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" /> Back to Home
                    </Link>
                    <span className="text-xl font-serif font-bold tracking-tighter">AMERICANA</span>
                    <div className="w-24" />
                </div>
            </header>

            <main className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-serif font-black mb-12">Privacy Policy</h1>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-lg max-w-none text-zinc-300 whitespace-pre-wrap font-sans">
                        {text || 'No privacy policy defined yet.'}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
