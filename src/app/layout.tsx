import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { ChatProvider } from "@/providers/chat-provider";
import { NotificationProvider } from '@/providers/notification-provider'
import { ChatSheet } from "@/components/chat/chat-sheet";
// Removed FloatingChatButton - using inline chat buttons instead
import { CartSheet } from "@/components/cart/cart-sheet";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    let siteContent: Record<string, string> = {}

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/site_content?select=key,value`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            },
            next: { revalidate: 60 } // Revalidate every 60s (or build time cache)
        })
        const data = await res.json()
        if (Array.isArray(data)) {
            siteContent = data.reduce((acc: any, item: any) => {
                acc[item.key] = item.value
                return acc
            }, {})
        }
    } catch (e) {
        console.error('Metadata fetch failed', e)
    }

    const title = siteContent['home_hero_title'] ? `${siteContent['home_hero_title']} | Americana Stores` : 'Americana Stores'
    const description = siteContent['home_hero_description'] || "Premier Online Marketplace. Discover exclusive products from The Red Room, The Lounge, and more."
    const favicon = siteContent['branding_favicon'] || '/globe.svg'
    const ogImage = siteContent['branding_og_image'] || '/opengraph-image.png'

    return {
        title: {
            template: '%s | Americana Stores',
            default: siteContent['home_hero_title'] || 'Americana Stores',
        },
        description,
        metadataBase: new URL('https://americanastores.com'),
        icons: {
            icon: favicon,
            shortcut: favicon,
            apple: favicon, // reusing same for apple unless specific key added later
        },
        openGraph: {
            title: siteContent['home_hero_title'] || "Americana Stores",
            description,
            url: 'https://americanastores.com',
            siteName: 'Americana Stores',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: 'Americana Stores Preview',
                },
            ],
            locale: 'es_MX',
            type: 'website',
        },
        category: 'e-commerce',
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
                suppressHydrationWarning
            >
                <CartProvider>
                    <ChatProvider>
                        <NotificationProvider>
                            {children}
                            <CartSheet />
                            <ChatSheet />
                            <Toaster />
                        </NotificationProvider>
                    </ChatProvider>
                </CartProvider>
            </body>
        </html>
    );
}
