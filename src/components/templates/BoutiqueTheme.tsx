import { Button } from "@/components/ui/button"

export function BoutiqueTheme() {
    return (
        <div className="p-10 bg-[#f8f5f2] text-[#4a4a4a] font-serif">
            <h1 className="text-5xl font-bold mb-4 italic text-center">Le Boutique</h1>
            <p className="text-[#8a8a8a] mb-12 text-center">Curated elegance.</p>
            <div className="grid grid-cols-3 gap-8">
                <div className="h-80 bg-white shadow-lg p-4"></div>
                <div className="h-80 bg-white shadow-lg p-4"></div>
                <div className="h-80 bg-white shadow-lg p-4"></div>
            </div>
        </div>
    )
}
