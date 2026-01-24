import { NextResponse } from 'next/server'

/**
 * AI Content Generation Route
 * Mimics a high-end LLM for product copywriting
 */
export async function POST(req: Request) {
    try {
        const { product_name, attributes, niche } = await req.json()

        // In a real scenario, call OpenAI/Anthropic/Gemini here.
        // For this solidification phase, we use a sophisticated template engine 
        // to provide immediate "Editorial" value.

        const isSpanish = /[áéíóúüñ]/i.test(product_name + attributes) || /de|la|el|en|con/i.test(product_name)

        const englishPrompts = [
            `A master-crafted ${product_name} designed for the modern ${niche} landscape. Featuring ${attributes}, this piece evokes an aura of unapologetic sophistication.`,
            `The ${product_name} is more than just an item; it's a testament to the ${niche} ethos. Every detail, from the ${attributes} to its silhouette, speaks of avant-garde excellence.`,
            `Redefining ${niche} luxury. Our ${product_name} integrates ${attributes} into a seamless narrative of style and substance. Built for the visionary.`
        ]

        const spanishPrompts = [
            `Una pieza maestra: ${product_name}, diseñada para el panorama ${niche} contemporáneo. Con ${attributes}, esta obra evoca un aura de sofisticación absoluta.`,
            `${product_name} es más que un objeto; es un testimonio del ethos ${niche}. Cada detalle, desde ${attributes} hasta su silueta, habla de una excelencia vanguardista.`,
            `Redefiniendo el lujo ${niche}. Nuestro ${product_name} integra ${attributes} en una narrativa fluida de estilo y sustancia. Creado para el visionario.`
        ]

        const prompts = isSpanish ? spanishPrompts : englishPrompts
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

        const refined_title = isSpanish
            ? `Edición Limitada — ${product_name} Signature`
            : `Signature ${product_name} — Limited Edition`

        // Simulate network latency for "AI thinking"
        await new Promise(resolve => setTimeout(resolve, 800))

        return NextResponse.json({
            copy: randomPrompt,
            refined_title: refined_title
        })

    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate copy' }, { status: 500 })
    }
}
