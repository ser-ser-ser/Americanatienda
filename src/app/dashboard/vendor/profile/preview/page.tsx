'use client'

import {
    ArrowLeft,
    ShoppingBag,
    PersonStanding,
    ArrowRight,
    User
} from 'lucide-react'
import Link from 'next/link'

export default function VendorProfilePreview() {
    return (
        <div className="bg-[#050505] text-white font-sans selection:bg-[#f425af]/30 min-h-screen">
            {/* Grain Overlay */}
            <div className="fixed inset-0 z-[100] opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1x-sqOddfZKKigvDYdt7Q4ym4DEtdBqa0S6lmAOaVAEeCiMjuL4UEmWZpgJrTbRsFuwL_1F9UV-0XxGqQ0a6QTV235s9txbW4BtslAGdbUOs-1QwuUY_ggOotPw9GHXg76lZZ3Kv-84gRpELhI-TtE49YrsRqC8souD4MNFyuNFMrHg7n5N8tl-f_waSzcXELupPq3lN40I-0G4mJ3T6gPfLKCUUaC7NL5D8ViK6Tvfngpf9TQpR4KizxDVAPutq13wc5-Dpj8aM1')" }}></div>

            <header className="fixed top-0 left-0 right-0 z-50 flex h-24 items-center justify-between px-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-12">
                    <Link href="/dashboard/vendor" className="group flex items-center gap-3">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition">Return to Storefront</span>
                    </Link>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-xl font-serif italic tracking-[0.4em] uppercase">Maison Éthérée</h1>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="hidden lg:flex items-center gap-8">
                        <a className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition" href="#">Philosophy</a>
                        <a className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition" href="#">Atelier</a>
                    </nav>
                    <button className="p-1">
                        <ShoppingBag className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="min-h-screen pt-24">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-hidden">
                    {/* LEFT PANEL - IMAGE */}
                    <section className="lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/20 z-10"></div>
                        <img
                            alt="Julian Vane Editorial Portrait"
                            className="w-full h-full object-cover grayscale brightness-90 transition duration-[2000ms] group-hover:scale-110"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuACcVEvcQbIsZV16i-nBcxT8tDNNXPxXGKS75VGaiVGfFkjpXs2dWv8mIB-Y4bG38BGK-XV5Q6tPAmU00la0qd4YOPTc6Rn_yaLI2JLDfnv1D2YmnuRV06yjWIO_pQ94U_cmvMJ9n0clv_3UDU9leF0tt6rhzzJKGPih4hsh4pDp72AJCyuljX2EFafHc65VXRFBk-zpxbL2ITGL_5sGuTatzETJodBEOEwyrq6kq80ygV0STwzoFgGNJ1f1TiMcWBNdGbW6WWPsLoZ"
                        />
                        <div className="absolute bottom-12 left-12 z-20">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">Creative Director</p>
                            <h2 className="text-5xl font-serif italic tracking-tighter">Julian Vane</h2>
                        </div>
                    </section>

                    {/* RIGHT PANEL - CONTENT */}
                    <section className="lg:w-1/2 h-1/2 lg:h-full bg-[#0a0a0a] overflow-y-auto px-8 py-16 lg:px-24 lg:py-32 flex flex-col justify-center border-l border-white/5">
                        <div className="max-w-2xl space-y-16">
                            <header className="space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#f425af]">Manifesto 001</span>
                                <h3 className="text-6xl lg:text-8xl font-serif italic tracking-tighter leading-none">The Beauty of Absence.</h3>
                            </header>
                            <div className="space-y-10">
                                <p className="text-3xl lg:text-4xl font-serif leading-[1.2] tracking-[-0.02em] text-white/90">
                                    "We do not create garments to be seen. We create them to be felt in the silence between breaths."
                                </p>
                                <div className="space-y-6 text-[#888888] font-light leading-relaxed text-lg max-w-lg">
                                    <p>
                                        At Maison Éthérée, we believe that luxury is a private dialogue between the wearer and the void. Our philosophy is rooted in the noir avant-garde—a movement that prioritizes shadow over spectacle, and texture over color.
                                    </p>
                                    <p>
                                        Every silhouette is an architectural study in brutalism and fluid movement. We find soul in the imperfections of hand-dyed silks and the weight of archival wools. To wear Vane is to embrace the stillness of the metropolis at midnight.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-12 border-t border-white/10 space-y-8">
                                <div className="space-y-2">
                                    <p className="font-serif italic font-light text-3xl text-white/80">Julian Vane</p>
                                    <p className="text-[10px] uppercase tracking-widest text-[#888888]">Founder & Visionary</p>
                                </div>
                                <div className="flex flex-wrap gap-12 pt-4">
                                    <div className="space-y-1">
                                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40">Heritage</span>
                                        <span className="text-[11px] uppercase tracking-widest">Paris / Tokyo</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40">Established</span>
                                        <span className="text-[11px] uppercase tracking-widest">MMXXIV</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40">Philosophy</span>
                                        <span className="text-[11px] uppercase tracking-widest">Noir Minimalisme</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="py-40 px-10 bg-black border-t border-white/5">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
                        <div className="lg:sticky lg:top-32 space-y-6">
                            <h4 className="text-4xl font-serif italic">The Creative Process</h4>
                            <p className="text-sm text-[#888888] leading-relaxed font-light">
                                Our atelier operates on a principle of slow-construction. Each piece is treated as a sculpture, draped directly on the form before a single stitch is placed. Julian oversees the final assembly of every limited-run collection.
                            </p>
                            <a className="inline-flex items-center gap-4 group pt-4" href="#">
                                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white/20 pb-1 group-hover:border-[#f425af] transition">View The Archives</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition" />
                            </a>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-2 gap-8">
                            <div className="aspect-[3/4] overflow-hidden grayscale brightness-75 bg-[#121212]">
                                <img alt="Detail shot" className="w-full h-full object-cover hover:scale-105 transition duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7voiraNWPYZeEfXxGAJV5h5FHi9_OUnsX26a9Uo8ahuTdwlwd6I5my1LIqTZNQpDNBfSpjpvvQYHuvxFkAUPe5f5PMhvrUKLD94G8mIP5nEAeYKwbKdsJ3NxORJaM53dL7IOLhxpGqztNg78BourcUxMM-8ajH1WrYFaJZYety8YhC17HuWbSff7HU3o8jNVJgHeqifgPKRNn1SxSsD00-yXN43nswjJohNFZz5r-AaVtehti4ggkXHD5sHkJyXOgjqTnG5ePTMep" />
                            </div>
                            <div className="aspect-[3/4] overflow-hidden grayscale brightness-75 bg-[#121212] mt-12">
                                <img alt="Detail shot" className="w-full h-full object-cover hover:scale-105 transition duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdBRdhfgYxuTY7O_QeZ5F1jf6njJPmDXf9uiQUFl-r7DANgRprMCyUQBNvpA6egvvjIvRtnDqwJ4NYQE07zsTeM_EqVtXuB32lqH0RxPOBDEChN-u78fLl3Y6nuDy9_p54jalMQFYZpak_KqPKHw1WVaZsBVP1HMaPdbkS6X77Rt_ztaPJGCpifnBwV6H-L66bvzsjpQ_8WlRBOhNfJ8JkwoPUkxmEDhzXBDKxVOujSZoKjd0U92vwzxY51EYCLVT4UqybirAaIOWt" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 border-t border-white/5 px-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-black">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h5 className="font-serif italic text-2xl tracking-widest uppercase">M.É.</h5>
                    <p className="text-[9px] uppercase tracking-widest text-[#888888]">© 2024 Julian Vane for Maison Éthérée.</p>
                </div>
                <div className="flex gap-12">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Inquiries</p>
                        <ul className="space-y-2">
                            <li><a className="text-[10px] uppercase tracking-widest hover:text-[#f425af] transition" href="#">Atelier Visit</a></li>
                            <li><a className="text-[10px] uppercase tracking-widest hover:text-[#f425af] transition" href="#">Press Relations</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Connect</p>
                        <ul className="space-y-2">
                            <li><a className="text-[10px] uppercase tracking-widest hover:text-[#f425af] transition" href="#">Instagram</a></li>
                            <li><a className="text-[10px] uppercase tracking-widest hover:text-[#f425af] transition" href="#">Manifesto Journal</a></li>
                        </ul>
                    </div>
                </div>
            </footer>

            {/* EDIT BAR */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-10 px-8 py-4 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl z-50">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[#f425af]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Visionary Profile Preview</p>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <div className="flex gap-6">
                    <button className="text-[10px] font-bold uppercase text-white/40 hover:text-white transition">Edit Story</button>
                    <button className="text-[10px] font-bold uppercase text-white/40 hover:text-white transition">Update Media</button>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#f425af] hover:text-white transition shadow-lg">
                    Save Changes
                </button>
            </div>
        </div>
    )
}
