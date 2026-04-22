import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Verify Admin Role (Server-Side)
    // We already have Middleware protection, but this is a second defense layer.
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Quick check to prevent layout rendering if not admin
    // Fetches profile role to confirm
    let isAdmin = false
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'admin') {
            isAdmin = true
        }
    }

    if (!isAdmin) {
        // If somehow they bypassed middleware, correct them here.
        redirect('/dashboard')
    }

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Global Admin Header */}
                <header className="h-16 flex items-center justify-between border-b border-[#222222] px-8 bg-[#0a0a0a] z-20 shrink-0">
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
                <main className="flex-1 overflow-auto relative bg-[#0a0a0a] z-0">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{
                        backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>

                    <div className="relative z-10 w-full h-full pointer-events-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
