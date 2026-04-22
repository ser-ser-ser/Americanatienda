'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SeedPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const seedUsers = async () => {
        setLoading(true)
        try {
            // 1. Create Seller
            const emailSeller = 'seller@demo.com'
            const pass = 'password123'

            const { data: sellerAuth, error: sellerErr } = await supabase.auth.signUp({
                email: emailSeller,
                password: pass,
                options: {
                    data: { full_name: 'Demo Seller' }
                }
            })

            if (sellerAuth.user) {
                // Update profile to role 'seller' (Use api or rls policy allowing self update?)
                // Assuming profiles exists
                await supabase.from('profiles').update({ role: 'seller' }).eq('id', sellerAuth.user.id)
                toast.success('Seller Created: seller@demo.com')
            }

            // 2. Create Buyer
            const emailBuyer = 'buyer@demo.com'
            const { data: buyerAuth } = await supabase.auth.signUp({
                email: emailBuyer,
                password: pass,
                options: {
                    data: { full_name: 'Demo Buyer' }
                }
            })

            if (buyerAuth.user) {
                await supabase.from('profiles').update({ role: 'buyer' }).eq('id', buyerAuth.user.id)
                toast.success('Buyer Created: buyer@demo.com')
            }

        } catch (e) {
            console.error(e)
            toast.error('Error seeding')
        }
        setLoading(false)
    }

    return (
        <div className="p-10 bg-black text-white min-h-screen">
            <h1 className="text-3xl mb-4">Seed Data</h1>
            <Button onClick={seedUsers} disabled={loading}>
                {loading ? 'Creating...' : 'Create Demo Users'}
            </Button>
            <div className="mt-4">
                <p>Seller: seller@demo.com / password123</p>
                <p>Buyer: buyer@demo.com / password123</p>
            </div>
        </div>
    )
}
