export const tailwindBlocks = [
  {
    id: 'hero-noir',
    label: 'Hero Noir',
    category: 'Layout',
    content: `
      <section class="relative h-[80vh] flex items-center justify-center bg-black overflow-hidden font-sans">
        <div class="absolute inset-0 opacity-40">
          <div class="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black"></div>
          <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
        </div>
        <div class="relative z-10 text-center px-6 max-w-4xl">
          <h1 class="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 italic">
            Luxury <span class="text-[#ff007f]">Redefined</span>
          </h1>
          <p class="text-lg md:text-xl text-zinc-400 font-medium mb-8 max-w-2xl mx-auto uppercase tracking-widest">
            Curated selection of the finest underground culture and high-fashion artifacts.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" class="bg-[#ff007f] text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
              Shop Collection
            </a>
            <a href="#" class="border border-white/20 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-colors">
              Our Vision
            </a>
          </div>
        </div>
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="w-px h-12 bg-linear-to-b from-white to-transparent"></div>
        </div>
      </section>
    `,
  },
  {
    id: 'product-grid',
    label: 'Product Grid',
    category: 'Commerce',
    content: `
      <section class="py-24 bg-[#0a0a0a] font-sans">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 class="text-3xl font-black text-white uppercase tracking-tight mb-2">Featured Drops</h2>
              <p class="text-zinc-500 text-sm uppercase tracking-widest font-bold">Limited release availability</p>
            </div>
            <a href="#" class="text-[#ff007f] text-xs font-black uppercase tracking-widest hover:underline">View All</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Product Item -->
            <div class="group">
              <div class="aspect-4/5 bg-zinc-900 rounded-2xl overflow-hidden mb-4 border border-white/5 relative">
                <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute top-4 left-4">
                  <span class="bg-black text-white text-[10px] font-black uppercase px-2 py-1 rounded">New</span>
                </div>
              </div>
              <h3 class="text-white font-bold text-lg mb-1 group-hover:text-[#ff007f] transition-colors uppercase italic">Signature Noir Tee</h3>
              <p class="text-zinc-500 text-xs mb-3 font-bold uppercase tracking-wider">High Cotton Blend</p>
              <div class="flex justify-between items-center">
                <span class="text-white font-black text-lg">$125.00</span>
                <button class="text-[10px] font-black uppercase border-b-2 border-white text-white hover:text-[#ff007f] hover:border-[#ff007f] transition-all">Add to Cart</button>
              </div>
            </div>
            <!-- Product Item 2 -->
            <div class="group">
              <div class="aspect-4/5 bg-zinc-900 rounded-2xl overflow-hidden mb-4 border border-white/5 relative">
                <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 class="text-white font-bold text-lg mb-1 group-hover:text-[#ff007f] transition-colors uppercase italic">Americana Vest</h3>
              <p class="text-zinc-500 text-xs mb-3 font-bold uppercase tracking-wider">Outerwear Collection</p>
              <div class="flex justify-between items-center">
                <span class="text-white font-black text-lg">$340.00</span>
                <button class="text-[10px] font-black uppercase border-b-2 border-white text-white hover:text-[#ff007f] hover:border-[#ff007f] transition-all">Add to Cart</button>
              </div>
            </div>
            <!-- Product Item 3 -->
            <div class="group">
              <div class="aspect-4/5 bg-zinc-900 rounded-2xl overflow-hidden mb-4 border border-white/5 relative">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute top-4 left-4">
                  <span class="bg-[#ff007f] text-white text-[10px] font-black uppercase px-2 py-1 rounded">Sale</span>
                </div>
              </div>
              <h3 class="text-white font-bold text-lg mb-1 group-hover:text-[#ff007f] transition-colors uppercase italic">Vantage Runner</h3>
              <p class="text-zinc-500 text-xs mb-3 font-bold uppercase tracking-wider">Footwear Essentials</p>
              <div class="flex justify-between items-center">
                <span class="text-white font-black text-lg">$195.00</span>
                <button class="text-[10px] font-black uppercase border-b-2 border-white text-white hover:text-[#ff007f] hover:border-[#ff007f] transition-all">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'footer-noir',
    label: 'Footer Noir',
    category: 'Layout',
    content: `
      <footer class="bg-black py-20 font-sans border-t border-white/5">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic mb-6">Americana <span class="text-[#ff007f]">Tienda</span></h2>
            <p class="text-zinc-500 max-w-sm mb-8 font-medium">Elevating culture through curated commerce. Join the movement and experience the next generation of retail.</p>
            <div class="flex gap-4 justify-center md:justify-start">
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff007f] hover:border-[#ff007f] transition-all"><i class="fab fa-instagram text-white"></i></a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff007f] hover:border-[#ff007f] transition-all"><i class="fab fa-twitter text-white"></i></a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff007f] hover:border-[#ff007f] transition-all"><i class="fab fa-tiktok text-white"></i></a>
            </div>
          </div>
          <div>
            <h4 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-l-2 border-[#ff007f] pl-4">Navigation</h4>
            <ul class="space-y-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <li><a href="#" class="hover:text-white transition-colors">Shop All</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Journal</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-l-2 border-[#ff007f] pl-4">Legal</h4>
            <ul class="space-y-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest">&copy; 2026 AMERICANA MARKETPLACE OS. ALL RIGHTS RESERVED.</p>
          <div class="flex gap-6 opacity-30 grayscale contrast-125">
             <span class="text-[10px] font-black text-white">STRIPE</span>
             <span class="text-[10px] font-black text-white">MERCADO PAGO</span>
             <span class="text-[10px] font-black text-white">BITSO</span>
          </div>
        </div>
      </footer>
    `,
  },
  {
    id: 'newsletter-noir',
    label: 'Newsletter Noir',
    category: 'Marketing',
    content: `
      <section class="py-24 bg-[#ff007f] font-sans overflow-hidden relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">Join the Inner Circle</h2>
          <p class="text-white/80 text-lg mb-10 font-medium">Get early access to drops, secret curated playlists, and exclusive community events.</p>
          <form class="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto bg-black p-1.5 rounded-full overflow-hidden shadow-2xl">
            <input type="email" placeholder="ENTER YOUR EMAIL" class="flex-1 bg-transparent text-white px-6 py-4 outline-none text-xs font-black tracking-widest placeholder:text-zinc-600" />
            <button class="bg-[#ff007f] text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
              Subscribe
            </button>
          </form>
          <p class="text-[10px] text-white/50 mt-6 font-bold uppercase tracking-widest">No spam. Only high-frequency signals.</p>
        </div>
      </section>
    `,
  }
];
