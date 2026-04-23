'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Trash2, Shield, Settings as SettingsIcon, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useVendor } from '@/providers/vendor-provider'

export default function VendorSettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const { activeStore, isLoading } = useVendor()

    const [deleting, setDeleting] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState('')
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) setUserEmail(user.email)
        }
        fetchUser()
    }, [])

    const handleDeleteStore = async () => {
        if (!activeStore || deleteConfirm !== activeStore.name) return
        setDeleting(true)
        try {
            const sid = activeStore.id
            const convIds = (await supabase.from('conversations').select('id').eq('store_id', sid)).data?.map((c: any) => c.id) || []
            if (convIds.length > 0) await supabase.from('messages').delete().in('conversation_id', convIds)
            await supabase.from('conversations').delete().eq('store_id', sid)
            const orderIds = (await supabase.from('orders').select('id').eq('store_id', sid)).data?.map((o: any) => o.id) || []
            if (orderIds.length > 0) await supabase.from('order_items').delete().in('order_id', orderIds)
            await supabase.from('orders').delete().eq('store_id', sid)
            await supabase.from('products').delete().eq('store_id', sid)
            const { error } = await supabase.from('stores').delete().eq('id', sid)
            if (error) throw error
            toast.success('Tienda eliminada correctamente.')
            router.replace('/dashboard/vendor/setup')
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar la tienda')
        } finally {
            setDeleting(false)
        }
    }

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin mr-2" /> Loading Settings...</div>

    if (!activeStore) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">No store selected.</div>

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-3xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><SettingsIcon className="h-8 w-8 text-zinc-400" /> Account Settings</h1>
                    <p className="text-zinc-500 mt-2">Manage security, credentials, and dangerous actions.</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-500" /> Security & Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Account Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input disabled value={userEmail} className="bg-zinc-950/50 border-zinc-800 pl-9 text-zinc-400 cursor-not-allowed" />
                            </div>
                            <p className="text-xs text-zinc-500">Contact support to change your primary associated email address.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* DANGER ZONE */}
                <div className="border border-red-900/40 rounded-2xl p-8 bg-red-950/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Trash2 className="h-5 w-5 text-red-500" />
                        <div>
                            <h3 className="text-lg font-bold text-red-500">Zona de Peligro</h3>
                            <p className="text-xs text-zinc-500">Esta acción es permanente e irreversible.</p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6">
                        Al eliminar tu tienda se borrarán todos los productos, órdenes, conversaciones e imágenes asociadas.
                        Escribe el nombre exacto de tu tienda para confirmar:
                        <span className="font-bold text-white ml-1">{activeStore.name}</span>
                    </p>
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            placeholder={`Escribe "${activeStore.name}"`}
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="flex-1 bg-black border border-red-900/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
                        />
                        <Button
                            variant="destructive"
                            disabled={deleteConfirm !== activeStore.name || deleting}
                            onClick={handleDeleteStore}
                            className="bg-red-700 hover:bg-red-600 font-bold uppercase tracking-wider min-w-[160px]"
                        >
                            {deleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            {deleting ? 'Eliminando...' : 'Eliminar Tienda'}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
