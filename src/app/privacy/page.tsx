import { createClient } from '@/utils/supabase/server'
import { SiteFooter } from '@/components/site-footer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PrivacyPage() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'privacy_policy_text')
        .single()

    const text = data?.value

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

                <div className="prose prose-invert prose-lg max-w-none text-zinc-300 whitespace-pre-wrap font-sans">
                    {text || 'No privacy policy defined yet.'}
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
