"use client"

import React from 'react'
import {
    ChevronDown,
    ChevronRight,
    Search,
    FolderPlus,
    Minimize2,
    Eye,
    EyeOff,
    Unlock,
    Lock,
    StretchHorizontal, // for view_agenda (Section)
    Grid, // for grid_view (Container)
    MousePointer2, // for smart_button
    Type, // for text_fields
    Image as ImageIcon,
    MoreVertical,
    Copy,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function LayoutOrganizer() {
    return (
        <aside className="w-80 bg-[#160a12] border-l border-[#2d1625] flex flex-col shrink-0 h-full">
            {/* Panel Header */}
            <div className="p-4 border-b border-[#2d1625]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#cb90b7] font-display">Layers & Hierarchy</h3>
                    <div className="flex gap-2">
                        <button className="text-[#cb90b7] hover:text-white transition-colors" title="Collapse All">
                            <Minimize2 className="w-4 h-4" />
                        </button>
                        <button className="text-[#cb90b7] hover:text-white transition-colors" title="New Folder">
                            <FolderPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-[#cb90b7] group-focus-within:text-[#f425af]" />
                    </div>
                    <input
                        className="w-full bg-[#22101c] border border-[#2d1625] focus:ring-1 focus:ring-[#f425af] focus:border-[#f425af] text-xs text-white placeholder-[#cb90b7] rounded py-2 pl-9 outline-none transition-all placeholder:opacity-50"
                        placeholder="Search elements..."
                        type="text"
                    />
                </div>
            </div>

            {/* Layers Tree View */}
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">

                {/* Layer Row: Section (Parent) */}
                <div className="group flex items-center px-3 py-1.5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="mr-1 text-[#cb90b7]">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <StretchHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider truncate text-white">Hero Section</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button className="text-[#cb90b7] hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Nested: Main Container */}
                <div className="group flex items-center px-3 py-1.5 pl-8 hover:bg-white/5 cursor-pointer border-l border-[#2d1625] ml-5 transition-colors">
                    <div className="mr-1 text-[#cb90b7]">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <Grid className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-medium tracking-wide truncate text-white">Main Container</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button className="text-[#cb90b7] hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Nested: Element (Active State) */}
                <div className="group flex items-center px-3 py-1.5 pl-12 bg-[#f425af]/10 border-l-2 border-[#f425af] cursor-pointer transition-colors">
                    <div className="mr-2 text-[#f425af]">
                        {/* Drag Handle Icon simulated */}
                        <div className="flex flex-col gap-[2px]">
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mr-2 text-[#f425af]">
                        <MousePointer2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-bold text-[#f425af] uppercase tracking-wider truncate">CTA Button</span>
                    <div className="flex items-center gap-2 pr-1">
                        <button className="text-[#f425af]"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Nested: Element Text */}
                <div className="group flex items-center px-3 py-1.5 pl-12 hover:bg-white/5 cursor-pointer border-l border-[#2d1625] ml-12 transition-colors">
                    <div className="mr-2 text-[#cb90b7] group-hover:text-white">
                        {/* Drag Handle Icon simulated */}
                        <div className="flex flex-col gap-[2px]">
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <Type className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-medium tracking-wide text-white/70 truncate">Title Label</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button className="text-[#cb90b7] hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Nested: Locked Element */}
                <div className="group flex items-center px-3 py-1.5 pl-12 hover:bg-white/5 cursor-pointer border-l border-[#2d1625] ml-12 opacity-60 transition-colors">
                    <div className="mr-2 text-[#cb90b7]">
                        {/* Drag Handle Icon simulated */}
                        <div className="flex flex-col gap-[2px]">
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                            <div className="flex gap-[2px]">
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                                <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-medium tracking-wide truncate italic text-white">Background Image</span>
                    <div className="flex items-center gap-2 pr-1">
                        <button className="text-white"><EyeOff className="w-3.5 h-3.5" /></button>
                        <button className="text-white"><Lock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Layer Row: Section 2 */}
                <div className="group flex items-center px-3 py-1.5 mt-2 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="mr-1 text-[#cb90b7]">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <Grid className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider truncate text-white">Product Grid</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button className="text-[#cb90b7] hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                {/* Layer Row: Section 3 */}
                <div className="group flex items-center px-3 py-1.5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="mr-1 text-[#cb90b7]">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="mr-2 text-[#cb90b7]">
                        <StretchHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider truncate text-white">Footer Navigation</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button className="text-[#cb90b7] hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-[#cb90b7] hover:text-white"><Unlock className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

            </div>

            {/* Footer / Breadcrumb & Actions */}
            <div className="bg-[#12080f] border-t border-[#2d1625] p-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] text-[#cb90b7] font-medium uppercase tracking-tight font-display">
                    <span>Hero Section</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span>Main Container</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="text-white">CTA Button</span>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 h-7 text-[10px] font-bold uppercase tracking-widest border border-[#2d1625] text-white hover:bg-white/5 transition-colors rounded-sm">
                        Duplicate
                    </button>
                    <button className="flex-1 h-7 text-[10px] font-bold uppercase tracking-widest border border-[#2d1625] text-[#cb90b7] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors rounded-sm">
                        Delete
                    </button>
                </div>
            </div>
        </aside>
    )
}
