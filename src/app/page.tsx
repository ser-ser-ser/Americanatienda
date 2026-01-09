
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Flame } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function Home() {
  const [storeType, setStoreType] = useState<'sex-shop' | 'smoke-shop'>('sex-shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [storeType]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', storeType)
        .order('name'); // Consistent ordering

      if (error) throw error;

      // Artificial delay for smooth UX transition feel (optional, but nice for demo)
      // await new Promise(resolve => setTimeout(resolve, 300));

      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  // Visual Theme Config
  const theme = {
    'sex-shop': {
      title: 'Sensual Collection',
      subtitle: 'Explore our curated selection of premium adult products.',
      bgGradient: 'from-pink-500 to-rose-600',
      textAccent: 'text-pink-600',
      buttonBg: 'bg-rose-50',
      icon: <ShoppingBag className="w-6 h-6" />,
      heroImagePattern: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)'
    },
    'smoke-shop': {
      title: 'Smoke & Vape Lounge',
      subtitle: 'Premium rolling papers, glassware, and accessories.',
      bgGradient: 'from-emerald-500 to-green-600',
      textAccent: 'text-emerald-600',
      buttonBg: 'bg-emerald-50',
      icon: <Flame className="w-6 h-6" />,
      heroImagePattern: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)'
    }
  };

  const currentTheme = theme[storeType];

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)] selection:bg-black selection:text-white">

      {/* Hero Section */}
      <div className={`relative w-full ${currentTheme.bgGradient} transition-colors duration-700 ease-in-out`}>
        <div className="absolute inset-0" style={{ backgroundImage: currentTheme.heroImagePattern }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-white/80 mb-2 font-medium tracking-wide text-sm uppercase">
                {currentTheme.icon}
                <span>Americanatienda Official</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
                {currentTheme.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                {currentTheme.subtitle}
              </p>
            </div>

            {/* Store Toggle - Pill Design */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full flex border border-white/20 self-start md:self-auto">
              <button
                onClick={() => setStoreType('sex-shop')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${storeType === 'sex-shop'
                    ? 'bg-white text-rose-600 shadow-lg scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                <ShoppingBag size={16} /> Sex Shop
              </button>
              <button
                onClick={() => setStoreType('smoke-shop')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${storeType === 'smoke-shop'
                    ? 'bg-white text-emerald-600 shadow-lg scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Flame size={16} /> Smoke Shop
              </button>
            </div>
          </div>
        </div>

        {/* Curvature Separator (Optional) */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-50 rounded-t-[50%] md:rounded-t-[30%] translate-y-1/2 scale-x-110"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 relative z-20">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <span className="text-sm text-gray-500 font-medium">{products.length > 0 ? `${products.length} Items` : ''}</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Skeleton Loaders */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-[320px] animate-pulse">
                <div className="h-[200px] bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Empty space filler if needed or "Coming Soon" card */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-6 rounded-full ${currentTheme.buttonBg} mb-4`}>
              {currentTheme.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              We couldn't find any products in this category right now. Check back soon for new inventory.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="font-semibold text-gray-900">Americanatienda</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
