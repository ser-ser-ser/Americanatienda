'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, MessageCircle, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import { useChat } from '@/providers/chat-provider'

interface StoreFooterProps {
    store: any
    categories?: any[]
}

export function StoreFooter({ store, categories = [] }: StoreFooterProps) {
    const { startInquiryChat } = useChat()
    const year = new Date().getFullYear()
    const accent = store?.theme_color || '#ff007f'

    // Social links from store data
    const socials = [
        store?.instagram_url && { icon: Instagram, url: store.instagram_url, label: 'Instagram' },
        store?.facebook_url && { icon: Facebook, url: store.facebook_url, label: 'Facebook' },
        store?.twitter_url && { icon: Twitter, url: store.twitter_url, label: 'Twitter' },
    ].filter(Boolean) as { icon: any, url: string, label: string }[]

    return (
        <footer className="bg-[#050505] border-t border-white/5 text-white">
            {/* Main footer body */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Col 1: Store identity */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            {store?.logo_url && (
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image src={store.logo_url} alt={store.name} width={40} height={40} className="object-cover" />
                                </div>
                            )}
                            <span className="text-xl font-serif font-bold tracking-tight">{store?.name}</span>
                        </div>

                        {store?.description && (
                            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                                {store.description}
                            </p>
                        )}

                        {/* Social links */}
                        {socials.length > 0 && (
                            <div className="flex items-center gap-2 pt-2">
                                {socials.map(({ icon: Icon, url, label }) => (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={label}
                                        className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Chat CTA */}
                        <button
                            onClick={() => startInquiryChat(store?.id)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80 mt-2"
                            style={{ color: accent }}
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Contactar tienda
                        </button>
                    </div>

                    {/* Col 2: Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Navegar</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href={`/shops/${store?.slug}`} className="text-zinc-400 text-sm hover:text-white transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            {categories.slice(0, 5).map(cat => (
                                <li key={cat.id}>
                                    <Link href={`/shops/${store?.slug}?categoria=${cat.id}`} className="text-zinc-400 text-sm hover:text-white transition-colors">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                            {store?.founder_name && (
                                <li>
                                    <Link href={`/shops/${store?.slug}/visionary`} className="text-zinc-400 text-sm hover:text-white transition-colors">
                                        The Visionary
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Col 3: Contact + info */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Contacto</h4>
                        <ul className="space-y-3">
                            {store?.email && (
                                <li>
                                    <a href={`mailto:${store.email}`} className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                                        {store.email}
                                    </a>
                                </li>
                            )}
                            {store?.phone && (
                                <li>
                                    <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                                        {store.phone}
                                    </a>
                                </li>
                            )}
                            {store?.address && (
                                <li className="flex items-start gap-2 text-zinc-500 text-sm">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600 mt-0.5" />
                                    <span>{store.address}</span>
                                </li>
                            )}
                        </ul>

                        {/* Legal links */}
                        <div className="pt-4 space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/privacy" className="text-zinc-500 text-xs hover:text-white transition-colors">
                                        Privacidad
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-zinc-500 text-xs hover:text-white transition-colors">
                                        Términos de uso
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-zinc-700 text-xs">
                        © {year} {store?.name}. Todos los derechos reservados.
                    </p>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-zinc-700 text-[10px] font-bold uppercase tracking-wider hover:text-zinc-400 transition-colors"
                    >
                        <span className="w-3 h-3 rounded-full bg-[#ff007f] opacity-60 animate-pulse" />
                        Powered by Americana
                    </Link>
                </div>
            </div>
        </footer>
    )
}
