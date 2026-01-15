'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function BuyerFeed() {
    const supabase = createClient()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeed = async () => {
            // Fetch random featured products (limit 8)
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    store:stores(name, slug)
                `)
                .limit(8)
                .order('created_at', { ascending: false }) // simple 'latest' feed for now

            if (data) setProducts(data)
            setLoading(false)
        }
        fetchFeed()
    }, [])

    if (loading) return <div className="text-zinc-500 text-sm">Loading recommendations...</div>

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-white">Recommended for You</h3>
                <Link href="/" className="text-sm text-pink-500 hover:text-pink-400 font-medium">
                    View All Categories
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="group bg-zinc-900/50 border-zinc-800 overflow-hidden hover:border-pink-500/50 transition-all duration-300">
                        <div className="relative aspect-square">
                            {product.images?.[0] ? (
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                                    No Image
                                </div>
                            )}
                            
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button size="icon" variant="secondary" className="rounded-full bg-white text-black hover:bg-zinc-200">
                                    <ShoppingCart className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Store Badge */}
                            <div className="absolute top-3 left-3">
                                <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-xs font-normal border-white/10 text-white">
                                    {product.store?.name}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <Link href={`/shops/${product.store?.slug}/product/${product.slug}`} className="block group-hover:text-pink-500 transition-colors">
                                <h4 className="font-medium text-white line-clamp-1 mb-1">{product.name}</h4>
                            </Link>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400 text-sm font-light">${product.price}</span>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>4.8</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
