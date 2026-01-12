import { createClient } from '@supabase/supabase-js'
import StorefrontClient from './StorefrontClient'

// Required for static export
export async function generateStaticParams() {
    // We use a direct client here for build-time generation
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: stores } = await supabase.from('stores').select('slug')
    return stores?.map(({ slug }) => ({ slug })) || []
}

export default function StorefrontPage() {
    return <StorefrontClient />
}
