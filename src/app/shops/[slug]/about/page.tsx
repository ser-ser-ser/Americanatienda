import { createClient } from '@/utils/supabase/client'
import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreFooter } from '@/components/storefront/StoreFooter'

export default async function StoreAboutPage({ params }: { params: { slug: string } }) {
    const supabase = createClient()

    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!store) return <div>Store not found</div>

    const themeColor = store.theme_color || '#000000'

    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <StoreHeader store={store} themeColor={themeColor} />

            <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Image / Branding */}
                    <div className="w-full md:w-1/2 aspect-square relative bg-zinc-100 rounded-2xl overflow-hidden">
                        {store.logo_url ? (
                            <img
                                src={store.logo_url}
                                alt={store.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 font-serif text-4xl">
                                {store.name[0]}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">About The Brand</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-black mb-6">{store.name}</h1>
                            <div className="prose prose-zinc prose-lg text-zinc-600 font-light leading-relaxed">
                                <p>
                                    {store.description || "Welcome to our store. We are dedicated to providing the best products and service."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-zinc-100 pt-8">
                            <div>
                                <h3 className="font-bold text-sm mb-2">Location</h3>
                                <p className="text-zinc-500 text-sm">
                                    {store.city || 'Online Store'}<br />
                                    {store.state}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm mb-2">Contact</h3>
                                <p className="text-zinc-500 text-sm">
                                    {store.email || 'Contact via Chat'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <StoreFooter store={store} themeColor={themeColor} />
        </div>
    )
}
