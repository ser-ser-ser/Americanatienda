'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export default function SellerApplicationPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        instagram: '',
        story: '',
        niche: ''
    })

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/signup')
            } else {
                setUser(user)
            }
        }
        getUser()
    }, [])

    const handleSubmit = async () => {
        if (!formData.name || !formData.niche) {
            toast.error('Store Name and Niche are required')
            return
        }
        setLoading(true)

        try {
            // Slug generation
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

            const { error } = await supabase
                .from('stores')
                .insert({
                    owner_id: user.id,
                    name: formData.name,
                    slug: slug,
                    description: formData.story, // Mapping 'story' to description
                    website: formData.website,
                    instagram_handle: formData.instagram,
                    niche: formData.niche,
                    status: 'pending' // Default to pending approval
                })

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.error('A store with this name/slug already exists.')
                } else {
                    throw error
                }
            } else {
                router.push('/onboarding/success')
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const niches = [
        { id: 'High Fashion', label: 'High Fashion' },
        { id: 'Streetwear', label: 'Streetwear' },
        { id: 'Accessories', label: 'Accessories' },
        { id: 'Lifestyle', label: 'Lifestyle' }
    ]

    return (
        <div className="min-h-screen bg-[#110f11] text-white font-sans flex items-center justify-center p-4">

            <div className="w-full max-w-4xl bg-[#1a181a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">

                {/* Header Bar */}
                <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-[#1f1d1f]">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="h-6 w-6 text-pink-500">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                        <span className="font-serif font-bold text-lg text-white">ALT Market</span>
                    </Link>

                    <div className="flex gap-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        <span className="text-white">Marketplace</span>
                        <span>Explore</span>
                    </div>

                    <Button variant="destructive" size="sm" className="bg-pink-600 hover:bg-pink-700 text-xs font-bold uppercase tracking-wider px-6">
                        Exit Setup
                    </Button>
                </div>

                <div className="p-12 md:p-16 max-w-2xl mx-auto">

                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="font-serif font-bold text-lg text-white">Step 1 of 3: The Brand</h3>
                            <span className="text-pink-600 text-xs font-bold uppercase">33% Complete</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-2">
                            <span className="text-white">Brand</span>
                            <span>Business</span>
                            <span>Verification</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-bold text-white mb-4">The Brand</h1>
                        <p className="text-zinc-400">Tell us about your store concept and your unique digital presence.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Store Name */}
                        <div className="bg-[#1f1d1f] border border-white/5 rounded-xl p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Store Name</Label>
                                <Input
                                    placeholder="e.g. Neon Gothic Collective"
                                    className="bg-black/40 border-zinc-800 focus:border-zinc-700 h-12"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Website</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                        </div>
                                        <Input
                                            placeholder="www.yourstore.com"
                                            className="bg-black/40 border-zinc-800 focus:border-zinc-700 h-12 pl-10"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Instagram Handle</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">@</div>
                                        <Input
                                            placeholder="yourbrand"
                                            className="bg-black/40 border-zinc-800 focus:border-zinc-700 h-12 pl-8"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Brand Story</Label>
                                <Textarea
                                    placeholder="Describe the aesthetic, your target audience, and what makes your products alternative..."
                                    className="bg-black/40 border-zinc-800 focus:border-zinc-700 min-h-[100px]"
                                    value={formData.story}
                                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Primary Niche</Label>
                                <div className="flex gap-3">
                                    {niches.map(niche => (
                                        <button
                                            key={niche.id}
                                            onClick={() => setFormData({ ...formData, niche: niche.id })}
                                            className={`
                                                px-4 py-2 rounded-full text-xs font-medium border transition-all
                                                ${formData.niche === niche.id
                                                    ? 'bg-pink-600/10 border-pink-600 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                                                    : 'bg-black/20 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                                                }
                                            `}
                                        >
                                            {niche.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold tracking-wide rounded-lg text-base shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue to Business Details'}
                        </Button>

                        <div className="text-center text-xs text-zinc-600 cursor-pointer hover:text-zinc-500 transition-colors">
                            Save Draft & Exit
                        </div>
                    </div>

                </div>

                {/* Footer Legal */}
                <div className="border-t border-white/5 p-6 text-center text-[10px] uppercase tracking-widest text-zinc-700">
                    © 2026 ALT MARKET APPLICATION SYSTEM — SECURE & CONFIDENTIAL
                </div>

            </div>
        </div>
    )
}
