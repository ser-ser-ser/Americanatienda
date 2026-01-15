import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
            <div className="max-w-2xl w-full text-center">
                <div className="mx-auto w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-white/10">
                    <Heart className="h-10 w-10 text-rose-500" />
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Your Collection</h1>
                <p className="text-zinc-400 text-lg mb-12">
                    Save your most coveted pieces here. The wishlist functionality is arriving shortly.
                </p>

                <Link href="/">
                    <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8">
                        Continue Exploring
                    </Button>
                </Link>
            </div>
        </div>
    )
}
