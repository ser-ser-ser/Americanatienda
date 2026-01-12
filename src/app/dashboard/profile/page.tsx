'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, Package } from 'lucide-react'

export default function BuyerProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [email, setEmail] = useState('')

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
            }
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-primary">
                    <User className="h-10 w-10" />
                </div>

                <h1 className="text-2xl font-serif font-bold mb-2">Welcome Back</h1>
                <p className="text-zinc-400 mb-8">{email}</p>

                <div className="space-y-4">
                    <Link href="/">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200">
                            Continue Shopping
                        </Button>
                    </Link>

                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800" disabled>
                        <Package className="mr-2 h-4 w-4" /> My Orders (Coming Soon)
                    </Button>

                    <Button onClick={handleSignOut} variant="ghost" className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </div>
        </div>
    )
}
