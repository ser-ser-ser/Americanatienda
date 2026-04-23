'use client'
import React from 'react'
import { BuilderBlock } from '@/types/builder'
import { useBuilderStore } from '@/stores/builder-store'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface BlockRendererProps {
    block: BuilderBlock
    isEditing?: boolean
}

// Entry point — routes to the correct block component
export function BlockRenderer({ block, isEditing = false }: BlockRendererProps) {
    const { theme } = useBuilderStore()
    const styles = computeBlockStyles(block)

    return (
        <div style={styles} className={isEditing ? 'relative' : ''}>
            <BlockSwitch block={block} isEditing={isEditing} />
        </div>
    )
}

function computeBlockStyles(block: BuilderBlock): React.CSSProperties {
    const s = block.styles || {}
    return {
        paddingTop: s.paddingTop ? `${s.paddingTop}px` : undefined,
        paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : undefined,
        paddingLeft: s.paddingLeft ? `${s.paddingLeft}px` : undefined,
        paddingRight: s.paddingRight ? `${s.paddingRight}px` : undefined,
        backgroundColor: s.backgroundColor || undefined,
        borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
        minHeight: s.minHeight ? `${s.minHeight}px` : undefined,
    }
}

function BlockSwitch({ block, isEditing }: { block: BuilderBlock; isEditing: boolean }) {
    const p = block.props
    switch (block.type) {
        case 'hero': return <HeroBlock p={p} />
        case 'heading': return <HeadingBlock p={p} />
        case 'paragraph': return <ParagraphBlock p={p} />
        case 'button': return <ButtonBlock p={p} />
        case 'image': return <ImageBlock p={p} />
        case 'video': return <VideoBlock p={p} />
        case 'cta': return <CTABlock p={p} />
        case 'divider': return <DividerBlock p={p} />
        case 'testimonial': return <TestimonialBlock p={p} />
        case 'faq': return <FAQBlock p={p} />
        case 'pricing': return <PricingBlock p={p} />
        case 'products-grid': return <ProductsGridBlock p={p} />
        case 'categories-grid': return <CategoriesGridBlock p={p} />
        case 'carousel': return <CarouselBlock p={p} />
        case 'card-slider': return <CardSliderBlock p={p} />
        case 'columns': return <ColumnsBlock p={p} />
        case 'feature': return <FeatureBlock p={p} />
        case 'social-proof': return <SocialProofBlock p={p} />
        case 'quote': return <QuoteBlock p={p} />
        case 'avatar': return <AvatarBlock p={p} />
        default:
            return (
                <div className="p-8 text-center text-zinc-600 border border-dashed border-zinc-800 text-sm">
                    Bloque: <span className="font-mono text-zinc-500">{block.type}</span>
                </div>
            )
    }
}

// ══════════════════════════════════════════════════════════════
// HERO BLOCK
// ══════════════════════════════════════════════════════════════
function HeroBlock({ p }: any) {
    const minH = `${p.minHeight || 80}vh`
    const align = p.contentAlign || 'center'

    return (
        <div
            className="relative flex items-center overflow-hidden"
            style={{ minHeight: minH }}
        >
            {/* Background */}
            {p.backgroundType === 'video' && p.backgroundVideo && (
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src={p.backgroundVideo} />
            )}
            {p.backgroundType === 'image' && p.backgroundImage && (
                <img src={p.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {p.backgroundType === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(p.overlayOpacity || 50) / 100})` }} />

            {/* Content */}
            <div className={cn(
                'relative z-10 w-full max-w-5xl mx-auto px-8 py-24',
                align === 'center' && 'text-center mx-auto',
                align === 'left' && 'text-left',
                align === 'right' && 'text-right ml-auto',
            )}>
                {p.title && (
                    <h1 className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                        {p.title}
                    </h1>
                )}
                {p.subtitle && (
                    <p className="text-2xl md:text-3xl text-white/80 font-light italic mb-6">{p.subtitle}</p>
                )}
                {p.description && (
                    <p className="text-base md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">{p.description}</p>
                )}
                <div className={cn('flex gap-4', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
                    {p.ctaLabel && (
                        <Link href={p.ctaLink || '#'}>
                            <button className="bg-white text-black font-bold px-8 py-4 rounded-full text-base hover:bg-zinc-100 transition-all shadow-2xl">
                                {p.ctaLabel}
                            </button>
                        </Link>
                    )}
                    {p.ctaSecondaryLabel && (
                        <Link href={p.ctaSecondaryLink || '#'}>
                            <button className="border border-white/30 text-white font-bold px-8 py-4 rounded-full text-base hover:bg-white/10 transition-all">
                                {p.ctaSecondaryLabel}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// TEXT BLOCKS
// ══════════════════════════════════════════════════════════════
const SIZE_MAP: Record<string, string> = {
    sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
    '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl',
    '5xl': 'text-5xl', '6xl': 'text-6xl', '7xl': 'text-7xl', '8xl': 'text-8xl'
}

function HeadingBlock({ p }: any) {
    const Tag = (p.level || 'h2') as any
    return (
        <div className="px-6 py-4" style={{ textAlign: p.align }}>
            <Tag
                style={{ color: p.color, fontStyle: p.fontStyle }}
                className={cn('font-bold', SIZE_MAP[p.size] || 'text-3xl')}
            >
                {p.text || 'Tu Título'}
            </Tag>
        </div>
    )
}

function ParagraphBlock({ p }: any) {
    return (
        <div className="px-6 py-4" style={{ textAlign: p.align }}>
            <p style={{ color: p.color }} className={cn('leading-relaxed', SIZE_MAP[p.size] || 'text-base')}>
                {p.text || 'Tu texto aquí...'}
            </p>
        </div>
    )
}

function QuoteBlock({ p }: any) {
    return (
        <div className={cn('px-8 py-12', p.align === 'center' && 'text-center', p.align === 'right' && 'text-right')}>
            <blockquote className="text-xl md:text-2xl font-serif italic text-white leading-relaxed mb-4">
                {p.text}
            </blockquote>
            {p.author && <p className="text-zinc-400 text-sm font-bold">{p.author}</p>}
        </div>
    )
}

function ButtonBlock({ p }: any) {
    const variantClass = {
        primary: 'bg-[#ff007f] text-white hover:bg-[#d6006b]',
        secondary: 'bg-white text-black hover:bg-zinc-100',
        outline: 'border border-white text-white hover:bg-white hover:text-black',
        ghost: 'text-white hover:bg-white/10',
    }[p.variant || 'primary'] || ''

    const sizeClass = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' }[p.size || 'md'] || ''

    return (
        <div className={cn('px-6 py-4', p.align === 'center' && 'flex justify-center', p.align === 'right' && 'flex justify-end')}>
            <Link href={p.link || '#'} target={p.newTab ? '_blank' : undefined}>
                <button className={cn('font-bold rounded-full transition-all', variantClass, sizeClass)}>
                    {p.label || 'Botón'}
                </button>
            </Link>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MEDIA BLOCKS
// ══════════════════════════════════════════════════════════════
function ImageBlock({ p }: any) {
    if (!p.src) {
        return (
            <div className="bg-zinc-900 border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-sm py-16">
                📷 Agrega una URL de imagen en las propiedades
            </div>
        )
    }
    return (
        <div style={{ aspectRatio: p.aspectRatio || '16/9', borderRadius: `${p.borderRadius || 0}px`, overflow: 'hidden' }}>
            <img src={p.src} alt={p.alt || ''} className="w-full h-full" style={{ objectFit: p.fit || 'cover', objectPosition: p.position || 'center' }} />
        </div>
    )
}

function VideoBlock({ p }: any) {
    if (!p.src) {
        return (
            <div className="bg-zinc-900 border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-sm py-16">
                🎬 Agrega una URL de video en las propiedades
            </div>
        )
    }
    return (
        <div style={{ aspectRatio: p.aspectRatio || '16/9' }}>
            <video
                src={p.src}
                autoPlay={p.autoplay}
                muted={p.muted !== false}
                loop={p.loop}
                controls={p.controls}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
            />
        </div>
    )
}

function AvatarBlock({ p }: any) {
    return (
        <div className={cn('py-6 px-4', p.align === 'center' && 'flex flex-col items-center')}>
            <div style={{ width: p.size, height: p.size, borderRadius: '50%', overflow: 'hidden', background: '#333' }} className="mb-3">
                {p.src && <img src={p.src} alt={p.name} className="w-full h-full object-cover" />}
            </div>
            {p.name && <p className="font-bold text-white">{p.name}</p>}
            {p.role && <p className="text-zinc-400 text-sm">{p.role}</p>}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MARKETING BLOCKS
// ══════════════════════════════════════════════════════════════
function CTABlock({ p }: any) {
    return (
        <section className="py-24 px-6 text-center" style={{ backgroundColor: p.backgroundColor || '#18181b' }}>
            <div className="max-w-3xl mx-auto">
                {p.title && <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{p.title}</h2>}
                {p.description && <p className="text-zinc-400 text-lg mb-10 leading-relaxed">{p.description}</p>}
                {p.ctaLabel && (
                    <Link href={p.ctaLink || '#'}>
                        <button
                            className="font-bold px-10 py-5 rounded-full text-base text-black transition-all hover:opacity-90"
                            style={{ backgroundColor: p.accentColor || '#ff007f', color: 'white' }}
                        >
                            {p.ctaLabel}
                        </button>
                    </Link>
                )}
            </div>
        </section>
    )
}

function DividerBlock({ p }: any) {
    return (
        <div style={{ marginTop: `${p.marginY || 32}px`, marginBottom: `${p.marginY || 32}px`, padding: '0 24px' }}>
            <hr style={{ borderColor: p.color || '#333', borderWidth: p.thickness || 1, borderStyle: p.style || 'solid' }} />
        </div>
    )
}

function FeatureBlock({ p }: any) {
    return (
        <div className={cn('p-8', p.layout === 'horizontal' ? 'flex items-start gap-6' : 'text-center')}>
            {p.icon && (
                <div className={cn('mb-4 flex', p.layout !== 'horizontal' && 'justify-center')}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.iconColor || '#ff007f'}20` }}>
                        <span className="text-2xl">✦</span>
                    </div>
                </div>
            )}
            <div>
                {p.title && <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>}
                {p.description && <p className="text-zinc-400 text-sm leading-relaxed">{p.description}</p>}
            </div>
        </div>
    )
}

function TestimonialBlock({ p }: any) {
    return (
        <div className="p-10 text-center max-w-2xl mx-auto">
            {p.rating > 0 && (
                <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: p.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                </div>
            )}
            {p.quote && <blockquote className="text-xl md:text-2xl font-serif italic text-white leading-relaxed mb-6">{p.quote}</blockquote>}
            <div className="flex items-center justify-center gap-3">
                {p.avatar && <img src={p.avatar} alt={p.author} className="w-10 h-10 rounded-full object-cover" />}
                <div className="text-left">
                    {p.author && <p className="text-white font-bold text-sm">{p.author}</p>}
                    {p.role && <p className="text-zinc-500 text-xs">{p.role}</p>}
                </div>
            </div>
        </div>
    )
}

function FAQBlock({ p }: any) {
    const [open, setOpen] = React.useState<number | null>(null)
    return (
        <div className="py-16 px-6 max-w-3xl mx-auto">
            {p.title && <h2 className="text-3xl font-serif font-bold text-white mb-10 text-center">{p.title}</h2>}
            <div className="space-y-3">
                {p.items?.map((item: any, i: number) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between p-6 text-left font-bold text-white hover:text-[#ff007f] transition-colors"
                            onClick={() => setOpen(open === i ? null : i)}
                        >
                            {item.question}
                            <ChevronRight className={cn('w-4 h-4 transition-transform flex-shrink-0 ml-3', open === i && 'rotate-90')} />
                        </button>
                        {open === i && (
                            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function PricingBlock({ p }: any) {
    return (
        <div className="py-16 px-6">
            {p.title && <h2 className="text-3xl font-serif font-bold text-white mb-12 text-center">{p.title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {p.plans?.map((plan: any, i: number) => (
                    <div key={i} className={cn(
                        'rounded-2xl p-8 border',
                        plan.featured ? 'bg-[#ff007f]/5 border-[#ff007f]/30' : 'bg-zinc-900 border-white/5'
                    )}>
                        <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                        <div className="flex items-end gap-1 mb-6">
                            <span className="text-4xl font-black text-white">{plan.price}</span>
                            <span className="text-zinc-400 text-sm mb-1">/{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-8">
                            {plan.features?.map((f: string, j: number) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                                    <span className="text-[#ff007f]">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button className={cn(
                            'w-full py-3 rounded-full font-bold text-sm transition-all',
                            plan.featured ? 'bg-[#ff007f] text-white hover:bg-[#d6006b]' : 'border border-white/20 text-white hover:bg-white/10'
                        )}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SocialProofBlock({ p }: any) {
    return (
        <div className="py-12 px-6 text-center">
            {p.title && <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-8">{p.title}</p>}
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-40">
                {p.items?.map((item: any, i: number) => (
                    <div key={i} className="text-white font-black text-xl tracking-tighter">{item.name}</div>
                ))}
                {(!p.items || p.items.length === 0) && (
                    <div className="text-zinc-700 text-sm">Agrega marcas/logos en las propiedades</div>
                )}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// E-COMMERCE BLOCKS
// ══════════════════════════════════════════════════════════════
function ProductsGridBlock({ p }: any) {
    // Mock products for editor view — real implementation fetches from Supabase
    const mockProducts = Array.from({ length: Math.min(p.limit || 6, 6) }, (_, i) => ({
        id: i,
        name: `Producto ${i + 1}`,
        price: (Math.random() * 500 + 100).toFixed(0),
        image: '',
    }))

    const colClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[p.columns || 3] || 'grid-cols-3'

    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {(p.title || p.subtitle) && (
                    <div className="mb-10">
                        {p.subtitle && <span className="text-[#ff007f] text-xs font-bold uppercase tracking-widest">{p.subtitle}</span>}
                        {p.title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-1">{p.title}</h2>}
                    </div>
                )}
                <div className={cn('grid gap-6', colClass)}>
                    {mockProducts.map((product) => (
                        <div key={product.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 group hover:border-white/20 transition-all">
                            <div className="aspect-square bg-zinc-800 flex items-center justify-center text-zinc-700">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="p-4">
                                <p className="text-white font-bold text-sm">{product.name}</p>
                                {p.showPrice && <p className="text-[#ff007f] text-sm font-bold mt-1">${product.price} MXN</p>}
                                {p.showAddToCart && (
                                    <button className="mt-3 w-full py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-all">
                                        Agregar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CategoriesGridBlock({ p }: any) {
    const mockCats = ['Moda', 'Arte', 'Hogar', 'Música', 'Vintage', 'Wellness']
    const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6' }[p.columns || 3] || 'grid-cols-3'

    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {(p.title || p.subtitle) && (
                    <div className="mb-10">
                        {p.subtitle && <span className="text-[#ff007f] text-xs font-bold uppercase tracking-widest">{p.subtitle}</span>}
                        {p.title && <h2 className="text-3xl font-serif font-bold text-white mt-1">{p.title}</h2>}
                    </div>
                )}
                <div className={cn('grid gap-4', colClass)}>
                    {mockCats.slice(0, p.columns || 3).map((cat, i) => (
                        <div key={i} className="aspect-square bg-zinc-900 rounded-2xl border border-white/5 hover:border-white/20 flex items-end p-4 transition-all cursor-pointer group">
                            <span className="text-white font-bold text-sm group-hover:text-[#ff007f] transition-colors">{cat}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ══════════════════════════════════════════════════════════════
// EFFECTS — CAROUSEL & CARD SLIDER
// ══════════════════════════════════════════════════════════════
function CarouselBlock({ p }: any) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: p.loop ?? true,
        align: p.snapAlign || 'start',
        slidesToScroll: 1,
    }, p.autoplay ? [Autoplay({ delay: p.autoplayDelay || 3000 })] : [])

    const mockItems = Array.from({ length: 6 }, (_, i) => ({ id: i, label: `Slide ${i + 1}` }))

    return (
        <section className="py-12 px-6">
            {p.title && <h2 className="text-2xl font-serif font-bold text-white mb-6">{p.title}</h2>}
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {mockItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex-none bg-zinc-900 rounded-2xl border border-white/5"
                                style={{
                                    width: `calc(${100 / (p.slidesPerView || 3)}% - 16px)`,
                                    minWidth: 200,
                                }}
                            >
                                <div className="aspect-video flex items-center justify-center text-zinc-600 font-bold text-sm rounded-2xl">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {p.showArrows && (
                    <>
                        <button
                            onClick={() => emblaApi?.scrollPrev()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#ff007f] transition-all z-10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => emblaApi?.scrollNext()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#ff007f] transition-all z-10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}

function CardSliderBlock({ p }: any) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: (p.snapAlign as any) || 'center',
        containScroll: 'trimSnaps',
    })

    return (
        <section className="py-12 px-6">
            {p.title && <h2 className="text-2xl font-serif font-bold text-white mb-6">{p.title}</h2>}
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex" style={{ gap: `${p.gap || 24}px` }}>
                        {(p.cards || []).map((card: any, i: number) => (
                            <div
                                key={i}
                                className="flex-none bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all group"
                                style={{ width: `${p.cardWidth || 320}px` }}
                            >
                                {card.image ? (
                                    <img src={card.image} alt={card.title} className="w-full aspect-video object-cover" />
                                ) : (
                                    <div className="aspect-video bg-zinc-800 flex items-center justify-center text-zinc-600">🖼️</div>
                                )}
                                <div className="p-5">
                                    {card.title && <h3 className="text-white font-bold mb-1">{card.title}</h3>}
                                    {card.description && <p className="text-zinc-400 text-sm">{card.description}</p>}
                                    {card.link && <Link href={card.link} className="text-[#ff007f] text-xs font-bold mt-3 block hover:underline">Ver más →</Link>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {p.showArrows && p.cards?.length > 1 && (
                    <>
                        <button onClick={() => emblaApi?.scrollPrev()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#ff007f] transition-all z-10">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => emblaApi?.scrollNext()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#ff007f] transition-all z-10">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}

// ══════════════════════════════════════════════════════════════
// LAYOUT BLOCKS
// ══════════════════════════════════════════════════════════════
function ColumnsBlock({ p }: any) {
    const cols = p.columns || 2
    return (
        <div className="px-6 py-8">
            <div className={cn('grid gap-6')} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${p.gap || 24}px` }}>
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800 p-6 flex items-center justify-center text-zinc-600 text-sm min-h-[120px]">
                        Columna {i + 1}
                    </div>
                ))}
            </div>
        </div>
    )
}
