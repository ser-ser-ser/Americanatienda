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
    Trash2,
    Store
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'

export default function VendorTeamPage() {
    const supabase = createClient()
    const { activeStore, isLoading: isVendorLoading } = useVendor()
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('admin')
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    useEffect(() => {
        if (!activeStore) return

        const fetchMembers = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('store_members')
                .select(`
                    id,
                    role,
                    created_at,
                    user:profiles!inner(id, full_name, username, avatar_url, email)
                `)
                .eq('store_id', activeStore.id)

            if (data) setMembers(data)
            else setMembers([])
            setLoading(false)
        }

        fetchMembers()
    }, [activeStore])

    const handleInvite = async () => {
        if (!inviteEmail || !activeStore) return

        try {
            const { data: userProfile, error: searchError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('email', inviteEmail)
                .single()

            if (searchError || !userProfile) {
                toast.error('User not found. They must be registered on Americana first.')
                return
            }

            const { error: insertError } = await supabase
                .from('store_members')
                .insert({
                    store_id: activeStore.id,
                    user_id: userProfile.id,
                    role: inviteRole
                })

            if (insertError) {
                if (insertError.code === '23505') toast.error('User is already a team member.')
                else toast.error('Failed to add member.')
            } else {
                toast.success(`Access granted to ${inviteEmail}`)
                setIsInviteOpen(false)
                setInviteEmail('')
                // Refresh list
                const { data } = await supabase
                    .from('store_members')
                    .select('id, role, created_at, user:profiles!inner(id, full_name, email)')
                    .eq('store_id', activeStore.id)
                if (data) setMembers(data)
            }
        } catch (e) {
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

    if (isVendorLoading || loading) return <div className="p-8 text-zinc-500">Loading Team...</div>
    if (!activeStore) return <div className="p-8 text-zinc-500">Please select a store.</div>

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-cyan-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">Security & Access</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Team & Access Control</h1>
                        <p className="text-zinc-500 mt-1">Manage who can access and manage {activeStore.name}.</p>
                    </div>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider">
                                <Plus className="mr-2 h-4 w-4" /> Grant Access
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#121217] border-zinc-800 text-white">
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
                                        <SelectContent className="bg-[#121217] border-zinc-700 text-white">
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
                </div>

                <Card className="bg-[#121217] border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-cyan-500" /> Active Team Members
                        </CardTitle>
                        <CardDescription>Delegated managers for this storefront.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {members.length === 0 ? (
                                <div className="p-12 text-center text-zinc-500 text-sm">
                                    No delegated members yet. You are the sole manager.
                                </div>
                            ) : (
                                members.map((member) => (
                                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                                                {member.user?.full_name?.[0] || member.user?.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">
                                                    {member.user?.full_name || 'Anonymous Member'}
                                                </div>
                                                <div className="text-xs text-zinc-500 uppercase font-mono tracking-tighter">{member.user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className={`
                                                uppercase text-[9px] font-bold tracking-[0.2em] border-0
                                                ${member.role === 'admin' ? 'bg-cyan-950/50 text-cyan-500' : 'bg-zinc-900 text-zinc-500'}
                                            `}>
                                                {member.role}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
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
    )
}
