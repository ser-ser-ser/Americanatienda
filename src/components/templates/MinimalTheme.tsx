'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreFooter } from '@/components/storefront/StoreFooter'
import { HeroSection } from '@/components/storefront/sections/HeroSection'
import { ProductSliderSection } from '@/components/storefront/sections/ProductSliderSection'
import { VideoSection } from '@/components/storefront/sections/VideoSection'
import { Store } from '@/types'


interface MinimalThemeProps {
    store: Store
    products: Product[]
}

export function MinimalTheme({ store, products }: MinimalThemeProps) {
    const themeColor = store.theme_color || store.config?.colors?.primary || '#000000'

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans pb-20 selection:bg-black selection:text-white">
            {/* Inyectamos el color del tema dinámicamente en la selección de texto */}
            <style jsx global>{`
                ::selection {
                    background-color: ${themeColor};
                    color: white;
                }
            `}</style>

            <StoreHeader store={store} themeColor={themeColor} />

            {/* --- 2. Hero Section --- */}
            <HeroSection
                data={{
                    title: store.name,
                    subtitle: store.description || "Curated essentials for the modern lifestyle.",
                    image_url: store.config?.cover_image,
                    button_text: "Explorar Colección"
                }}
                themeColor={themeColor}
            />

            {/* --- 2.5 Video Section --- */}
            <VideoSection videoUrl={store.config?.promo_video || '/multimedia/americanatienda.mp4?v=2'} />

            {/* Featured Slider (Trending) */}
            <ProductSliderSection
                products={products.slice(0, 10)}
                store={store}
                title="Trending Now"
                subtitle="Hover to explore latest drops"
            />

            {/* --- 3. Visita Nuestra Tienda (Horizontal) --- */}
            <section id="featured" className="border-t border-zinc-100 py-16 bg-zinc-50/30">
                <div className="max-w-7xl mx-auto">
                    {/* Using the same Slider but for 'Visita Nuestra Tienda' as requested */}
                    <ProductSliderSection
                        products={products.slice(0, 8)}
                        store={store}
                        title="Visita Nuestra Tienda"
                        subtitle=""
                    />

                    <div className="mt-12 text-center">
                        <Link href={`/shops/${store.slug}/collections`}>
                            <Button className="rounded-full px-8 py-6 text-lg border-2 border-transparent bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300">
                                Todos nuestros productos <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- About Section (Simple Text) --- */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-serif font-bold mb-6">Quiénes Somos</h3>
                    <p className="text-xl text-zinc-600 leading-relaxed">
                        {store.description || "Somos una marca comprometida con la calidad y el estilo. Nuestra misión es traerte los mejores productos con una experiencia de compra inigualable."}
                    </p>
                </div>
            </section>

            <StoreFooter store={store} themeColor={themeColor} />

        </div>
    )
}