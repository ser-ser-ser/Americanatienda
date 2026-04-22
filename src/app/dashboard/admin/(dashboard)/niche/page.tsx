'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tag } from 'lucide-react'

export default function NichePage() {
    return (
        <div className="p-8 space-y-8 bg-black text-white min-h-screen">
            <div>
                <h1 className="text-3xl font-bold font-serif mb-2">Niche Management</h1>
                <p className="text-zinc-400">Define specific market niches and sub-cultures.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Tag className="h-5 w-5 text-pink-500" /> Active Niches
                    </CardTitle>
                    <CardDescription>Micro-categories for targeted audiences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-zinc-500 text-sm">
                        System automatically detects:
                        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                            <li>Luxury Fetish</li>
                            <li>Streetwear</li>
                            <li>Vintage Vinyl</li>
                            <li>Artisan Crafts</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
