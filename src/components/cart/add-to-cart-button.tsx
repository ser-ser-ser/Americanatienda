import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { toast } from 'sonner'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

interface AddToCartButtonProps {
    product: Product
    className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
    const { items, addItem, updateQuantity } = useCart()
    const cartItem = items.find(item => item.product.id === product.id)
    const quantity = cartItem?.quantity || 0

    const handleAddToCart = () => {
        addItem(product)
        toast.success("Added to cart", {
            description: `${product.name} has been added.`
        })
    }

    if (quantity > 0) {
        return (
            <div className={`flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-white/10 ${className}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-white min-w-[1.5rem] text-center">{quantity}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button onClick={handleAddToCart} size="lg" className={`bg-white text-black hover:bg-zinc-200 font-bold group ${className}`}>
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Add to Cart - ${Number(product.price).toFixed(2)}
        </Button>
    )
}
