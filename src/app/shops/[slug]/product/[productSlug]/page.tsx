import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
    params: Promise<{ slug: string; productSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, productSlug } = await params
    const supabase = await createClient()

    // Get Store
    const { data: store } = await supabase
        .from('stores')
        .select('id, name, seo_title_template, seo_description_template, favicon_url')
        .eq('slug', slug)
        .single()

    if (!store) return { title: 'Store Not Found' }

    // Get Product
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productSlug)
    let query = supabase.from('products').select('*').eq('store_id', store.id)
    if (isUUID) query = query.or(`slug.eq.${productSlug},id.eq.${productSlug}`)
    else query = query.eq('slug', productSlug)

    const { data: product } = await query.single()
    if (!product) return { title: 'Product Not Found' }

    // Apply Templates
    const parseTemplate = (tpl: string | null, fallback: string) => {
        if (!tpl) return fallback
        return tpl
            .replace(/\{\{product_name\}\}/g, product.name || '')
            .replace(/\{\{store_name\}\}/g, store.name || '')
    }

    const title = parseTemplate(store.seo_title_template, `${product.name} | ${store.name}`)
    const description = parseTemplate(store.seo_description_template, product.description || `Buy ${product.name} at ${store.name}.`)
    const image = product.images?.[0] || '/opengraph-image.png'

    return {
        title,
        description,
        icons: store.favicon_url ? { icon: store.favicon_url } : undefined,
        openGraph: {
            title,
            description,
            images: [{ url: image }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    }
}

// Generate static params for existing products to improve build performance
export async function generateStaticParams() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('slug, stores(slug)')
        .limit(50) // Limit to recent products for build speed

    if (!products) return []

    return products
        .filter((p: any) => p.stores?.slug && p.slug)
        .map((product: any) => ({
            slug: product.stores.slug,
            productSlug: product.slug,
        }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; productSlug: string }> }) {
    const { slug, productSlug } = await params
    const supabase = await createClient()

    // 1. Get Store
    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!store) return notFound()

    // 2. Get Product
    // 2. Get Product
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productSlug)

    let query = supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)

    if (isUUID) {
        query = query.or(`slug.eq.${productSlug},id.eq.${productSlug}`)
    } else {
        query = query.eq('slug', productSlug)
    }

    const { data: product } = await query.single()

    if (!product) return notFound()

    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ProductClient store={store} product={product} />
        </Suspense>
    )
}
