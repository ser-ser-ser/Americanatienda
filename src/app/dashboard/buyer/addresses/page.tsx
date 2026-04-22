'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, MapPin, Trash2, Home, Briefcase, Star } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'

interface Address {
    id: string
    label: string
    street: string
    city: string
    state: string
    zip: string
    is_default: boolean
}

export default function BuyerAddressesPage() {
    const supabase = createClient()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form
    const [newAddress, setNewAddress] = useState({
        label: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        is_default: false
    })

    const fetchAddresses = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('user_addresses')
            .select('*')
            .order('is_default', { ascending: false })

        if (data) setAddresses(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleCreate = async () => {
        setSubmitting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('user_addresses')
                .insert([{
                    user_id: user.id,
                    ...newAddress
                }])

            if (error) throw error

            toast.success('Address added successfully')
            setIsOpen(false)
            fetchAddresses()
            // Reset form
            setNewAddress({ label: 'Home', street: '', city: '', state: '', zip: '', is_default: false })

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('user_addresses').delete().eq('id', id)
        if (!error) {
            toast.success('Address deleted')
            setAddresses(prev => prev.filter(a => a.id !== id))
        } else {
            toast.error(error.message)
        }
    }

    const handleSetDefault = async (id: string) => {
        const { error } = await supabase
            .from('user_addresses')
            .update({ is_default: true })
            .eq('id', id)

        if (!error) {
            toast.success('Default address updated')
            fetchAddresses() // Refresh to see reordering
        }
    }

    if (loading) return <div className="p-8 text-zinc-400">Loading addresses...</div>

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">My Addresses</h1>
                    <p className="text-zinc-400">Manage where you receive your orders.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black hover:bg-zinc-200">
                            <Plus className="mr-2 h-4 w-4" /> Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                                Enter your shipping details below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Label</Label>
                                <Input
                                    className="col-span-3 bg-black border-zinc-800"
                                    placeholder="Home, Work..."
                                    value={newAddress.label}
                                    onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Street</Label>
                                <Input
                                    className="col-span-3 bg-black border-zinc-800"
                                    placeholder="123 Main St"
                                    value={newAddress.street}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">City</Label>
                                <Input
                                    className="col-span-3 bg-black border-zinc-800"
                                    placeholder="Mexico City"
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">State</Label>
                                <Input
                                    className="col-span-3 bg-black border-zinc-800"
                                    placeholder="CDMX"
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">ZIP</Label>
                                <Input
                                    className="col-span-3 bg-black border-zinc-800"
                                    placeholder="00000"
                                    value={newAddress.zip}
                                    onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <Label>Set as Default</Label>
                                <input
                                    type="checkbox"
                                    checked={newAddress.is_default}
                                    onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                    className="h-4 w-4"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={submitting} onClick={handleCreate} className="bg-white text-black hover:bg-zinc-200">
                                {submitting ? 'Saving...' : 'Save Address'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {addresses.length === 0 ? (
                    <div className="col-span-full text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                        <MapPin className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400">No addresses found</h3>
                        <p className="text-zinc-500 mb-4">Add an address to speed up checkout.</p>
                        <Button variant="outline" onClick={() => setIsOpen(true)}>Add First Address</Button>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <Card key={addr.id} className="bg-zinc-900 border-zinc-800 relative group overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {addr.label.toLowerCase().includes('work') ? <Briefcase className="h-4 w-4 text-zinc-400" /> : <Home className="h-4 w-4 text-zinc-400" />}
                                        <CardTitle className="text-lg">{addr.label}</CardTitle>
                                    </div>
                                    {addr.is_default && (
                                        <Badge className="bg-pink-500/20 text-pink-500 hover:bg-pink-500/30 border-none">Default</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm text-zinc-400 space-y-1">
                                <p className="text-white font-medium">{addr.street}</p>
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                <p>Mexico</p>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!addr.is_default && (
                                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)} className="text-zinc-400 hover:text-white">
                                        Set Default
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-400 hover:bg-red-950/30">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
