import { createClient } from '@supabase/supabase-js'
import VisionaryClient from './client'

export async function generateStaticParams() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: stores } = await supabase.from('stores').select('slug')
    return stores?.map(({ slug }) => ({ slug })) || []
}

export default function VisionaryPage() {
    return <VisionaryClient />
}
