/**
 * PageRenderer — renders a page layout JSON from the Site Studio builder.
 * Used in public store pages and the marketplace homepage.
 */

import React from 'react'
import { PageLayout, BuilderBlock } from '@/types/builder'
import { BlockRenderer } from '@/components/page-builder/block-renderer'

interface PageRendererProps {
    layout: PageLayout
    /** Products from DB for dynamic blocks like products-grid */
    products?: any[]
    /** Categories from DB */
    categories?: any[]
    /** Store data (for store-specific blocks) */
    store?: any
}

export function PageRenderer({ layout, products, categories, store }: PageRendererProps) {
    if (!layout?.blocks?.length) return null

    return (
        <div className="page-renderer bg-black min-h-screen">
            {layout.blocks.map((block) => (
                <EnrichedBlockRenderer
                    key={block.id}
                    block={block}
                    products={products}
                    categories={categories}
                    store={store}
                />
            ))}
        </div>
    )
}

/**
 * Enriched renderer — injects live data into dynamic blocks before rendering.
 */
function EnrichedBlockRenderer({
    block, products, categories, store
}: {
    block: BuilderBlock
    products?: any[]
    categories?: any[]
    store?: any
}) {
    // Inject live products into products-grid
    if (block.type === 'products-grid' && products) {
        const enriched: BuilderBlock = {
            ...block,
            props: { ...block.props, _liveProducts: products }
        }
        return <BlockRenderer block={enriched} isEditing={false} />
    }

    // Inject live categories into categories-grid
    if (block.type === 'categories-grid' && categories) {
        const enriched: BuilderBlock = {
            ...block,
            props: { ...block.props, _liveCategories: categories }
        }
        return <BlockRenderer block={enriched} isEditing={false} />
    }

    return <BlockRenderer block={block} isEditing={false} />
}

/**
 * Parses a page_layout JSON string safely.
 * Returns null if invalid.
 */
export function parsePageLayout(raw: string | object | null | undefined): PageLayout | null {
    if (!raw) return null
    try {
        if (typeof raw === 'string') return JSON.parse(raw) as PageLayout
        return raw as PageLayout
    } catch {
        return null
    }
}
