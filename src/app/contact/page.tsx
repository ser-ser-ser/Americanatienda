'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Footer } from '@/components/footer'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert({
                    name,
                    email,
                    message
                })

            if (error) throw error

            toast.success("Message sent successfully!")
            setName('')
            setEmail('')
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error("Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" /> Back to Home
                    </Link>
                    <span className="text-xl font-serif font-bold tracking-tighter">AMERICANA</span>
                    <div className="w-24" />
                </div>
            </header>

            <main className="pt-32 pb-24 container mx-auto px-6 flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">Contact Us</h1>
                        <p className="text-zinc-400">Have questions or inquiries? Reach out directly.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="bg-black/50 border-zinc-800 focus:border-white/20 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="bg-black/50 border-zinc-800 focus:border-white/20 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help?"
                                required
                                className="min-h-[150px] bg-black/50 border-zinc-800 focus:border-white/20 transition-colors"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Message
                        </Button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
