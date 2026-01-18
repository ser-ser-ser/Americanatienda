import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // check admin permission (optional strictly here if middleware handles it, but good practice)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('site_content')
        .select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform array to object for easier frontend consumption { key: value }
    const contentMap = data.reduce((acc: any, item: any) => {
        acc[item.key] = item.value
        return acc
    }, {})

    return NextResponse.json(contentMap)
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Expects json body: { updates: [ { key: 'home_hero_title', value: '...' }, ... ] }
    const body = await request.json()
    const { updates } = body

    if (!updates || !Array.isArray(updates)) {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    // Upsert items
    const { error } = await supabase
        .from('site_content')
        .upsert(updates, { onConflict: 'key' })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
