
'use client'

import { useCart } from '@/context/cart-context'
import { useChat } from '@/providers/chat-provider'
import Link from 'next/link'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet'
import { CartItem } from './cart-item'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, MessageSquare } from 'lucide-react'

export function CartSheet() {
    const { items, isOpen, toggleCart, cartTotal } = useCart()
    const { openContextualChat, setIsOpen: setChatOpen } = useChat()

    const handleContactVendor = async () => {
        if (items.length === 0) return

        const firstItem = items[0]
        const storeId = firstItem.product.store_id
        if (!storeId) return

        // Close cart and open chat
        toggleCart()

        // Define participants (buyer and store owner)
        // Note: openContextualChat handles finding the store owner if needed, 
        // but here we just pass the store's reference.
        // Actually, openContextualChat takes participants as argument.
        // We might need to fetch the store owner ID first if not available in product.

        await openContextualChat('order', 'cart_inquiry', [], {
            title: 'Inquiry about my Cart',
            store_id: storeId,
            items: items.map(i => ({ name: i.product.name, qty: i.quantity }))
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="w-full sm:max-w-md border-l border-zinc-800 bg-black text-white p-0 flex flex-col">
                <SheetHeader className="px-6 py-4 border-b border-zinc-800">
                    <SheetTitle className="text-white flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Shopping Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
                            <ShoppingBag className="h-16 w-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <Button variant="outline" className="border-zinc-700 text-white" onClick={toggleCart}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {items.map((item) => (
                                <CartItem key={item.product.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-base font-medium text-white">
                                <span>Subtotal</span>
                                <span>$ {cartTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full border-zinc-700 text-white hover:bg-zinc-800 rounded-full h-12"
                                    onClick={handleContactVendor}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Contact Vendor
                                </Button>
                                <SheetClose asChild>
                                    <Link href="/checkout" className="w-full">
                                        <Button className="w-full bg-white text-black hover:bg-zinc-200 h-12 text-lg font-bold rounded-full">
                                            Checkout
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
