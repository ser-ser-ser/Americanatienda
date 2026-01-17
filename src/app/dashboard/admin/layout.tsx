import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Search } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In a real app, verify Admin Role here

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative overflow-hidden">
                {/* Global Admin Header */}
                <header className="h-16 flex items-center justify-between border-b border-[#222222] px-8 bg-[#0a0a0a]/80 backdrop-blur-xl z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-[#0db9f2] font-bold text-xl font-mono">{`//`}</span>
                        <h2 className="text-white text-sm font-bold tracking-[0.2em] uppercase font-display">
                            System Administration
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 group-focus-within:text-[#0db9f2]" />
                            <input
                                className="bg-[#121212] border-none text-white text-[11px] rounded h-9 w-64 pl-10 pr-4 placeholder-white/20 focus:ring-1 focus:ring-[#0db9f2]/50 font-bold uppercase tracking-widest outline-none"
                                placeholder="Global System Search..."
                                type="text"
                            />
                        </div>

                        <div className="h-8 w-px bg-[#222222]"></div>

                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white leading-none mb-1 uppercase tracking-wider">Master Administrator</p>
                                <p className="text-[9px] font-bold text-[#ff007f] leading-none uppercase tracking-widest">Level 05 Access</p>
                            </div>
                            <div className="size-8 border border-white/10 p-0.5">
                                <div className="w-full h-full bg-[#ff007f]/20 flex items-center justify-center">
                                    <div className="size-2 bg-[#ff007f] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto relative">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>

                    {children}
                </main>
            </div>
        </div>
    )
}
