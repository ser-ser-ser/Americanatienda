'use client'

import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingBag, Menu, ArrowLeft, Search, Instagram, MessageCircle, Palette, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/ProductCard'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useChat } from '@/providers/chat-provider'
import { NotificationBell } from '@/components/ui/notification-bell'
import { User as UserIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from '@/context/cart-context'
import { MinimalTheme } from '@/components/templates/MinimalTheme'
import { DarkSocialTheme } from '@/components/templates/DarkSocialTheme'

export default function StorefrontClient() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const { cartCount, toggleCart } = useCart()
    const [loading, setLoading] = useState(true)
    const [activeStore, setStore] = useState<any>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [user, setUser] = useState<any>(null)
    const [activeTemplate, setActiveTemplate] = useState<any>(null)
    const { startInquiryChat } = useChat()
    const isMounted = useRef(true)

    // Check for Preview Mode & Builder Mode
    const previewTemplateKey = searchParams.get('preview_template')
    const isBuilderMode = searchParams.get('mode') === 'builder'

    // Mock Data for Builder Mode
    const { MOCK_PRODUCTS } = require('@/lib/mock-data')


    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params.slug as string

            // Get Store
            const { data: storeData, error } = await supabase
                .from('stores')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error || !storeData) {
                console.error('Store not found', error)
                if (isMounted.current) setLoading(false)
                return
            }

            if (isMounted.current) {
                setStore(storeData)
            }

            // Fetch Template Logic
            // 1. Preview/Builder Mode (Query Param)
            if (previewTemplateKey) {
                // If previewing by component_key (e.g. 'minimal'), structure a fake template object
                // OR fetch by ID if UUID. Ideally fetch by ID or Key.

                // Try fetching by ID first
                const { data: previewData } = await supabase
                    .from('store_templates')
                    .select('*')
                    .eq('id', previewTemplateKey)
                    .single()

                if (isMounted.current && previewData) {
                    setActiveTemplate(previewData)
                } else if (isMounted.current) {
                    // Fallback: If previewKey is just 'minimal' (not uuid), mock it
                    setActiveTemplate({ config: { component_key: previewTemplateKey } })
                }

            }
            // 2. Saved Template (DB)
            else if (storeData.template_id) {
                const { data: templateData } = await supabase
                    .from('store_templates')
                    .select('*')
                    .eq('id', storeData.template_id)
                    .single()

                if (isMounted.current && templateData) {
                    setActiveTemplate(templateData)
                }
            }

            // Get Categories
            const { data: cats } = await supabase
                .from('store_categories')
                .select('*')
                .eq('store_id', storeData.id)
            if (isMounted.current) setCategories(cats || [])

            // Get Products (Mock or Real)
            const isMinimalPreview = previewTemplateKey === 'minimal' || activeTemplate?.config?.component_key === 'minimal'
            // If in Builder Mode OR specifically previewing Minimal Theme (Maqueta Mode)
            const shouldShowMocks = isBuilderMode || (isMinimalPreview && previewTemplateKey)

            if (shouldShowMocks || isMounted.current) {
                if (shouldShowMocks) {
                    setProducts(MOCK_PRODUCTS)
                } else {
                    const { data: prods } = await supabase
                        .from('products')
                        .select('*')
                        .eq('store_id', storeData.id)
                        .eq('is_active', true)
                        .order('created_at', { ascending: false })

                    if (isMounted.current) {
                        if (prods && prods.length > 0) {
                            setProducts(prods)
                        } else {
                            // Fallback to MOCK data if no products found (so user sees something)
                            setProducts(MOCK_PRODUCTS)
                        }
                    }
                }
            }

            // Get Current User
            const { data: { user } } = await supabase.auth.getUser()
            if (isMounted.current) setUser(user)

            if (isMounted.current) setLoading(false)

            // FIXME: Enforcing Mock Products for Demo/Dev purposes as per user request
            // setProducts(MOCK_PRODUCTS);
        }

        fetchStore()
    }, [params.slug, supabase, previewTemplateKey, isBuilderMode])


    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (!activeStore) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
                <h1 className="text-4xl font-serif">Store Not Found</h1>
                <Link href="/">
                    <Button variant="outline" className="border-white/20 text-white">Return Home</Button>
                </Link>
            </div>
        )
    }

    // --- 3. HELPER: Handle Publish Template ---
    const handlePublishTemplate = async () => {
        if (!activeStore || !previewTemplateKey) return
        setLoading(true)

        // Update DB
        const { error } = await supabase
            .from('stores')
            .update({ template_id: previewTemplateKey })
            .eq('id', activeStore.id)

        if (error) {
            console.error('Error publishing template:', error)
            alert('Error updating template. Check console.')
            setLoading(false)
        } else {
            // Success: Clean URL and reload as real store
            window.location.href = `/shops/${activeStore.slug}`
        }
    }

    // --- 4. RENDER TEMPLATE ---
    const renderTemplate = () => {
        // A) Minimal Theme
        if (activeTemplate?.config?.component_key === 'minimal') {
            return <MinimalTheme store={activeStore} products={products} />
        }

        // B) Dark Social / Default / Legacy
        // If key is 'dark_social' OR activeTemplate is null (Original/Fallback behavior)
        if (activeTemplate?.config?.component_key === 'dark_social' || !activeTemplate) {
            // Pass necessary props for the Legacy Theme
            return (
                <DarkSocialTheme
                    store={activeStore}
                    products={products}
                    categories={categories}
                    user={user}
                />
            )
        }

        // C) Future Components (Boutique, etc.) -> Fallback to Dark Social for now or Null
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <p>Template component not found: {activeTemplate?.config?.component_key}</p>
            </div>
        )
    }

    // --- 5. RENDER WRAPPER (With Builder Overlay) ---
    return (
        <div className="relative">
            {renderTemplate()}

            {/* Builder Mode Overlay (Global for ALL templates) */}
            {isBuilderMode && (
                // Placeholder to force read, I will use view_file first.
                // This call is just to fix the simple Tailwind error in the meantime while I debug the activeStore issue.
                // Correcting z-[100] to z-100 in StorefrontClient.
                <div className="fixed bottom-0 inset-x-0 z-100 bg-zinc-900 border-t border-zinc-800 p-4 shadow-2xl safe-area-bottom">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#f4256a] flex items-center justify-center text-white">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Template Preview Mode</h3>
                                <p className="text-zinc-400 text-xs">Viewing "{activeTemplate?.name || 'Original'}" with mock data.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="border-zinc-700 hover:bg-zinc-800 text-white"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#f4256a] hover:bg-[#d61e5a] text-white font-bold gap-2"
                                onClick={handlePublishTemplate}
                            >
                                <Check className="h-4 w-4" /> Publish Template
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
