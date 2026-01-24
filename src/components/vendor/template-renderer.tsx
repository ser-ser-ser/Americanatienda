'use client'

import { Store } from '@/types'
import { ReactNode } from 'react'

type TemplateConfig = {
    theme: 'dark' | 'light'
    hero: {
        type: 'fullscreen-image' | 'split-screen' | 'centered-text'
        overlay?: string
        textPosition?: string
        imageShape?: string
    }
    productGrid: {
        columns: number
        spacing: 'tight' | 'normal' | 'wide'
        cardStyle: 'minimal' | 'shadow-heavy' | 'rounded'
        hoverEffect: 'subtle-scale' | 'neon-glow' | 'soft-lift'
    }
    colors: {
        primary: string
        secondary: string
        accent: string
        background: string
    }
    fonts: {
        heading: string
        body: string
    }
}

type TemplateRendererProps = {
    store: Store
    templateConfig: TemplateConfig
    children: ReactNode // Product grid or content
}

export function TemplateRenderer({ store, templateConfig, children }: TemplateRendererProps) {
    const { colors, fonts, hero, productGrid, theme } = templateConfig

    // Dynamic styles based on template
    const bgColor = colors.background
    const textColor = theme === 'dark' ? '#FFFFFF' : '#000000'
    const gridCols = productGrid.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
    const spacing = {
        tight: 'gap-4',
        normal: 'gap-6',
        wide: 'gap-8'
    }[productGrid.spacing]

    return (
        <div
            style={{
                backgroundColor: bgColor,
                color: textColor,
                fontFamily: fonts.body
            }}
            className="min-h-screen"
        >
            {/* Hero Section */}
            <section className={`relative ${hero.type === 'fullscreen-image' ? 'h-screen' : 'h-[60vh]'}`}>
                {hero.type === 'fullscreen-image' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                )}
                <div className="relative z-10 flex items-center justify-center h-full px-6">
                    <div className="text-center max-w-4xl">
                        <h1
                            style={{
                                fontFamily: fonts.heading,
                                color: colors.accent
                            }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            {store.name}
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            {store.description || 'Curated excellence for discerning tastes.'}
                        </p>
                        <button
                            style={{
                                backgroundColor: colors.accent,
                                color: theme === 'dark' ? '#000' : '#FFF'
                            }}
                            className="px-8 py-4 font-bold text-lg rounded-lg hover:opacity-90 transition"
                        >
                            Explore Collection
                        </button>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2
                    style={{
                        fontFamily: fonts.heading,
                        color: colors.primary
                    }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                >
                    Featured Products
                </h2>
                <div className={`grid grid-cols-1 ${gridCols} ${spacing}`}>
                    {children}
                </div>
            </section>
        </div>
    )
}
