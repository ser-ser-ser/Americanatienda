'use client'

import { createClient } from '@/utils/supabase/client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Store {
    id: string
    name: string
    slug: string
    logo_url?: string
    status: string
    stripe_account_id?: string
    cover_image_url?: string
    cover_video_url?: string
    [key: string]: any
}

interface VendorContextType {
    stores: Store[]
    activeStore: Store | null
    isLoading: boolean
    selectStore: (storeId: string) => void
    refreshStores: () => Promise<void>
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const router = useRouter()

    const [stores, setStores] = useState<Store[]>([])
    const [activeStore, setActiveStore] = useState<Store | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshStores = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Fetch Owned Stores
        const { data: ownedStores, error: ownedError } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)

        // 2. Fetch Member Stores
        const { data: memberStoresData, error: memberError } = await supabase
            .from('store_members')
            .select('store:stores(*)')
            .eq('user_id', user.id)

        const memberStores = memberStoresData?.map((m: any) => m.store) || []

        // Combine and dedup
        const allStores = [...(ownedStores || []), ...memberStores].filter((s, index, self) =>
            index === self.findIndex((t) => t.id === s.id)
        )

        // Sort by created_at
        const data = allStores.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        const error = ownedError || memberError

        if (data) {
            setStores(data)

            // Auto Select Logic
            setActiveStore(prev => {
                if (data.length > 0) {
                    if (prev) {
                        const stillExists = data.find((s: Store) => s.id === prev.id)
                        return stillExists || data[0]
                    }
                    return data[0]
                }
                return null
            })
        }
        if (error) console.error("Error loading stores:", error)
        setIsLoading(false)
    }, []) // Dependencies empty to prevent loops, supabase client is stable enough

    // Initial Load
    useEffect(() => {
        refreshStores()
    }, [refreshStores])

    const selectStore = (storeId: string) => {
        const store = stores.find(s => s.id === storeId)
        if (store) {
            setActiveStore(store)
        }
    }

    return (
        <VendorContext.Provider value={{ stores, activeStore, isLoading, selectStore, refreshStores }}>
            {children}
        </VendorContext.Provider>
    )
}

export function useVendor() {
    const context = useContext(VendorContext)
    if (context === undefined) {
        throw new Error('useVendor must be used within a VendorProvider')
    }
    return context
}
