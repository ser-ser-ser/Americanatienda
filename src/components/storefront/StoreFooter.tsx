'use client'

import React from 'react'
import { MapPin, Instagram, Facebook } from 'lucide-react'
import { Store } from '@/types'

interface StoreFooterProps {
    store: Store
    themeColor: string
}

export function StoreFooter({ store, themeColor }: StoreFooterProps) {
    return (
        <div className="w-full">
            {/* --- Visit Us Section (Optional) --- */}
            {store.address && (
                <section id="visit" className="py-16 bg-white border-t border-zinc-100">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-2 block">Visítanos</span>
                            <h3 className="text-3xl font-bold mb-6">Nuestra Ubicación</h3>
                            <div className="space-y-4 text-lg text-zinc-600">
                                <p className="flex items-start gap-3">
                                    <MapPin className="h-6 w-6 shrink-0 mt-1" style={{ color: themeColor }} />
                                    <span>
                                        {store.address}<br />
                                        {store.city}, {store.state} {store.zip}
                                    </span>
                                </p>
                            </div>
                            <div className="flex gap-4 mt-8">
                                {store.instagram_url && (
                                    <a href={store.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {store.facebook_url && (
                                    <a href={store.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                        {/* Simple Map Placeholder or Embed */}
                        <div className="aspect-video bg-zinc-100 rounded-2xl overflow-hidden relative">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(store.address + ', ' + store.city)}`}
                            ></iframe>
                        </div>
                    </div>
                </section>
            )}

            {/* --- Footer --- */}
            <footer className="bg-black text-white py-12 px-4 mt-12" style={{ borderTop: `4px solid ${themeColor}` }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-lg mb-2">{store.name}</h4>
                        <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} Americana Stores. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
