'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, ShoppingCart, Shield, Zap, Wind, Share2, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { toast } from 'sonner'
import { useCart } from '@/context/cart-context'
import { useChat } from '@/providers/chat-provider'
import { NotificationBell } from '@/components/ui/notification-bell'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductClientProps {
    storeSlug: string
    productSlug: string
}

export default function ProductClient({ storeSlug, productSlug }: ProductClientProps) {
    const router = useRouter()
    const supabase = createClient()
    const { addItem, toggleCart } = useCart()
    const { startInquiryChat } = useChat()

    const [loading, setLoading] = useState(true)
    const [store, setStore] = useState<any>(null)
    const [product, setProduct] = useState<any>(null)
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get Store
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('slug', storeSlug)
                .single()

            if (storeError || !storeData) {
                console.error('Store not found')
                setLoading(false)
                return
            }
            setStore(storeData)

            // 2. Get Product
            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeData.id)
                .eq('slug', productSlug)
                .single()

            if (prodError || !prodData) {
                console.error('Product not found')
                setLoading(false)
                return
            }

            setProduct(prodData)
            if (prodData.images && prodData.images.length > 0) {
                setSelectedImage(prodData.images[0])
            }
            setLoading(false)
        }


        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setUser(data || user)
            }
        }

        fetchData()
        fetchUser()
    }, [storeSlug, productSlug, supabase])

    const handleAddToCart = () => {
        if (!product) return

        // Ensure product matches Product type expected by context
        // Context expects 'Product' type from @/types
        // We might need to cast or map it if the DB response is raw
        addItem(product)
        toast.success('Added to cart')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (!product || !store) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
                <h1 className="text-4xl font-serif">Product Not Found</h1>
                <Link href={`/shops/${storeSlug}`}>
                    <Button variant="outline" className="border-white/20 text-white">Back to Store</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={`/shops/${storeSlug}`} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back to {store.name}</span>
                    </Link>
                    <Link href={`/shops/${storeSlug}`} className="text-xl font-serif font-bold tracking-tight">
                        {store.name}
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/cart">
                            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 relative">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </Link>
                        <NotificationBell />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt="User" fill className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                                {user.email?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-white" align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/dashboard/orders')}>
                                        Orders
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-400" onClick={() => supabase.auth.signOut().then(() => router.refresh())}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" onClick={() => router.push('/login')} className="text-white hover:bg-white/10">
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Images */}
                    <div className="space-y-4">
                        <div className="aspect-square relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                    <ShoppingCart className="h-20 w-20 opacity-20" />
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === img ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col">
                        <div className="mb-2 text-primary font-bold tracking-wider text-sm uppercase">
                            {store.name} Collection
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-light text-white mb-8">
                            ${Number(product.price).toFixed(2)}
                        </p>

                        <div className="prose prose-invert max-w-none text-zinc-400 mb-8 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-auto">
                            <Button size="lg" className="flex-1 h-14 text-lg bg-white text-black hover:bg-zinc-200" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 w-14 p-0 border-zinc-700 hover:bg-zinc-800">
                                <Heart className="h-6 w-6 text-white" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 w-14 p-0 border-zinc-700 hover:bg-zinc-800">
                                <Share2 className="h-6 w-6 text-white" />
                            </Button>
                        </div>

                        <div className="mt-4">
                            <Button
                                variant="ghost"
                                className="w-full h-12 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/5"
                                onClick={() => startInquiryChat(store.id, product)}
                            >
                                <MessageCircle className="mr-2 h-4 w-4" /> Preguntar al vendedor
                            </Button>
                        </div>

                        {/* Additional Info / Specs could go here */}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
