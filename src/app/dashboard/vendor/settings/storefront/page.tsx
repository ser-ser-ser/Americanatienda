'use client'

import {
    Store,
    Edit2,
    Eye,
    Image,
    FileText,
    LayoutGrid,
    Link,
    Save,
    Camera,
    ArrowUpDown,
    Undo,
    Redo,
    PlusCircle
} from 'lucide-react'

export default function VendorStorefrontEditor() {
    return (
        <div className="bg-[#f8f5f7] dark:bg-[#0a0508] text-white selection:bg-[#f425af]/30 min-h-screen font-sans">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[#34182b] bg-[#0a0508] px-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tighter uppercase italic">Americana</h1>
                    </div>
                    <div className="h-6 w-[1px] bg-[#34182b]"></div>
                    <div className="flex h-10 items-center gap-3 px-4 rounded cursor-pointer group border border-dashed border-[#f425af]/30 hover:border-[#f425af] hover:bg-[#f425af]/5 transition-all">
                        <Store className="h-4 w-4 text-[#f425af]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#cb90b7] group-hover:text-white transition">Upload Store Logo</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-[#34182b]">
                        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#49223c] text-[#f425af]">
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#49223c]">
                            <Eye className="h-4 w-4 text-[#cb90b7]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 rounded-full border border-[#f425af]/50 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#f425af] hover:bg-[#f425af] hover:text-white transition">
                            Live Store
                        </button>
                        <div className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-[#f425af]/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUzdW1NckdWhQ5Dq64i826w-x9IItjFwIlfUiX8hBQ5o95WzouebrwbT2iBnbl4KbD7MAk2Gz1FTAZTcesAL7Vmpx1hI57yNefTCQ682WO4qf51g37Ok0EDoRVQxxqAPSLRhZHPJnLVMsCWH57CStN50rgCgpycLtgVmPIf6hU3ajir0xTVoTvODFJH7pfokDOOa7QWP32CKenOCTEMecIqMzX-_tSTf8GIHpokf0wKyc9jqEurQzG14cqn9chXmElNM9l9Q7VdLmG')" }}></div>
                    </div>
                </div>
            </header>

            <div className="flex h-screen pt-16">
                {/* LEFT SIDEBAR */}
                <aside className="w-72 flex-shrink-0 border-r border-[#34182b] bg-[#1a0c16] p-6 flex flex-col gap-8 overflow-y-auto">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#cb90b7] mb-6">Store Elements</h2>
                        <div className="flex flex-col gap-3">
                            <button className="group flex w-full items-center gap-4 rounded-xl bg-[#49223c]/50 p-4 border border-[#34182b] hover:border-[#f425af] transition">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a0508] text-[#cb90b7] group-hover:text-[#f425af]">
                                    <Image className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase tracking-wider">Store Banner</p>
                                    <p className="text-[10px] text-[#cb90b7]">High-res hero image</p>
                                </div>
                            </button>
                            <button className="group flex w-full items-center gap-4 rounded-xl bg-[#49223c]/50 p-4 border border-[#34182b] hover:border-[#f425af] transition">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a0508] text-[#cb90b7] group-hover:text-[#f425af]">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase tracking-wider">About Section</p>
                                    <p className="text-[10px] text-[#cb90b7]">Your brand story</p>
                                </div>
                            </button>
                            <button className="group flex w-full items-center gap-4 rounded-xl bg-[#49223c]/50 p-4 border border-[#34182b] hover:border-[#f425af] transition">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a0508] text-[#cb90b7] group-hover:text-[#f425af]">
                                    <LayoutGrid className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase tracking-wider">Categories</p>
                                    <p className="text-[10px] text-[#cb90b7]">Organize your shop</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="h-[1px] w-full bg-[#34182b]"></div>
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#cb90b7] mb-6">Store Socials</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0508] border border-[#34182b]">
                                <Link className="h-4 w-4 text-[#cb90b7]" />
                                <input className="bg-transparent border-none text-[10px] p-0 focus:ring-0 w-full outline-none text-white placeholder-[#cb90b7]/50" placeholder="Instagram URL" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-[#34182b]">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f425af] py-4 text-xs font-bold uppercase tracking-widest transition hover:brightness-110">
                            <Save className="h-4 w-4" />
                            Save Draft
                        </button>
                    </div>
                </aside>

                {/* MAIN CANVAS */}
                <main className="relative flex-1 bg-[#0d070b] p-12 overflow-y-auto canvas-scroll">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0a0508]/80 rounded-full border border-[#f425af]/30 backdrop-blur-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#f425af] animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f425af]">Live Store Preview</span>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1000px] shadow-2xl shadow-black/80 bg-[#0a0508] min-h-screen">

                        {/* HERO SECTION */}
                        <section className="group relative h-[450px] w-full border-2 border-transparent hover:border-[#f425af] transition cursor-pointer overflow-hidden bg-black">
                            <div className="absolute inset-0 z-0 bg-cover bg-center grayscale brightness-50" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAb8vLSq2o_2WnhRfLls4M8w73T-nDGtY4XjEhWmK90Ehy-5JvGKDLaUh3TrytyxSTxnPAuRRZyK8b5Am-dc-wFzpeXMD0m_B2bm_A0SizmgGAB__nnZl-Ept1Gx3rblE0zAi323NuZRp7MPCXF5_mHEFFRI52IZJ6Zja6oK8ec3hWlf6PHR3uOY72HjS_Bgc8pq49b7TBmkH0Ng8QfL-dVc0fC6Q6l1wNYQn3jQvkH-eX_1M_bCrye9hYH5q1xX0WGj2qs_u-Ozegb')" }}></div>
                            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition bg-[#f425af]/10 flex items-center justify-center">
                                <div className="bg-black/80 p-4 rounded-xl border border-[#f425af]/40 text-center">
                                    <Camera className="h-8 w-8 text-[#f425af] mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Change Store Banner</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                <h2 className="text-6xl font-black uppercase tracking-tighter outline-none text-white" contentEditable="true">
                                    Seller Store Name
                                </h2>
                                <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-[#cb90b7]/80 italic" contentEditable="true">
                                    "Your shop's unique tagline or motto goes here."
                                </p>
                            </div>
                        </section>

                        {/* ABOUT SECTION */}
                        <section className="group relative py-16 px-12 text-center border-b border-[#34182b] hover:bg-[#49223c]/10 transition">
                            <div className="max-w-2xl mx-auto">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f425af] mb-4 block">Our Story</span>
                                <h3 className="text-2xl font-bold uppercase mb-6" contentEditable="true">Crafting the Future of Streetwear</h3>
                                <p className="text-sm text-[#cb90b7] leading-relaxed" contentEditable="true">
                                    Founded in 2024, our shop focuses on the intersection of technical functionality and high-fashion aesthetics. Every piece is curated for the modern urban wanderer.
                                </p>
                            </div>
                            <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition text-[#cb90b7] hover:text-[#f425af]">
                                <Edit2 className="h-4 w-4" />
                            </button>
                        </section>

                        {/* PRODUCTS GRID */}
                        <section className="py-20 px-12">
                            <div className="flex items-end justify-between mb-12 border-b border-[#34182b] pb-4">
                                <h3 className="text-2xl font-bold uppercase tracking-tight" contentEditable="true">New Drops</h3>
                                <div className="flex gap-4 items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7]">Category Order</span>
                                    <ArrowUpDown className="h-4 w-4 text-[#cb90b7]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-10">
                                {/* PRODUCT 1 */}
                                <div className="group/item flex flex-col relative border border-transparent hover:border-[#f425af]/20 p-2 transition">
                                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[#49223c]">
                                        <img className="h-full w-full object-cover grayscale group-hover/item:grayscale-0 transition duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBedGi7iv1ewbTeT6GMBaKDbYq5XAdSfm8SaeTVLTWmvijmrWIuPn_rzaK0miUfM8Ce9lSRApZPLi2SLixMTINYrjMs_t664YhH8q2-e5YKEaUp-aQViCkw79flACM2m9SAEWkeVp1nRu9mcg2yK-H7jbc3as2haLuhpgsvJKRyFHHzrNLWltw-6ANG3KoTYQMhXWpV3BJnI-XUsquJq_b1rsqKC1ylo34U6qSrSntyx94UZcXABbmlhAjTQynVDIKaG4CM7PV4sn_B" />
                                    </div>
                                    <h4 className="font-bold text-sm tracking-wide uppercase">Structure Blazer 01</h4>
                                    <p className="text-xs text-[#cb90b7] mt-1">$340.00</p>
                                    <button className="mt-4 w-full py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">Preview Product</button>
                                </div>
                                {/* PRODUCT 2 */}
                                <div className="group/item flex flex-col relative border border-transparent hover:border-[#f425af]/20 p-2 transition">
                                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[#49223c]">
                                        <img className="h-full w-full object-cover grayscale group-hover/item:grayscale-0 transition duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgs6qH4Sxpe2tg3mrofw6rk38w7Snm_7Df2U4k5fhKkyYFKghVIlvLQEFkR6dVvF_Lj4jQr75o-LghqdurQVkvBLaS2k2lot33YzxKXy5i6tQDupXflf9PbVo5hiqTr-qoMLf1dKDhSr3wZUQSgQxoItHYRU1x0-VPiyHQU45qQkAWxkzJ1zfqjCai5b160-JLNReu9QmFr29LETcND_QyfYQZMJZkb1-nWTRjtoXlxMh8-CHsE5bxkJIRzcKWeeM56ON7YGMhNQhO" />
                                    </div>
                                    <h4 className="font-bold text-sm tracking-wide uppercase">Raw Denim Series</h4>
                                    <p className="text-xs text-[#cb90b7] mt-1">$210.00</p>
                                    <button className="mt-4 w-full py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">Preview Product</button>
                                </div>
                                {/* PRODUCT 3 */}
                                <div className="group/item flex flex-col relative border border-transparent hover:border-[#f425af]/20 p-2 transition">
                                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[#49223c]">
                                        <img className="h-full w-full object-cover grayscale group-hover/item:grayscale-0 transition duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeuXxYLC2OHRsJGekpmfeDCO7PqLs6htRPh70lXJY7dEZHqgg3SaEb8wVaNt3AeRG691CT0xcL4_DS8VatNzPeMc1eLRhUq_fMFJHOQH8fzMyx6IuhvW5YaSF5VK25A7pb_0tXMbYd7njP0clCW6AjYm9BP56KDErumC3xhvRwcmelxSKdvxClP4PkNco2WPPL_-EIbZwF5Rtwq-h0HUPXqR4p5eXvg4IvokFB-oFuL5jBYDtmOwLMoCe4oCcK7OTpJkW1VPi1e7Vu" />
                                    </div>
                                    <h4 className="font-bold text-sm tracking-wide uppercase">Void Leather Bag</h4>
                                    <p className="text-xs text-[#cb90b7] mt-1">$890.00</p>
                                    <button className="mt-4 w-full py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">Preview Product</button>
                                </div>
                            </div>
                            <button className="mt-16 w-full py-8 border-2 border-dashed border-[#34182b] hover:border-[#f425af]/50 flex flex-col items-center justify-center gap-2 group transition">
                                <PlusCircle className="h-8 w-8 text-[#cb90b7] group-hover:text-[#f425af] transition" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#cb90b7] group-hover:text-white transition">Add New Category Section</span>
                            </button>
                        </section>

                        <footer className="mt-20 border-t border-[#34182b] py-12 px-12 bg-[#050305] opacity-60 grayscale pointer-events-none">
                            <div className="flex justify-between items-start">
                                <div className="max-w-xs">
                                    <h4 className="text-lg font-bold italic mb-4">AMERICANA</h4>
                                    <p className="text-[10px] text-[#cb90b7] leading-relaxed uppercase tracking-tighter">Curated essentials for the modern provocateur.</p>
                                </div>
                                <div className="flex gap-16">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-bold text-[#f425af] mb-2">EXPLORE</p>
                                        <p className="text-[10px] text-[#cb90b7]">STORES</p>
                                        <p className="text-[10px] text-[#cb90b7]">EDITORIAL</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-bold text-[#f425af] mb-2">CONNECT</p>
                                        <p className="text-[10px] text-[#cb90b7]">INSTAGRAM</p>
                                        <p className="text-[10px] text-[#cb90b7]">CONTACT</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-12 text-[8px] text-[#cb90b7]/40 uppercase tracking-widest">© 2024 Americana Marketplace. All rights reserved.</p>
                        </footer>
                    </div>

                    {/* FLOATING BAR */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-[rgba(26,12,22,0.8)] backdrop-blur-xl rounded-full border border-[#34182b] shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7]">Autosaved 12:45 PM</p>
                        </div>
                        <div className="h-6 w-[1px] bg-[#34182b]"></div>
                        <div className="flex gap-4">
                            <button className="text-[#cb90b7] hover:text-white flex items-center gap-1">
                                <Undo className="h-4 w-4" />
                            </button>
                            <button className="text-[#cb90b7] hover:text-white flex items-center gap-1">
                                <Redo className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="h-6 w-[1px] bg-[#34182b]"></div>
                        <button className="bg-[#f425af] px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-[#f425af]/20">
                            Publish Storefront
                        </button>
                    </div>

                </main>

                {/* RIGHT SIDEBAR - SETTINGS */}
                <aside className="w-80 flex-shrink-0 border-l border-[#34182b] bg-[#1a0c16] overflow-y-auto">
                    <div className="p-6 border-b border-[#34182b]">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Storefront Settings</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-8">
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7] mb-4">Brand Accent Color</h4>
                            <div className="grid grid-cols-5 gap-2">
                                <div className="aspect-square rounded bg-[#f425af] border-2 border-white cursor-pointer"></div>
                                <div className="aspect-square rounded bg-[#00ffcc] hover:scale-105 transition cursor-pointer"></div>
                                <div className="aspect-square rounded bg-[#ffcc00] hover:scale-105 transition cursor-pointer"></div>
                                <div className="aspect-square rounded bg-white hover:scale-105 transition cursor-pointer"></div>
                                <div className="aspect-square rounded border border-[#34182b] flex items-center justify-center cursor-pointer">
                                    <PlusCircle className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-[#34182b]"></div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7] mb-4">Banner Overlay</h4>
                            <div className="flex flex-col gap-4">
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] text-[#cb90b7]/60">Overlay Intensity</span>
                                    <input className="accent-[#f425af] w-full h-1.5 bg-[#49223c] rounded-lg appearance-none cursor-pointer" type="range" defaultValue="60" />
                                </label>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#49223c]/40 border border-[#34182b]">
                                    <span className="text-xs font-medium">Parallax Effect</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-7 h-4 bg-[#49223c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#f425af]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-[#34182b]"></div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7] mb-4">Search Optimization</h4>
                            <div className="flex flex-col gap-3">
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] text-[#cb90b7]/60">Store Meta Title</span>
                                    <input className="h-9 rounded-lg border border-[#34182b] bg-[#49223c] px-3 text-xs focus:border-[#f425af] focus:ring-0 outline-none text-white" type="text" defaultValue="Modern Streetwear | Seller Store" />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[10px] text-[#cb90b7]/60">Keywords (Comma separated)</span>
                                    <textarea className="h-20 rounded-lg border border-[#34182b] bg-[#49223c] px-3 py-2 text-xs focus:border-[#f425af] focus:ring-0 resize-none outline-none text-white" defaultValue="streetwear, avant-garde, limited, fashion"></textarea>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
