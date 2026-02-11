
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

    const productUrl = `/shops/${storeSlug}/product/${product.slug || product.id}`;

    return (
        <Link href={productUrl} className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">

            {/* Image Container */}
            <div className="relative aspect-4/3 w-full bg-gray-50 overflow-hidden">
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
                    <div className="absolute inset-0 bg-zinc-100/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* RESTORED ORIGINAL OVERLAY LOGIC (Simplified as the aspect-4/3 fix in previous turn might have broken layout) */}
                        {/* The user provided aspect-4/3 replacement for the overlay div which was WRONG in previous turn (it was absolute inset-0). Changing it back to absolute inset-0 but keeping structure */}
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-all shadow-xl"
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

                <div className="flex justify-between items-start mb-2 h-14">
                    <Link href={productUrl} className="flex-1">
                        <h3 className="font-semibold text-sm text-zinc-900 line-clamp-2 hover:underline decoration-zinc-400 underline-offset-2 transition-all" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                        <span className="font-bold text-sm text-zinc-900">${product.price.toFixed(2)}</span>
                    </div>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 min-h-10 mb-3">{product.description}</p>

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
