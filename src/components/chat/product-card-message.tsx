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
    storeSlug?: string
}

export function ProductCardMessage({ id, name, price, imageUrl, slug, storeSlug }: ProductCardMessageProps) {
    const safePrice = typeof price === 'number' ? price : Number(price)
    const displayPrice = !isNaN(safePrice) ? `$${safePrice.toFixed(2)}` : 'Consultar Precio'

    // Fallback: If no storeSlug provided, try to rely on just product ID if possible, 
    // or arguably we should just link to /product/id if that route exists. 
    // Ideally we always have the store slug.
    const productUrl = storeSlug && slug
        ? `/shops/${storeSlug}/product/${slug}`
        : `/product/${id}` // Fallback route

    return (
        <Card className="w-full max-w-[280px] bg-zinc-900 border-white/10 overflow-hidden group shadow-xl">
            <div className="relative aspect-square">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 uppercase font-bold">
                        Sin Imagen
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                        {displayPrice}
                    </div>
                </div>
            </div>
            <div className="p-3">
                <h4 className="font-bold text-sm text-white leading-tight mb-2 line-clamp-2">{name || 'Producto Desconocido'}</h4>
                <Button asChild size="sm" className="w-full bg-white/5 hover:bg-white hover:text-black text-xs h-8 border border-white/10">
                    <Link href={productUrl}>
                        Ver Detalles <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                </Button>
            </div>
        </Card>
    )
}
