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

    // Placeholder for storeTheme, assuming it would be fetched or derived
    // For the purpose of this edit, we'll define a dummy storeTheme to make the syntax valid.
    // In a real application, this would come from your data fetching.
    const storeTheme = { gradient: 'from-blue-500 to-purple-600' }; // Example gradient

    return (
        <div className="min-h-screen bg-background">
            {/* Background Gradient */}
            <div className={`fixed inset-0 bg-linear-to-br ${storeTheme.gradient} opacity-5 z-0 pointer-events-none`} />

            {/* Store Header */}
            {/* Store Header with Dynamic Cover */}
            <div className="relative w-full h-[40vh] min-h-[300px] bg-zinc-900 overflow-hidden group">
                {store.cover_image_url ? (
                    <img
                        src={store.cover_image_url}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={store.name}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
                    <div className="container mx-auto max-w-6xl flex items-end gap-6">
                        {/* Logo */}
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-black border-4 border-background overflow-hidden shadow-2xl shrink-0 relative z-10">
                            {store.logo_url ? (
                                <img src={store.logo_url} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900 font-bold">LOGO</div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="mb-2 relative z-10 shadow-sm">
                            <Link href="/" className="text-white/80 hover:text-white mb-2 block text-xs font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10 hover:bg-black/70 transition-colors">&larr; Marketplace</Link>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{store.name}</h1>
                            <p className="text-zinc-200 max-w-xl text-sm md:text-base font-medium drop-shadow-md bg-black/30 p-2 rounded-lg backdrop-blur-sm border border-white/5 inline-block">
                                {store.description}
                            </p>
                        </div>
                    </div>
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
