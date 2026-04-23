'use client'
import React, { useEffect, useCallback } from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import { BuilderToolbar } from '@/components/page-builder/builder-toolbar'
import { BuilderSidebar } from '@/components/page-builder/builder-sidebar'
import { BuilderCanvas } from '@/components/page-builder/builder-canvas'
import { BuilderProperties } from '@/components/page-builder/builder-properties'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { PageLayout, BLOCK_LIBRARY } from '@/types/builder'
import { Loader2 } from 'lucide-react'

const DEFAULT_LAYOUT: PageLayout = {
    version: 1,
    blocks: [
        {
            id: 'default-hero',
            type: 'hero',
            props: {
                ...BLOCK_LIBRARY.find(b => b.type === 'hero')!.defaultProps
            }
        },
        {
            id: 'default-categories',
            type: 'categories-grid',
            props: {
                ...BLOCK_LIBRARY.find(b => b.type === 'categories-grid')!.defaultProps
            }
        },
        {
            id: 'default-products',
            type: 'products-grid',
            props: {
                ...BLOCK_LIBRARY.find(b => b.type === 'products-grid')!.defaultProps
            }
        },
        {
            id: 'default-cta',
            type: 'cta',
            props: {
                ...BLOCK_LIBRARY.find(b => b.type === 'cta')!.defaultProps
            }
        },
    ]
}

export default function MarketplaceBuilderPage() {
    const supabase = createClient()
    const { loadLayout, getLayout, selectBlock } = useBuilderStore()
    const [loading, setLoading] = React.useState(true)

    // Load existing layout from Supabase
    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const { data } = await supabase
                    .from('site_content')
                    .select('value')
                    .eq('key', 'homepage_layout')
                    .single()

                if (data?.value) {
                    const layout = JSON.parse(data.value) as PageLayout
                    loadLayout(layout)
                } else {
                    loadLayout(DEFAULT_LAYOUT)
                }
            } catch {
                loadLayout(DEFAULT_LAYOUT)
            } finally {
                setLoading(false)
            }
        }
        fetchLayout()
    }, [])

    // Save layout to Supabase
    const handleSave = useCallback(async () => {
        const layout = getLayout()
        const value = JSON.stringify(layout)

        const { error } = await supabase
            .from('site_content')
            .upsert({ key: 'homepage_layout', value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

        if (error) throw new Error(error.message)
        toast.success('✅ Homepage publicada correctamente.')
    }, [getLayout])

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2" /> Cargando builder...
            </div>
        )
    }

    return (
        <div
            className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden"
            onClick={() => selectBlock(null)}
        >
            <BuilderToolbar
                title="Site Studio — Marketplace"
                backHref="/dashboard/admin/cms"
                onSave={handleSave}
                liveUrl="/"
            />

            <div className="flex flex-1 overflow-hidden">
                <BuilderSidebar />
                <BuilderCanvas />
                <BuilderProperties />
            </div>
        </div>
    )
}
