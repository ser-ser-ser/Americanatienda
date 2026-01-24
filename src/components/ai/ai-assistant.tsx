'use client'

import React, { useState } from 'react'
import { Sparkles, Send, Loader2, X, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [productName, setProductName] = useState('')
    const [result, setResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = async () => {
        if (!productName) return
        setIsLoading(true)
        try {
            const res = await fetch('/api/ai/generate-copy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    attributes: 'premium materials, artisanal finish',
                    niche: 'High Fashion'
                })
            })
            const data = await res.json()
            setResult(data.copy)
        } catch (e) {
            toast.error("AI service temporarily offline")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-28 h-14 w-14 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform animate-bounce hover:animate-none z-50 group"
            >
                <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            </button>
        )
    }

    return (
        <Card className="fixed bottom-8 right-28 w-80 bg-[#121217] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-white/5">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500 flex items-center gap-2">
                    <Wand2 className="h-3.5 w-3.5" /> Editorial AI
                </CardTitle>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                    <X className="h-4 w-4" />
                </button>
            </CardHeader>
            <CardContent className="p-4 space-y-4 font-sans">
                {!result ? (
                    <>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Generate Copy</p>
                        <div className="space-y-2">
                            <Input
                                placeholder="Product Name (e.g. Silk Blazer)"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="bg-black/50 border-zinc-800 text-xs"
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading || !productName}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Compose Narrative"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="p-3 bg-black/50 rounded-lg border border-white/5 text-[11px] leading-relaxed italic text-zinc-300">
                            "{result}"
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 text-[9px] border-zinc-800" onClick={() => setResult('')}>
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1 text-[9px] bg-[#FF007F]"
                                onClick={() => {
                                    navigator.clipboard.writeText(result)
                                    toast.success("Ready to paste")
                                }}
                            >
                                Copy Text
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
