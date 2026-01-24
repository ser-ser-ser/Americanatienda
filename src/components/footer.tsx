'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Facebook, Github, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    const [socials, setSocials] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        github: '',
        email: '',
        description: ''
    })
    const supabase = createClient()

    useEffect(() => {
        const fetchSocials = async () => {
            const { data } = await supabase.from('site_content').select('*').in('key', ['social_facebook_url', 'social_twitter_url', 'social_instagram_url', 'social_github_url', 'footer_contact_email', 'footer_description'])
            if (data) {
                const map = data.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value
                    return acc
                }, {})
                setSocials({
                    facebook: map['social_facebook_url'],
                    twitter: map['social_twitter_url'],
                    instagram: map['social_instagram_url'],
                    github: map['social_github_url'],
                    email: map['footer_contact_email'],
                    description: map['footer_description']
                })
            }
        }
        fetchSocials()
    }, [supabase])

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black border-t border-white/10 text-zinc-400 py-12 z-50 relative">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <Link href="/" className="text-2xl font-serif font-bold text-white tracking-tighter mb-4 block">
                            AMERICANA
                        </Link>
                        <p className="max-w-md text-zinc-500 font-light">
                            {socials.description || 'Curated essentials for the modern provocateur. Experience the intersection of aesthetics and indulgence.'}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="/#stores" className="hover:text-primary transition-colors">Stores</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Connect</h4>
                        <div className="flex gap-4">
                            {socials.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {socials.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {socials.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {socials.github && (
                                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Github className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p>&copy; {currentYear} Americana Stores. All rights reserved.</p>
                        {socials.email && <span className="text-zinc-500 hidden md:inline">| {socials.email}</span>}
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-zinc-400">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-zinc-400">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
