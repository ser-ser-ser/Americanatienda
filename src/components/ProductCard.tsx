
import React from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    // Determine accent color-ish based on category for subtle hints (optional, strictly visual)
    // But for now we stick to a clean white card.

    return (
        <div className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

            {/* Image Container - Aspect Square or 4:3 */}
            <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
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

                {/* Quick Add Overlay (Optional future feature, purely visual now) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    {/* Space for future quick actions */}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                        {product.category.replace('-', ' ')}
                    </span>
                </div>

                <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]" title={product.name}>
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Price</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
                    </div>

                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 active:scale-95 transition-all shadow-md group-hover:shadow-lg">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
