'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Shield, MessageSquare, Plus, Minus, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useChat } from '@/providers/chat-provider';
import { toast } from 'sonner';

interface DarkProductCardProps {
    product: Product;
    storeSlug: string;
}

export function DarkProductCard({ product, storeSlug }: DarkProductCardProps) {
    const { items, addItem, updateQuantity } = useCart();
    const { startInquiryChat } = useChat();
    const isSexShop = product.store_type === 'sex-shop';
    const isSmokeShop = product.store_type === 'smoke-shop';

    const cartItem = items.find(i => i.product.id === product.id);
    const quantity = cartItem?.quantity || 0;
    const stock = product.stock ?? 0; // Default to 0 if undefined, assuming strict stock management if needed, or maybe large number? 
    // Wait, if stock is meant to be optional and treated as infinite if missing? 
    // The user asked to "connect the stock". 
    // Let's assume if stock is defined, we use it. If not, maybe treat as available?
    // MinimalProductCard logic: (product.stock || 0).
    const maxStock = product.stock;
    const isOutOfStock = maxStock !== undefined && maxStock <= 0;
    const isLowStock = maxStock !== undefined && maxStock > 0 && maxStock < 5;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        if (maxStock !== undefined && quantity >= maxStock) {
            toast.error('No more stock available');
            return;
        }

        addItem(product);
        toast.success('Added to cart');
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (maxStock !== undefined && quantity >= maxStock) {
            toast.error('No more stock available');
            return;
        }
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, quantity - 1);
    };

    const handleMessageSeller = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        startInquiryChat(product.store_id, product.id);
    };

    const productUrl = `/shops/${storeSlug}/product/${product.slug || product.id}`;

    return (
        <Link href={productUrl} className={`group flex flex-col bg-zinc-900/50 rounded-xl border border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-sm ${isOutOfStock ? 'opacity-75' : ''}`}>

            {/* Image Container */}
            <div className="relative aspect-4/3 w-full bg-zinc-800 overflow-hidden">
                {(product.images?.[0] || product.image_url) ? (
                    <Image
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        fill
                        className={`object-cover object-center group-hover:scale-110 transition-transform duration-500 will-change-transform ${isOutOfStock ? 'grayscale' : ''}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 bg-zinc-900">
                        <ShoppingCart size={48} strokeWidth={1} />
                        <span className="text-xs mt-2 uppercase tracking-wider font-medium">No Image</span>
                    </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {isOutOfStock && (
                        <span className="px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded">
                            Sold Out
                        </span>
                    )}
                    {isLowStock && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 rounded flex items-center gap-1">
                            <AlertTriangle size={10} /> Low Stock
                        </span>
                    )}
                </div>

                {/* Quick Add Overlay */}
                {!isOutOfStock && quantity === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleAddToCart}
                            className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:bg-zinc-200"
                        >
                            + Add
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isSexShop ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {isSexShop ? 'Adult' : 'Smoke'}
                    </span>

                    {isSexShop && product.details_sex_shop?.body_safe && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                            <Shield size={10} /> Body Safe
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-start mb-2 h-14">
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-white line-clamp-2 hover:text-zinc-300 transition-colors" title={product.name}>
                            {product.name}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                        <span className="font-bold text-sm text-white">${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 min-h-10 mb-3">{product.description}</p>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 font-medium">Price</span>
                        <span className="text-xl font-bold text-white tracking-tight">${Number(product.price).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleMessageSeller}
                            title="Message Seller"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white active:scale-95 transition-all z-10 relative"
                        >
                            <MessageSquare size={18} />
                        </button>

                        {quantity > 0 && !isOutOfStock ? (
                            <div className="flex items-center bg-white rounded-full h-10 px-1 gap-3 shadow-lg z-10 relative text-black">
                                <button
                                    onClick={handleDecrement}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 rounded-full transition-colors"
                                >
                                    <Minus size={16} strokeWidth={3} />
                                </button>
                                <span className="font-bold text-sm min-w-[1ch] text-center">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 rounded-full transition-colors"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                className={`flex items-center justify-center w-10 h-10 rounded-full z-10 relative transition-all shadow-md group-hover:shadow-lg ${isOutOfStock ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 active:scale-95'}`}
                            >
                                <ShoppingCart size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
