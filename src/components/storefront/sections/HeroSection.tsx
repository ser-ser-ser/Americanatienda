'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
    data: {
        title: string
        subtitle: string
        image_url?: string | null
        button_text: string
    }
    themeColor: string
    onButtonClick?: () => void
}

export function HeroSection({ data, themeColor, onButtonClick }: HeroSectionProps) {
    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick()
        } else {
            scrollToSection('featured')
        }
    }

    return (
        <section id="hero" className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            {/* Background: Image or Dynamic Gradient */}
            <div className="absolute inset-0 z-0">
                {data.image_url ? (
                    <Image
                        src={data.image_url}
                        alt="Cover"
                        fill
                        className="object-cover opacity-90"
                        priority
                    />
                ) : (
                    <div
                        className="w-full h-full opacity-10"
                        style={{
                            background: `radial-gradient(circle at center, ${themeColor}, transparent 70%)`
                        }}
                    />
                )}
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/60 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-3xl mx-auto mt-10 p-4">
                <h2
                    className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none"
                    style={{ color: data.image_url ? '#000' : themeColor }}
                >
                    {data.title.toUpperCase()}
                </h2>
                <p className="text-xl md:text-2xl text-zinc-600 font-medium leading-relaxed mb-8 max-w-lg mx-auto">
                    {data.subtitle}
                </p>
                <Button
                    size="lg"
                    className="rounded-full px-8 text-white shadow-xl hover:scale-105 transition-transform border-none"
                    style={{ backgroundColor: themeColor }}
                    onClick={handleClick}
                >
                    {data.button_text}
                </Button>
            </div>
        </section>
    )
}
