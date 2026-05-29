import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // Use direct fetch or supabase-js to avoid cookie issues during build
    // Basic fetch is safer for static params

    try {
        const storesRes = await fetch(`${supabaseUrl}/rest/v1/stores?select=id,slug`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        })
        const stores: { id: string; slug: string }[] = await storesRes.json()

        const catsRes = await fetch(`${supabaseUrl}/rest/v1/store_categories?select=slug,store_id`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        })
        const categories: { store_id: string; slug: string }[] = await catsRes.json()

        if (!stores || !categories || !Array.isArray(stores) || !Array.isArray(categories)) return []

        const paths = []
        const storeMap = new Map(stores.map((s) => [s.id, s] as [string, typeof s]))

        for (const cat of categories) {
            const store = storeMap.get(cat.store_id)
            if (store) {
                paths.push({
                    storeSlug: store.slug,
                    categorySlug: cat.slug
                })
            }
        }
        return paths
    } catch (e) {
        console.error('Error generating static params', e)
        return []
    }
}

export const dynamic = 'force-static'

export default async function CategoryPage({ params }: { params: { storeSlug: string, categorySlug: string } }) {
    const { storeSlug, categorySlug } = await params
    const supabase = await createClient()

    // Fetch Store
    const { data: store } = await supabase
        .from('stores')
        .select('id, name, slug')
        .eq('slug', storeSlug)
        .single()

    if (!store) {
        notFound()
    }

    // Fetch Category
    const { data: category } = await supabase
        .from('store_categories')
        .select('id, name, slug')
        .eq('store_id', store.id)
        .eq('slug', categorySlug)
        .single()

    if (!category) {
        notFound()
    }

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .eq('store_category_id', category.id)
        .eq('is_active', true)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href={`/${store.slug}`} className="hover:text-white">{store.name}</Link>
                        <span>/</span>
                        <span className="text-white">{category.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto max-w-6xl px-4 py-12">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link key={product.id} href={`/${store.slug}/${category.slug}/${product.slug}`} className="group">
                                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors">
                                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden rounded-t-xl">
                                        {/* Placeholder for image */}
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-400">No Image</div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="font-bold text-xl">${product.price}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">View Details</Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        <p className="text-xl">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
