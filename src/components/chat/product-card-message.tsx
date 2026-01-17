import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag } from 'lucide-react'

interface ProductCardMessageProps {
    id: string
    name: string
    price: number
    imageUrl: string
    slug?: string
}

export function ProductCardMessage({ id, name, price, imageUrl, slug }: ProductCardMessageProps) {
    return (
        <Card className="w-64 bg-zinc-900 border-white/10 overflow-hidden group">
            <div className="relative aspect-square">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                        ${price.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className="p-3">
                <h4 className="font-bold text-sm text-white leading-tight mb-2 line-clamp-2">{name}</h4>
                <Button asChild size="sm" className="w-full bg-white/5 hover:bg-white hover:text-black text-xs h-8 border border-white/10">
                    <Link href={`/product/${id}`}> {/* Fallback to ID if no slug, ideally use slug */}
                        View Details <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                </Button>
            </div>
        </Card>
    )
}
