import React from 'react'
import { Store, Product } from '@/types'
import { MinimalProductDetail } from '@/components/storefront/MinimalProductDetail'
import { DarkProductDetail } from '@/components/storefront/DarkProductDetail'

interface ProductClientProps {
    store: Store
    product: Product
}

export default function ProductClient({ store, product }: ProductClientProps) {
    // Determine Theme
    // Strategy: Check template_key (if available in future) or fallback to slug logic.
    // For now, if the slug is 'americanamarket' OR if it was explicitly the Dark Theme template.
    // Since 'store' object structure might vary, we assume:
    // If 'theme_color' is missing or slug is 'americanamarket' -> Dark Theme?
    // User requested "Default Americana" uses DarkSocialTheme.
    // Let's rely on a check. Typically the Default is Dark if NOT Minimal.

    // If I can't check the config easily here (because config might be in separate table or JSONB),
    // I can assume that 'Minimal' stores are the NEW ones.
    // But safely: Let's check the store slug for the main marketplace.
    // ALSO: If 'config' contains 'component_key: minimal', use Minimal.

    const config = store.config as any
    const isMinimal = config?.component_key === 'minimal' || store.slug !== 'americanamarket' // Assumption: Only Americana Market is Dark?
    // OR: If the user explicitly wants separation.

    // BETTER LOGIC: 
    // If store.slug === 'americanamarket' -> Dark
    // Else -> Minimal (for now, as user said "minimalmarket solo es un template para los usuarios")

    // Correction based on user feedback: "esté tema [...] darksocialtheme.tsx"

    // Normalize slug to handle potential dashes or casing issues (e.g. 'americana-market')
    const normalizedSlug = store.slug.replace(/-/g, '').toLowerCase()
    const isAmericana = normalizedSlug === 'americanamarket'

    const shouldUseDarkTheme = isAmericana || config?.component_key === 'dark_social'

    if (shouldUseDarkTheme) {
        return <DarkProductDetail store={store} product={product} />
    }

    return <MinimalProductDetail store={store} product={product} />
}
