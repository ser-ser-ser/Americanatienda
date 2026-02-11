'use client'

import React from 'react'
import { Product, Store } from '@/types'
import { MinimalProductCard } from '@/components/storefront/MinimalProductCard'

interface CollectionsGridProps {
    products: Product[]
    store: Store
    title?: string
    subtitle?: string
}

export function CollectionsGrid({ products, store, title, subtitle }: CollectionsGridProps) {
    return (
        <section className="py-12 px-4 md:px-8 bg-white min-h-[50vh]">
            <div className="max-w-7xl mx-auto">
                {(title || subtitle) && (
                    <div className="mb-10 text-center">
                        {title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-3">{title}</h2>}
                        {subtitle && <p className="text-zinc-500 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-xl">
                        <p className="text-zinc-400">No products found in this collection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product) => (
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
        </section>
    )
}
