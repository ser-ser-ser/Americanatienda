'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

// Client component for displaying collection details
export default function CollectionClient({ slug }: { slug: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get Category
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', slug)
                .single()

            if (catError || !catData) {
                console.error('Category not found')
                setLoading(false)
                return
            }
            setCategory(catData)

            // 2. Get Products for this Category
            // We need to join with stores to get the store slug for the card link!
            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select(`
                    *,
                    stores:store_id (
                        slug,
                        name,
                        store_type
                    )
                `)
                .eq('category_id', catData.id)
                .order('created_at', { ascending: false })

            if (prodData) {
                // Map the joined data to what ProductCard expects
                // ProductCard expects 'product' object. 
                // AND 'storeSlug' passed separately.
                // Or we can modify ProductCard to read store_slug from product if present?
                // The current ProductCard takes `product` and `storeSlug`.
                // We'll map it in the render.
                setProducts(prodData)
            }
            setLoading(false)
        }
        fetchData()
    }, [slug, supabase])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Collection not found.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Header */}
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/categories" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" /> Back to Collections
                    </Link>
                    <span className="text-xl font-serif font-bold tracking-tighter uppercase">{category.name}</span>
                    <div className="w-24" />
                </div>
            </header>

            <main className="pt-32 pb-24 container mx-auto px-6">
                {/* Hero / Description */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{category.name}</h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Explore the finest items in the {category.name} collection.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            // We need to pass storeSlug. Since we joined it, it's in product.stores.slug
                            <ProductCard
                                key={product.id}
                                product={product}
                                storeSlug={product.stores?.slug || ''}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-zinc-500 italic">
                            No products found in this collection yet.
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
