
'use client'

import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { toast } from 'sonner' // Optional: if installed, otherwise simple alert or just context action

interface AddToCartButtonProps {
    product: Product
    className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
    const { addItem } = useCart()

    const handleAddToCart = () => {
        addItem(product)
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`
        })
    }

    return (
        <Button onClick={handleAddToCart} size="lg" className={className}>
            Add to Cart - ${product.price}
        </Button>
    )
}
