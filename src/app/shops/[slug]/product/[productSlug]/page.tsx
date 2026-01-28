import { createClient } from '@/utils/supabase/server'
import ProductClient from './ProductClient'
import { SiteFooter } from '@/components/site-footer'

export async function generateStaticParams() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('slug, stores(slug)')

    if (!products) return []

    return products.map((product: any) => ({
        slug: product.stores?.slug || 'unknown',
        productSlug: product.slug,
    }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; productSlug: string }> }) {
    const { slug, productSlug } = await params
    return <ProductClient storeSlug={slug} productSlug={productSlug} footer={<SiteFooter />} />
}
