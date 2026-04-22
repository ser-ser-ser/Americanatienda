import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Americana Stores',
        short_name: 'Americana',
        description: 'Elite Marketplace for Avant-Garde Artisans',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#ff007f',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
