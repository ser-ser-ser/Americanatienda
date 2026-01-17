import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-black relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/80 backdrop-blur-md">
                <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-white">
                    AMERICANA
                </Link>
                <Link href="/dashboard/buyer">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
            </header>

            <div className="pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
                <div className="max-w-2xl w-full text-center">
                    <div className="mx-auto w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-white/10">
                        <Heart className="h-10 w-10 text-rose-500" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Your Collection</h1>
                    <p className="text-zinc-400 text-lg mb-12">
                        Save your most coveted pieces here. The wishlist functionality is arriving shortly.
                    </p>

                    <Link href="/shops">
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8">
                            Browse The Arcade
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
