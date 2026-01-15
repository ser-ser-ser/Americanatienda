
'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Product } from '@/types'

export interface CartItem {
    product: Product
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    isOpen: boolean
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    toggleCart: () => void
    clearCart: () => void
    cartTotal: number
    cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('americana_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('americana_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = useCallback((product: Product) => {
        setItems((currentItems) => {
            // Check for store mismatch
            if (currentItems.length > 0) {
                const currentStoreId = currentItems[0].product.store_id
                if (currentStoreId && product.store_id && currentStoreId !== product.store_id) {
                    const confirmClear = window.confirm(
                        "You can only purchase from one store at a time. Clear current cart to add this item?"
                    )
                    if (confirmClear) {
                        return [{ product, quantity: 1 }]
                    }
                    return currentItems
                }
            }

            const existingItem = currentItems.find((item) => item.product.id === product.id)
            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...currentItems, { product, quantity: 1 }]
        })
        setIsOpen(true) // Open cart when adding item
    }, [])

    const removeItem = useCallback((productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
    }, [])

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) {
            setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
            return
        }
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )
    }, [])

    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])
    const clearCart = useCallback(() => setItems([]), [])


    const cartTotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0)

    // Prevent hydration mismatch by not rendering until loaded (or just render children)
    // Actually, for a cart badge it's better to render "0" then update, or render nothing.
    // simpler: just render. hydration mismatch might occur if purely relying on localStorage for initial render.
    // To handle hydration: items starts empty, effect loads it. 

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                addItem,
                removeItem,
                updateQuantity,
                toggleCart,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
