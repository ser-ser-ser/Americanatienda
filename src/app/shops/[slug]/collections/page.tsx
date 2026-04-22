import { createClient } from '@/utils/supabase/client'
import { MinimalProductCard } from '@/components/storefront/MinimalProductCard'
import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreFooter } from '@/components/storefront/StoreFooter'

// Dynamic params for store slug
export default async function StoreCollectionsPage({ params }: { params: { slug: string } }) {
    const supabase = createClient()

    // 1. Get Store
    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!store) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Store not found</div>
    }

    // 2. Get Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })

    const themeColor = store.theme_color || '#000000'

    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <StoreHeader store={store} themeColor={themeColor} />

            <div className="pt-32 pb-24 container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">All Collections</h1>
                    <p className="text-zinc-500 max-w-xl mx-auto text-lg font-light">
                        Explore the full range of {store.name}.
                    </p>
                </div>

                {!products || products.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                        <p className="text-zinc-400">No products available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product: any) => (
                            <div key={product.id} className="h-full">
                                <MinimalProductCard
                                    product={product}
                                    store={store}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <StoreFooter store={store} themeColor={themeColor} />
        </div>
    )
}
