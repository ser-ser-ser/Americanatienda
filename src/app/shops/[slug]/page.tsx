import { createClient } from '@supabase/supabase-js'
import StorefrontClient from './StorefrontClient'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
    params: Promise<{ slug: string }>
}

// Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: store } = await supabase
        .from('stores')
        .select('name, description, logo_url, seo_title, seo_description, og_image_url, favicon_url, canonical_url')
        .eq('slug', slug)
        .single()

    if (!store) return { title: 'Store Not Found' }

    const title = store.seo_title || `${store.name} | Americana Boutique`
    const description = store.seo_description || store.description || `Explore exclusive drops at ${store.name}.`
    const ogImage = store.og_image_url || store.logo_url || '/opengraph-image.png'

    return {
        title,
        description,
        icons: store.favicon_url ? { icon: store.favicon_url } : undefined,
        alternates: store.canonical_url ? { canonical: store.canonical_url } : undefined,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: store.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    }
}

// Required for static export
export async function generateStaticParams() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: stores } = await supabase.from('stores').select('slug')
    return stores?.map(({ slug }) => ({ slug })) || []
}

export default function StorefrontPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <StorefrontClient />
        </Suspense>
    )
}
