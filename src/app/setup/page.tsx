'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SetupPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const createUsers = async () => {
        setLoading(true)
        try {
            // 1. Create Admin User
            const { data: adminAuth, error: adminError } = await supabase.auth.signUp({
                email: 'admin@americana.com',
                password: 'admin123',
                options: {
                    data: {
                        full_name: 'Americana Admin',
                        role: 'admin' // Attempting to set role in metadata first
                    }
                }
            })

            if (adminError) console.error('Admin creation error:', adminError.message)
            else console.log('Admin created:', adminAuth)

            // 2. Create Standard User
            const { data: userAuth, error: userError } = await supabase.auth.signUp({
                email: 'user@americana.com',
                password: 'user123',
                options: {
                    data: {
                        full_name: 'Test Customer',
                        role: 'customer'
                    }
                }
            })

            if (userError) console.error('User creation error:', userError.message)
            else console.log('User created:', userAuth)

            toast.success('Users creation process finished. Check console for details.')

        } catch (e: any) {
            toast.error('Error: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Dev Setup</CardTitle>
                    <CardDescription>Create test users for development</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800 text-sm font-mono text-zinc-400">
                        <p><strong>Admin:</strong> admin@americana.com / admin123</p>
                        <p><strong>User:</strong> user@americana.com / user123</p>
                    </div>
                    <Button onClick={createUsers} disabled={loading} className="w-full">
                        {loading ? 'Creating...' : 'Create Test Users'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
