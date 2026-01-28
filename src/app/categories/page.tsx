import { createClient } from '@/utils/supabase/server'
import CategoriesClient from './categories-client'
import { SiteFooter } from '@/components/site-footer'

export default async function CategoriesPage() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    let categories: any[] = []

    if (data) {
        categories = data.map(cat => ({
            label: cat.name,
            link: `/collections/${cat.slug}`,
            image: cat.image_url
        }))
    }

    return <CategoriesClient categories={categories} footer={<SiteFooter />} />
}
