'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Users,
    Shield,
    Plus,
    Search,
    MoreHorizontal,
    Store,
    Trash2,
    Mail,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function StoreTeamsPage() {
    const supabase = createClient()
    const [stores, setStores] = useState<any[]>([])
    const [selectedStore, setSelectedStore] = useState<string | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('admin')
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    // Fetch Stores
    useEffect(() => {
        const fetchStores = async () => {
            const { data, error } = await supabase
                .from('stores')
                .select('id, name, logo_url, owner_id')
                .order('name')

            if (data) {
                setStores(data)
                if (data.length > 0 && !selectedStore) {
                    setSelectedStore(data[0].id)
                }
            }
            setLoading(false)
        }
        fetchStores()
    }, [])

    // Fetch Members when Selected Store Changes
    useEffect(() => {
        if (!selectedStore) return

        const fetchMembers = async () => {
            // Join store_members with profiles to get names/emails
            const { data, error } = await supabase
                .from('store_members')
                .select(`
                    id,
                    role,
                    created_at,
                    user:profiles!inner(id, full_name, username, avatar_url, email)
                `)
                .eq('store_id', selectedStore)

            if (data) setMembers(data)
            else setMembers([])
        }

        // Also fetch the owner details separately to display them
        fetchMembers()
    }, [selectedStore])

    const handleInvite = async () => {
        if (!inviteEmail || !selectedStore) return

        try {
            // 1. Find User by Email (This usually requires a secure RPC or Admin Client, 
            // but for now we'll assume we can search profiles or use a workaround if RLS blocks email search)
            // NOTE: Standard RLS often hides emails. We might need an Edge Function for this.
            // For this UI demo, we'll try a direct query assuming 'profiles' might be readable for admins.

            const { data: userFiles, error: searchError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('email', inviteEmail)
                .single()

            if (searchError || !userFiles) {
                toast.error('User not found. They must be registered on Americana first.')
                return
            }

            // 2. Insert into store_members
            const { error: insertError } = await supabase
                .from('store_members')
                .insert({
                    store_id: selectedStore,
                    user_id: userFiles.id,
                    role: inviteRole
                })

            if (insertError) {
                if (insertError.code === '23505') toast.error('User is already a team member.')
                else toast.error('Failed to add member.')
                console.error(insertError)
            } else {
                toast.success(`Access granted to ${inviteEmail}`)
                setIsInviteOpen(false)
                setInviteEmail('')
                // Trigger refresh
                const { data } = await supabase.from('store_members').select('id, role, created_at, user:profiles!inner(id, full_name, email)').eq('store_id', selectedStore)
                if (data) setMembers(data)
            }

        } catch (e) {
            console.error(e)
            toast.error('An unexpected error occurred')
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        const { error } = await supabase.from('store_members').delete().eq('id', memberId)
        if (!error) {
            toast.success('Member removed')
            setMembers(members.filter(m => m.id !== memberId))
        }
    }

    if (loading) return <div className="p-8 text-zinc-500">Loading Configuration...</div>

    const activeStoreData = stores.find(s => s.id === selectedStore)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-cyan-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">Security & Access</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Store Team Delegation</h1>
                        <p className="text-zinc-500 mt-1">Assign trusted managers to specific storefronts without sharing credentials.</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">

                    {/* Left: Store Selector */}
                    <div className="col-span-12 md:col-span-4 space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Select Storefront</div>
                        <div className="space-y-2">
                            {stores.map(store => (
                                <div
                                    key={store.id}
                                    onClick={() => setSelectedStore(store.id)}
                                    className={`
                                        p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                                        ${selectedStore === store.id
                                            ? 'bg-[#161616] border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            : 'bg-black border-zinc-800 hover:border-zinc-700 hover:bg-[#111]'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {store.logo_url ? (
                                            <img src={store.logo_url} className="h-10 w-10 rounded-lg object-cover bg-zinc-800" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                <Store className="h-5 w-5" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-sm text-white">{store.name}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">ID: {store.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                    {selectedStore === store.id && (
                                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Members List */}
                    <div className="col-span-12 md:col-span-8">
                        <Card className="bg-[#111] border-zinc-800 h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
                                <div>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        {activeStoreData?.name} <span className="text-zinc-600">/</span> Team
                                    </CardTitle>
                                    <CardDescription>Manage access levels for this store.</CardDescription>
                                </div>
                                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider">
                                            <Plus className="mr-2 h-4 w-4" /> Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#161616] border-zinc-800 text-white">
                                        <DialogHeader>
                                            <DialogTitle>Grant Store Access</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>User Email</Label>
                                                <Input
                                                    placeholder="colleague@example.com"
                                                    className="bg-black border-zinc-700 focus:border-cyan-500"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                />
                                                <p className="text-[10px] text-zinc-500">User must already have an Americana account.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role Permission</Label>
                                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                                    <SelectTrigger className="bg-black border-zinc-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#161616] border-zinc-700 text-white">
                                                        <SelectItem value="admin">Store Admin (Full Edit Access)</SelectItem>
                                                        <SelectItem value="manager">Manager (No Financials)</SelectItem>
                                                        <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleInvite} className="bg-cyan-600 hover:bg-cyan-700">Grant Access</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {/* List Members */}
                                    {members.length === 0 ? (
                                        <div className="p-12 text-center text-zinc-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p>No delegated members yet.</p>
                                            <p className="text-xs mt-1">You are the sole owner.</p>
                                        </div>
                                    ) : (
                                        members.map((member) => (
                                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center font-bold text-zinc-400">
                                                        {member.user?.full_name?.[0] || extractInitial(member.user?.email)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">
                                                            {member.user?.full_name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-xs text-zinc-500">{member.user?.email}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <Badge variant="outline" className={`
                                                        uppercase text-[10px] font-bold tracking-wider border-0
                                                        ${member.role === 'admin' ? 'bg-cyan-950 text-cyan-500' : 'bg-zinc-800 text-zinc-400'}
                                                    `}>
                                                        {member.role}
                                                    </Badge>
                                                    <div className="text-[10px] text-zinc-600 font-mono">
                                                        Added {new Date(member.created_at).toLocaleDateString()}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-zinc-600 hover:text-red-500 hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

function extractInitial(email: string) {
    if (!email) return '?'
    return email[0].toUpperCase()
}
