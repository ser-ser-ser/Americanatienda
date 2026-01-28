import { createClient } from '@/utils/supabase/server'
import CollectionClient from '@/app/collections/[slug]/CollectionClient'
import { SiteFooter } from '@/components/site-footer'

export async function generateStaticParams() {
    const supabase = await createClient()
    const { data: categories } = await supabase.from('categories').select('slug')

    return (categories || []).map((category) => ({
        slug: category.slug,
    }))
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return <CollectionClient slug={slug} footer={<SiteFooter />} />
}
