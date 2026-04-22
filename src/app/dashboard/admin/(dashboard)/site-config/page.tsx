'use client'

import React from 'react'

export default function SiteConfigPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white font-display italic">
                System Configuration
            </h1>
            <div className="p-12 rounded-3xl border border-white/5 bg-zinc-900/50 flex flex-col items-center justify-center text-center">
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-sm">
                    External CMS connector pending implementation (Builder.io).
                </p>
            </div>
        </div>
    )
}
