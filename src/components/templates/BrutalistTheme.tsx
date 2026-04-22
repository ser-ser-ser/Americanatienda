import { Button } from "@/components/ui/button"

export function BrutalistTheme() {
    return (
        <div className="p-0 bg-zinc-900 min-h-screen text-white font-mono border-4 border-[#ff007f]">
            <div className="border-b-4 border-[#ff007f] p-8">
                <h1 className="text-6xl font-black uppercase tracking-tighter mix-blend-difference">Brutalist / <span className="text-[#ff007f]">Grunge</span></h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-12 border-r-4 border-[#ff007f] min-h-[50vh] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#ff007f] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none mix-blend-multiply" />
                    <span className="text-2xl font-bold uppercase relative z-10">Product 001</span>
                </div>
                <div className="p-12 min-h-[50vh] flex items-center justify-center border-b-4 md:border-b-0 border-[#ff007f]">
                    <span className="text-2xl font-bold uppercase">Product 002</span>
                </div>
            </div>
        </div>
    )
}
