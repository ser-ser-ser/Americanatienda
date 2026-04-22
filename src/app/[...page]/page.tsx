import { builder } from '@builder.io/sdk'
import { RenderBuilderContent } from '@/components/builder/builder-content'
import { Metadata } from 'next'

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_PUBLIC_API_KEY')

interface PageProps {
    params: {
        page: string[]
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const pagePath = '/' + (resolvedParams.page?.join('/') || '')
    const content = await builder
        .get('page', {
            userAttributes: {
                urlPath: pagePath,
            },
        })
        .toPromise()

    return {
        title: content?.data?.title || 'Americana Tienda',
        description: content?.data?.description || 'The future of commerce.',
    }
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    const pagePath = '/' + (resolvedParams.page?.join('/') || '')
    const content = await builder
        .get('page', {
            userAttributes: {
                urlPath: pagePath,
            },
        })
        .toPromise()

    return (
        <>
            <RenderBuilderContent content={content} model="page" />
        </>
    )
}
