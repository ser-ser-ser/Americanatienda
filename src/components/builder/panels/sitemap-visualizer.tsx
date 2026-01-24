"use client"

import React from 'react'
import {
    Search,
    Settings,
    Plus,
    Folder,
    MoreVertical,
    Home,
    ShoppingBag,
    Info,
    Gavel,
    Sparkles,
    LayoutList,
    Move
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function SitemapVisualizer() {
    return (
        <div className="flex-1 h-full bg-[#F8F9FA] dark:bg-[#0A0A0A] overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-display mb-1 text-slate-900 dark:text-white">Visual Architecture</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage the structure and flow of the Americana SaaS marketplace.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2A2A2A] rounded-md text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none w-64 text-slate-900 dark:text-white"
                                placeholder="Search pages..."
                                type="text"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#161616] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 border border-slate-200 dark:border-[#2A2A2A] rounded-md bg-white dark:bg-[#161616] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 rounded-md hover:bg-[#39FF14]/20 transition-all font-semibold text-sm">
                            <Plus className="w-4 h-4" />
                            New Page
                        </button>
                    </div>
                </div>

                {/* Main Pages Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Folder className="text-[#D4AF37] w-6 h-6" />
                        <h3 className="font-display text-xl tracking-wide uppercase text-slate-700 dark:text-slate-300">Main Pages</h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-[#2A2A2A] ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {/* Page Cards */}
                        {[
                            { title: 'Home', icon: Home, sections: ['Header', 'Hero Section', 'Trending Grid', 'Newsletter', 'Footer'] },
                            { title: 'Shop', icon: ShoppingBag, sections: ['Header', 'Filters Sidebar', 'Product List', 'Pagination', 'Footer'] },
                            { title: 'About Us', icon: Info, sections: ['Header', 'Brand Story', 'Team Grid', 'Footer'] },
                            { title: 'Privacy Policy', icon: Gavel, sections: ['Header', 'Legal Text Section', 'Footer'] },
                        ].map((page, i) => (
                            <div key={i} className="flex flex-col bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2A2A2A] rounded-lg overflow-hidden group hover:border-[#D4AF37] hover:-translate-y-0.5 transition-all duration-200">
                                <div className="p-4 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                                    <div className="flex items-center gap-2">
                                        <page.icon className="w-4 h-4 text-[#D4AF37]" />
                                        <span className="font-medium text-sm text-slate-900 dark:text-gray-100">{page.title}</span>
                                    </div>
                                    <MoreVertical className="text-slate-400 w-4 h-4 cursor-pointer hover:text-white" />
                                </div>
                                <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                                    {page.sections.map((section, j) => (
                                        <div key={j} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded text-xs flex items-center justify-between cursor-move hover:border-[#D4AF37]/50 text-slate-500 group/section">
                                            <span>{section}</span>
                                            <Move className="w-3 h-3 text-slate-600 opacity-0 group-hover/section:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                                <button className="m-3 p-2 border border-dashed border-slate-300 dark:border-slate-700 rounded text-[10px] text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all uppercase font-semibold">
                                    + Add Section
                                </button>
                            </div>
                        ))}

                        {/* Add Page Card */}
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-[#2A2A2A] rounded-lg hover:border-[#D4AF37]/50 transition-colors group cursor-pointer h-[320px]">
                            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#2A2A2A] flex items-center justify-center text-slate-400 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37]">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Add Page</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Pages Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="text-[#39FF14] w-6 h-6" />
                        <h3 className="font-display text-xl tracking-wide uppercase text-slate-700 dark:text-slate-300">Dynamic Pages</h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-[#2A2A2A] ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[
                            { title: 'Store Items (Item)', icon: Sparkles, sections: ['Header', 'Breadcrumbs', 'Item Gallery', 'Item Details & Buy', 'Related Items', 'Footer'] },
                            { title: 'Category Lists', icon: LayoutList, sections: ['Header', 'Category Hero', 'Product Grid', 'Footer'] },
                        ].map((page, i) => (
                            <div key={i} className="flex flex-col bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2A2A2A] rounded-lg overflow-hidden group hover:border-[#39FF14] hover:-translate-y-0.5 transition-all duration-200">
                                <div className="p-4 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                                    <div className="flex items-center gap-2">
                                        <page.icon className="w-4 h-4 text-[#39FF14]" />
                                        <span className="font-medium text-sm text-slate-900 dark:text-gray-100">{page.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded-full bg-[#39FF14]/10 text-[9px] text-[#39FF14] font-bold">CMS</span>
                                        <MoreVertical className="text-slate-400 w-4 h-4 cursor-pointer hover:text-white" />
                                    </div>
                                </div>
                                <div className="p-3 space-y-2">
                                    {page.sections.map((section, j) => (
                                        <div key={j} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded text-xs text-slate-500">
                                            {section}
                                        </div>
                                    ))}
                                </div>
                                <button className="m-3 p-2 border border-dashed border-slate-300 dark:border-slate-700 rounded text-[10px] text-slate-400 uppercase font-semibold">
                                    + Add Section
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
