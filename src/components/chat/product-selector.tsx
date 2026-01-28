'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, Loader2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ProductSelectorProps {
    onSelect: (product: any) => void
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const searchProducts = async () => {
            if (!query.trim()) {
                setProducts([])
                return
            }

            setLoading(true)
            const { data } = await supabase
                .from('products')
                .select('id, name, price, images, slug, stores(slug)')
                .ilike('name', `%${query}%`)
                .limit(5)

            if (data) {
                const formatted = data.map((p: any) => {
                    const storeData = Array.isArray(p.stores) ? p.stores[0] : p.stores
                    return {
                        ...p,
                        store_slug: storeData?.slug || 'general'
                    }
                })
                setProducts(formatted)
            }
            setLoading(false)
        }

        const timeoutId = setTimeout(searchProducts, 300)
        return () => clearTimeout(timeoutId)
    }, [query, supabase])

    return (
        <div className="p-2 w-72 bg-zinc-900 border border-white/10 rounded-lg shadow-xl mb-2">
            <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                    placeholder="Search catalog..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8 h-9 text-xs bg-zinc-950 border-white/10"
                    autoFocus
                />
            </div>

            <ScrollArea className="h-48">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="space-y-1">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => onSelect(product)}
                                className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded text-left group transition-colors"
                            >
                                <div className="h-8 w-8 bg-zinc-800 rounded overflow-hidden relative shrink-0">
                                    {product.images && product.images[0] && (
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-zinc-200 truncate">{product.name}</div>
                                    <div className="text-[10px] text-zinc-500">${product.price}</div>
                                </div>
                                <Plus className="h-3 w-3 text-zinc-500 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                ) : query && (
                    <div className="text-center py-4 text-xs text-zinc-600">
                        No products found.
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
