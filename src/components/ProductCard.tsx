
import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Check, Shield, Zap, Wind, MessageSquare } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useChat } from '@/providers/chat-provider';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    storeSlug: string;
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
    const { items, addItem, updateQuantity, toggleCart } = useCart();
    const { startInquiryChat } = useChat();
    const isSexShop = product.store_type === 'sex-shop';
    const isSmokeShop = product.store_type === 'smoke-shop';

    const cartItem = items.find(i => i.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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

    return (
        <Link href={`/shops/${storeSlug}/product/${product.slug}`} className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer block">

            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
                {(product.images?.[0] || product.image_url) ? (
                    <Image
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500 will-change-transform"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gray-50">
                        <ShoppingCart size={48} strokeWidth={1} />
                        <span className="text-xs mt-2 uppercase tracking-wider font-medium">No Image</span>
                    </div>
                )}

                {/* Quick Add Overlay for mobile/hover feedback */}
                {quantity === 0 && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-all"
                        >
                            + Agregar
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Badges / Specific Features */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isSexShop ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {isSexShop ? 'Adult' : 'Smoke'}
                    </span>

                    {/* Sex Shop Specifics */}
                    {isSexShop && product.details_sex_shop?.body_safe && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider" title="Body Safe Material">
                            <Shield size={10} /> Body Safe
                        </span>
                    )}
                </div>

                <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]" title={product.name}>
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Price</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">${Number(product.price).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleMessageSeller}
                            title="Message Seller"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 active:scale-95 transition-all z-10 relative"
                        >
                            <MessageSquare size={18} />
                        </button>

                        {quantity > 0 ? (
                            <div className="flex items-center bg-black rounded-full h-10 px-1 gap-3 shadow-lg z-10 relative">
                                <button
                                    onClick={handleDecrement}
                                    className="w-8 h-8 flex items-center justify-center text-white hover:text-zinc-300 transition-colors"
                                >
                                    <span className="text-xl font-bold">−</span>
                                </button>
                                <span className="text-white font-bold text-sm min-w-[1ch] text-center">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-8 h-8 flex items-center justify-center text-white hover:text-zinc-300 transition-colors"
                                >
                                    <span className="text-xl font-bold">+</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                title="Add to Cart"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 active:scale-95 transition-all shadow-md group-hover:shadow-lg z-10 relative"
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
