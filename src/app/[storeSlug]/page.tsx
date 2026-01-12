import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    try {
        const storesRes = await fetch(`${supabaseUrl}/rest/v1/stores?select=slug`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        })
        const stores = await storesRes.json()
        return Array.isArray(stores) ? stores.map((s: any) => ({ storeSlug: s.slug })) : []
    } catch (e) {
        return []
    }
}

export const dynamic = 'force-static'


export default async function StorePage({ params }: { params: { storeSlug: string } }) {
    const { storeSlug } = await params
    const supabase = await createClient()

    // Fetch Store
    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', storeSlug)
        .single()

    if (!store) {
        notFound()
    }

    // Fetch Categories
    const { data: categories } = await supabase
        .from('store_categories')
        .select('*')
        .eq('store_id', store.id)

    return (
        <div className="min-h-screen bg-background">
            {/* Store Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Link href="/" className="text-zinc-400 hover:text-white mb-4 block text-sm">&larr; Back to Marketplace</Link>
                    <h1 className="text-4xl font-bold text-white mb-2">{store.name}</h1>
                    <p className="text-zinc-400 max-w-xl">{store.description}</p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories?.map((category) => (
                        <Link key={category.id} href={`/${storeSlug}/${category.slug}`}>
                            <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border-dashed border-2 bg-transparent">
                                <CardHeader>
                                    <CardTitle>{category.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="w-full justify-start pl-0 hover:pl-2 transition-all">
                                        View Products &rarr;
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    )
}
