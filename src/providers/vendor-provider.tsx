'use client'

import { createClient } from '@/utils/supabase/client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Store {
    id: string
    name: string
    slug: string
    logo_url?: string
    status: string
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

    const refreshStores = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setStores(data)

            // Logic to persist selection or default to first
            // We can add localStorage persistence here later
            if (data.length > 0) {
                // If we already have an active store, check if it still exists
                if (activeStore) {
                    const stillExists = data.find(s => s.id === activeStore.id)
                    if (stillExists) {
                        setActiveStore(stillExists) // Update with fresh data
                    } else {
                        setActiveStore(data[0])
                    }
                } else {
                    setActiveStore(data[0])
                }
            } else {
                setActiveStore(null)
            }
        }
        setIsLoading(false)
    }

    // Initial Load
    useEffect(() => {
        refreshStores()
    }, [])

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
