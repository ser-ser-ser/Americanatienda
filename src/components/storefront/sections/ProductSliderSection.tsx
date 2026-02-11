'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CreditCard, Truck, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Product, Store } from '@/types'
import { MinimalProductCard } from '@/components/storefront/MinimalProductCard'

interface ProductSliderSectionProps {
    products: Product[]
    store: Store
    title: string
    subtitle: string
}

export function ProductSliderSection({ products, store, title, subtitle }: ProductSliderSectionProps) {
    const swiperRef = useRef<any>(null)

    return (
        <div className="py-12 pl-6 bg-white/50">
            <div className="max-w-7xl mx-auto mb-6 pr-6 flex items-end justify-between">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-zinc-900">{title}</h3>
                    {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-100 px-2 py-1 rounded text-zinc-500">Auto-Play Enabled</span>
                </div>
            </div>

            <Swiper
                modules={[Autoplay, Navigation]}
                grabCursor={true}
                navigation={true}
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={false}
                loop={true}
                speed={800}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.5 },
                    1280: { slidesPerView: 4.2 },
                }}
                className="w-full overflow-visible!"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-full">
                        <MinimalProductCard product={product} store={store} aspectRatio="aspect-[3/4]" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

