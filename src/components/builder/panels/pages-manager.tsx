"use client"

import React from 'react'
import {
    BookOpen,
    PlusCircle,
    X,
    GripVertical,
    Home,
    ShoppingBag,
    User,
    AtSign,
    Plus,
    Settings,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function PagesManager({ onClose }: { onClose: () => void }) {
    return (
        <div className="absolute top-20 left-20 z-50 w-[420px] bg-[#141414]/95 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-[#FF007F] w-4 h-4" />
                    <h2 className="font-display text-[10px] tracking-widest uppercase font-bold text-white">Pages & Site Menu</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-slate-500 hover:text-[#FF007F] transition"><PlusCircle className="w-5 h-5" /></button>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition"><X className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px] p-2 space-y-1">
                {/* Home Page */}
                <div className="group relative flex items-center gap-3 px-3 py-3 rounded bg-white/5 border border-[#FF007F]/20 cursor-grab active:cursor-grabbing transition-all hover:bg-white/10">
                    <GripVertical className="text-slate-600 w-4 h-4" />
                    <Home className="text-[#FF007F] w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-white">Home</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                        <button className="p-1 hover:text-[#FF007F] transition"><Plus className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Shop Section */}
                <div className="group relative flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-3 rounded hover:bg-white/5 border border-transparent hover:border-white/5 cursor-grab transition-all">
                        <GripVertical className="text-slate-600 w-4 h-4" />
                        <ShoppingBag className="text-slate-400 w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">Shop</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                            <button className="p-1 hover:text-[#FF007F] transition"><Plus className="w-3 h-3" /></button>
                            <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                            <button className="p-1 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    </div>
                    {/* Sub Pages */}
                    <div className="ml-10 border-l border-white/10 pl-4 space-y-1 py-1">
                        <div className="group flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 border border-transparent transition-all cursor-grab">
                            <GripVertical className="text-slate-700 w-3 h-3" />
                            <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Collections</span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                                <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <div className="group flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 border border-transparent transition-all cursor-grab">
                            <GripVertical className="text-slate-700 w-3 h-3" />
                            <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">New Arrivals</span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                                <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <div className="group relative flex items-center gap-3 px-3 py-3 rounded hover:bg-white/5 border border-transparent hover:border-white/5 cursor-grab transition-all">
                    <GripVertical className="text-slate-600 w-4 h-4" />
                    <User className="text-slate-400 w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">Visionary Profile</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                        <button className="p-1 hover:text-[#FF007F] transition"><Plus className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Contact */}
                <div className="group relative flex items-center gap-3 px-3 py-3 rounded hover:bg-white/5 border border-transparent hover:border-white/5 cursor-grab transition-all">
                    <GripVertical className="text-slate-600 w-4 h-4" />
                    <AtSign className="text-slate-400 w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">Contact</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                        <button className="p-1 hover:text-[#FF007F] transition"><Plus className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-[#FF007F] transition"><Settings className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
                <button className="flex items-center gap-2 text-[10px] font-display tracking-widest uppercase font-bold text-[#FF007F] hover:text-[#FF007F]/80 transition">
                    <Plus className="w-4 h-4" />
                    Add New Page
                </button>
                <button className="text-slate-500 hover:text-white transition"><Settings className="w-5 h-5" /></button>
            </div>
        </div>
    )
}
