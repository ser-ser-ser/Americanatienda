'use client'

import React, { useState } from 'react'
import { Search, Globe, CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface DomainResult {
    domain: string
    available: boolean
    price?: string
}

export default function DomainSearch() {
    const [query, setQuery] = useState('')
    const [searching, setSearching] = useState(false)
    const [results, setResults] = useState<DomainResult[]>([])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query || query.length < 3) return

        setSearching(true)
        // Mocking domain search API
        setTimeout(() => {
            const mockResults: DomainResult[] = [
                { domain: `${query.toLowerCase()}.com`, available: Math.random() > 0.3, price: '$12.99/yr' },
                { domain: `${query.toLowerCase()}.shop`, available: true, price: '$8.50/yr' },
                { domain: `${query.toLowerCase()}.store`, available: true, price: '$10.00/yr' },
                { domain: `${query.toLowerCase()}.io`, available: false },
            ]
            setResults(mockResults)
            setSearching(false)
        }, 1200)
    }

    const handleConnect = (domain: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Initiating connection for ${domain}...`,
                success: `Check your email to verify DNS settings for ${domain}`,
                error: 'Connection failed. Please try again.',
            }
        )
    }

    return (
        <div className="space-y-8">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    {searching ? <Loader2 className="h-5 w-5 text-[#ff007f] animate-spin" /> : <Search className="h-5 w-5 text-zinc-500" />}
                </div>
                <Input
                    type="text"
                    placeholder="search-your-dream-domain"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-16 pl-14 pr-32 bg-zinc-900/50 border-white/5 text-white text-lg font-bold rounded-2xl focus:border-[#ff007f]/50 transition-all placeholder:text-zinc-700"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pr-2">
                    <Button type="submit" disabled={searching} className="bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-black uppercase text-xs tracking-widest px-6 h-12 rounded-xl">
                        Search
                    </Button>
                </div>
            </form>

            {/* Results Grid */}
            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {results.map((result, idx) => (
                        <Card key={idx} className="bg-zinc-900/30 border-white/5 p-5 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${result.available ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                    {result.available ? <Globe className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                </div>
                                <div>
                                    <div className="text-white font-bold tracking-tight">{result.domain}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        {result.available ? <span className="text-green-500">{result.price}</span> : 'Taken'}
                                    </div>
                                </div>
                            </div>
                            {result.available ? (
                                <Button onClick={() => handleConnect(result.domain)} size="sm" variant="ghost" className="text-[#ff007f] hover:bg-[#ff007f]/10 font-black uppercase text-[10px] tracking-widest px-4 group-hover:bg-[#ff007f] group-hover:text-white transition-all">
                                    Claim Now
                                </Button>
                            ) : (
                                <Badge variant="outline" className="border-white/5 text-zinc-600 bg-black/40 lg:flex">BACKORDER</Badge>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Trust Badges / Info */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl">
                        <ShieldCheck className="h-5 w-5 text-[#ff007f]" />
                    </div>
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">SSL SECURE</div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Automatic HTTPS encryption for all domains</p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl">
                        <Zap className="h-5 w-5 text-[#ff007f]" />
                    </div>
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">ANYCAST DNS</div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Global propagation in under 60 seconds</p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl">
                        <Globe className="h-5 w-5 text-[#ff007f]" />
                    </div>
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">PRIVATE WHOIS</div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Identity protection included at no extra cost</p>
                </div>
            </div>
        </div>
    )
}
