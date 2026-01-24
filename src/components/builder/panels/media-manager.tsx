"use client"

import React from 'react'
import {
    X,
    Search,
    LayoutGrid,
    ListFilter,
    Plus,
    Folder,
    Trash2,
    Store,
    Sparkles,
    PenTool,
    Play,
    CheckCircle2
} from 'lucide-react'
import Image from 'next/image'
import { useBuilderStore } from '@/components/builder/store'
import { cn } from '@/lib/utils'

export function MediaManager() {
    const { setActiveModal } = useBuilderStore()
    const [selectedItems, setSelectedItems] = React.useState<number[]>([])

    const toggleSelection = (index: number) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(i => i !== index))
        } else {
            setSelectedItems([...selectedItems, index])
        }
    }

    const mediaItems = [
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCawqL2Df3u3yAKkfzQVw0pnbB3Rm2v9OjTgs_TwEJpZNpEJwOBfhegBur5p2zzli1GScRiNhTTQGaEnHkPl830GxlaW2owfrgPvoM0r2BlAPRhdTFLW_o-2v4s787_e3r4iPr9_0rLeDlAQAIE16RPyPCs_ajcht3vl8D2o3J_QHy9TQYoK-iFCESb0RMK0Rne1EpZLHWmqlL7jaNF6kqJPiuBsde89kW4WvIychU3pg03bM6PiGJcxm4NdLFhmalzL2c_4aojab7I', title: 'EDITORIAL_01.JPG', meta: '2.4 MB • 2400 x 3000' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO5arsxLGvgk5pmnuSfj_gW77bLjIPUJO37ifetlAQHO6JneKRmUvVEc_7KFlOt8X2FpmcCtEle7SqR7CVerklr2KG0b-0qrgO7vOUcq2dfMTRM_3c03pn4NTYXrAmsQvYabfvSquoOPvkkpAmABw1uiB-P6Z8ebar-Sswr2LM_MLEzv3Ajgaw4AFkqVrWNnMuuWs6C-ioKZDPCalwvNPlA5ixdLN3C9oVTTXlF4eMyJXUDVojfRuS9udyRyptztjX-ktHlrbBu1i6', title: 'ARCH_STUDY.JPG', meta: '1.8 MB • 1800 x 2400' },
        { type: 'video', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByihCeNe5-lX2aBnSUxhyb_JP51VZThCHOtyFeFH_rZnCB9BgX1rHkFLJ1z4oqCpdyN3L82EUjJVwTLMsmIN8jc15o1oWeWiIVY06qeI_CDEas16RZGh-eVdrXFlIFts20jrFgKabP4pBCF062tCCNSVQXpmHXZefOA9YLZk7lnactpq4rUOBbtToqy5nDiYKUft2N6iHtvMrngjqyJYwYw_cSFdr3JkmKzLFojg02-CSE4S8XnQhVmD6UvGXMKnHVpaqiwKz4WhcF', title: 'STREET_LOOP.MP4', meta: '12.4 MB • 15s' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOhUabDhgK8fqZUdHTO0BO4NWFFi9_W9RBCgBIzfqAG5pzHjXkmoA01Iux8p_RE_kuQACZtoC9p1izowefdybKTZuitazUHbLcGDCMdf4zuHITvz7GAwy9j1Bowbxev_ahGtd7MSmne4Z0fDAk34VZdpgsvM7Lfw3q5z11JhN90rPH08nFg-HZE-wKrI2rciLmPfsErHbFW_SnJydaI3A18uSFEdsQUqh1a8CExx2TeJxlBK4f5FSnvzPFngd_Gvj6XN4bnkbanTqJ', title: 'FLUID_NOIR.JPG', meta: '3.1 MB • 3200 x 4000' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeB3zXxcJthKhLvfc1qd_IjnRBj_2IYbHLzz94sUaOJPAvjkXEghWhcFT0YcXXYvRT3YfhXcEjLDLcWiTH-Q5w_f12d7OqagCJqeN4q1llW4b0LURzkAJX3tsVa2FDMUhM_pvtN_4VVso2vqfpEXZDeSOShfj9YzoB37RJXCM6cWICY-ipUZJ2dncPJDThzVsbfeOz0HtWgLUxd6_Fwpm9KiRA5-9XDf4kDNBwSDl67SAeY1ji67xVG5dfpdYsQZ1nyEyN60-JPvkw', title: 'PORTRAIT_X.JPG', meta: '2.7 MB • 2800 x 3500' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgi6gm4IsHh-mURUS-HUzbkasmMW-F3LbSgO3Jh6dCNOddDckAWA-3B2fyh5Piuw1HwMEW0Qy0im02PdmJVMw8x76-oWwkFC4Jmq4cBxiB5aWjXUlHu9A6_GHnC07Njbz-WYbySCD8mv_5P4JLdqOBQQ64q8po9jnBBrBUNtOMzPBBs8vnV-d5AfnblwZgMQ1ggVUUa2AJiPq5hv0APvri5You-YypQnk-YYAPdnx_v126dWgPTreq-ckZpnNZ3J2k4aYMijTglLZ8', title: 'TEXTURE_DETAIL.JPG', meta: '1.5 MB • 2000 x 2500' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMez0owclFaFSWnA0jxmAjuUsswA4OTo7taKcp92jZMMktBVwx0QreKBbi4zyzfU6F6hbdz71Oe9T5lcqR2McgjMjhpHDZRW4WZji1ddJxSTD8XePMaF_OkQUFrHq34NoL1o0Sul1Vij-f9EcboWsN6ZC6x8hpD1ocTQuNDWqT09be6IxfJfQ78GY_bK7KekGIaTCrbwUfh3SJQbaz4z1zXh1lPuOpLQ6lzT9QEa9SR2tmbhEDJVZxKzJzxGqqtb9YEbCOkYGfmjz', title: 'GEOMETRY_09.JPG', meta: '2.1 MB • 2500 x 3200' },
        { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDroECLVftdjYa4Gnx1D3IxBlSx_Mgq7uLNdUYtG1X7w0pYQ_Aijc2IoTcWFLg62lN8Em9UYGk2NF9orUeGYG9b_PjWNyNSi-4MlXs9QAPnzLaJQH86hAg8ZsEwWi7UrUiqd6JyhSFhUZ7J5POe0ug7XrfYa-yfIJrjFbV5qPsDubnaG0IOLuRFoHumauuJkHcG8NQYktOKhOAMi93FlMvKdzCBnWuKtkYUg1bfrYJddjCi6eq-OdQdOOgzi7wSN5LDafL_5FwtC8LG', title: 'SHADOW_PLAY.JPG', meta: '1.2 MB • 1800 x 2400' },
    ]

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 lg:p-12 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-7xl h-[85vh] bg-white dark:bg-[#121212] shadow-2xl flex overflow-hidden border border-slate-200 dark:border-[#222] relative rounded-none">

                {/* Left Sidebar */}
                <aside className="w-64 border-r border-slate-200 dark:border-[#222] flex flex-col bg-slate-50 dark:bg-[#0A0A0A]/50">
                    <div className="p-6">
                        <button className="w-full bg-[#FF2EBD] hover:opacity-90 text-white font-display text-[10px] tracking-[0.2em] py-4 px-6 flex items-center justify-center gap-2 transition-all group shadow-lg shadow-[#FF2EBD]/20">
                            <Plus className="w-4 h-4" />
                            UPLOAD MEDIA
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                        <div className="mb-8">
                            <p className="text-[10px] font-display text-slate-400 dark:text-slate-600 tracking-widest px-2 mb-4">ADMINISTRAR</p>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors group text-slate-600 dark:text-slate-300">
                                <Folder className="w-4 h-4 text-slate-400 group-hover:text-[#FF2EBD]" />
                                <span>Site Files</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors group text-slate-600 dark:text-slate-300">
                                <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-[#FF2EBD]" />
                                <span>My Boards</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors group text-slate-600 dark:text-slate-300">
                                <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-[#FF2EBD]" />
                                <span>Trash</span>
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-[10px] font-display text-slate-400 dark:text-slate-600 tracking-widest px-2 mb-4">EXPLORE</p>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-slate-200 dark:bg-[#222] text-[#FF2EBD] border-l-2 border-[#FF2EBD]">
                                <Store className="w-4 h-4" />
                                <span>Marketplace</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors group text-slate-600 dark:text-slate-300">
                                <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#FF2EBD]" />
                                <span>Curated Stock</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-[#222] transition-colors group text-slate-600 dark:text-slate-300">
                                <PenTool className="w-4 h-4 text-slate-400 group-hover:text-[#FF2EBD]" />
                                <span>Illustrations</span>
                            </button>
                        </div>
                    </nav>

                    <div className="p-6 border-t border-slate-200 dark:border-[#222]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-slate-400">Storage</span>
                            <span className="text-[10px] text-slate-400">8.2 / 10 GB</span>
                        </div>
                        <div className="h-1 bg-slate-200 dark:bg-[#222] w-full">
                            <div className="h-full bg-[#FF2EBD]" style={{ width: '82%' }}></div>
                        </div>
                        <button className="mt-4 text-[10px] font-display tracking-widest text-[#FF2EBD] hover:underline uppercase">Upgrade Pro</button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#121212]">
                    <header className="h-20 border-b border-slate-200 dark:border-[#222] flex items-center justify-between px-8 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md z-10 sticky top-0">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                className="w-full bg-slate-100 dark:bg-[#222] border-none focus:ring-1 focus:ring-[#FF2EBD] text-sm py-2.5 pl-10 pr-4 placeholder:text-slate-500 transition-all text-slate-900 dark:text-white rounded-none"
                                placeholder="Search noir assets, fashion photography..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-400 hover:text-[#FF2EBD] transition-colors">
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-[#FF2EBD] transition-colors">
                                <ListFilter className="w-5 h-5" />
                            </button>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-[#222] mx-2"></div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-white transition-colors p-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                        {mediaItems.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => toggleSelection(i)}
                                className={cn(
                                    "group relative aspect-[4/5] bg-slate-100 dark:bg-[#222] overflow-hidden cursor-pointer border transition-all",
                                    selectedItems.includes(i) ? "border-[#FF2EBD] ring-2 ring-[#FF2EBD]/50" : "border-transparent hover:border-[#FF2EBD]"
                                )}
                            >
                                <Image
                                    alt={item.title}
                                    className="object-cover filter grayscale contrast-120 brightness-90 group-hover:filter-none transition-all duration-500"
                                    src={item.src}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {item.type === 'video' && (
                                    <div className="absolute top-2 right-2 bg-black/50 p-1">
                                        <Play className="text-white w-4 h-4" />
                                    </div>
                                )}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end transition-opacity duration-300",
                                    selectedItems.includes(i) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}>
                                    <p className="text-[10px] font-display tracking-widest text-white truncate">{item.title}</p>
                                    <p className="text-[8px] text-slate-400">{item.meta}</p>
                                </div>
                                {selectedItems.includes(i) && (
                                    <div className="absolute top-2 left-2 text-[#FF2EBD] bg-white rounded-full p-0.5 shadow-lg">
                                        <CheckCircle2 className="w-5 h-5 fill-current" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <footer className="h-20 border-t border-slate-200 dark:border-[#222] flex items-center justify-between px-8 bg-white dark:bg-[#121212] z-10 sticky bottom-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-display tracking-widest text-slate-400">SELECTED: </span>
                            <span className="text-[10px] font-display tracking-widest text-[#FF2EBD]">{selectedItems.length} ITEMS</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="px-6 py-2.5 text-[10px] font-display tracking-widest border border-slate-200 dark:border-[#222] hover:bg-slate-50 dark:hover:bg-[#222] transition-colors uppercase text-slate-500 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={selectedItems.length === 0}
                                className="px-8 py-2.5 text-[10px] font-display tracking-widest bg-[#FF2EBD] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity uppercase shadow-lg shadow-[#FF2EBD]/20"
                            >
                                Add to Page
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    )
}
