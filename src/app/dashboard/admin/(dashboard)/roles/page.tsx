'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    ShieldCheck,
    Users,
    Settings,
    Eye,
    Edit,
    Trash2,
    Plus,
    Lock
} from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

const ROLES = [
    {
        id: 'admin',
        name: 'Super Admin',
        description: 'Full access to all platform features and data',
        color: 'bg-rose-500',
        icon: ShieldCheck,
        permissions: ['all']
    },
    {
        id: 'vendor',
        name: 'Vendor / Seller',
        description: 'Manage own store, products, and orders',
        color: 'bg-purple-500',
        icon: Shield,
        permissions: ['manage_store', 'manage_products', 'view_orders', 'manage_shipping']
    },
    {
        id: 'buyer',
        name: 'Buyer',
        description: 'Browse products, make purchases, track orders',
        color: 'bg-blue-500',
        icon: Users,
        permissions: ['browse', 'purchase', 'track_orders']
    },
    {
        id: 'marketing',
        name: 'Marketing Manager',
        description: 'Manage campaigns, SEO, and social media',
        color: 'bg-emerald-500',
        icon: Settings,
        permissions: ['manage_cms', 'manage_editorial', 'view_analytics', 'manage_seo']
    },
    {
        id: 'developer',
        name: 'Developer',
        description: 'Access to code, integrations, and technical monitoring',
        color: 'bg-cyan-500',
        icon: Settings,
        permissions: ['manage_integrations', 'view_logs', 'manage_api', 'view_architecture']
    },
    {
        id: 'consultant',
        name: 'Brand Consultant',
        description: 'Provide creative and strategic services to vendors',
        color: 'bg-amber-500',
        icon: Users,
        permissions: ['view_stores', 'manage_portfolio', 'book_services']
    }
]

const PERMISSIONS = [
    { id: 'all', name: 'All Permissions', category: 'System' },
    { id: 'manage_store', name: 'Manage Store Settings', category: 'Store' },
    { id: 'manage_products', name: 'Manage Products', category: 'Store' },
    { id: 'view_orders', name: 'View Orders', category: 'Store' },
    { id: 'manage_shipping', name: 'Manage Shipping', category: 'Logistics' },
    { id: 'browse', name: 'Browse Marketplace', category: 'Buyer' },
    { id: 'purchase', name: 'Make Purchases', category: 'Buyer' },
    { id: 'track_orders', name: 'Track Orders', category: 'Buyer' },
    { id: 'manage_cms', name: 'Manage CMS', category: 'Marketing' },
    { id: 'manage_editorial', name: 'Manage Editorial', category: 'Marketing' },
    { id: 'view_analytics', name: 'View Analytics', category: 'Analytics' },
    { id: 'manage_seo', name: 'Manage SEO', category: 'Marketing' },
    { id: 'manage_integrations', name: 'Manage Integrations', category: 'Technical' },
    { id: 'view_logs', name: 'View System Logs', category: 'Technical' },
    { id: 'manage_api', name: 'Manage APIs', category: 'Technical' },
    { id: 'view_architecture', name: 'View Architecture', category: 'Technical' },
    { id: 'view_stores', name: 'View All Stores', category: 'Consultant' },
    { id: 'manage_portfolio', name: 'Manage Portfolio', category: 'Consultant' },
    { id: 'book_services', name: 'Book Services', category: 'Consultant' }
]

export default function RolesPermissionsPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('id, email, role, created_at')
                .order('created_at', { ascending: false })
                .limit(20)

            setUsers(data || [])
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error
            toast.success(`Role updated to ${newRole}`)
            fetchUsers()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Roles & Permissions</h1>
                    <p className="text-zinc-500">Manage user access control across the platform.</p>
                </div>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                </Button>
            </div>

            {/* Roles Grid */}
            <div>
                <h2 className="text-lg font-bold mb-4">Available Roles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROLES.map((role) => (
                        <Card key={role.id} className="bg-zinc-900 border-zinc-800 text-white hover:border-rose-500/50 transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full ${role.color} flex items-center justify-center`}>
                                            <role.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{role.name}</CardTitle>
                                            <Badge variant="outline" className="mt-1 text-xs border-zinc-700 text-zinc-400">
                                                {role.id}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <CardDescription className="text-zinc-400 text-sm mt-3">
                                    {role.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Permissions</p>
                                    {role.permissions.map(permission => {
                                        const perm = PERMISSIONS.find(p => p.id === permission)
                                        return (
                                            <div key={permission} className="flex items-center gap-2 text-xs text-zinc-300">
                                                <Lock className="h-3 w-3 text-zinc-600" />
                                                <span>{perm?.name || permission}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Permission Matrix */}
            <div>
                <h2 className="text-lg font-bold mb-4">Permission Matrix</h2>
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="text-left p-4 text-zinc-400 font-bold uppercase tracking-wider">Permission</th>
                                    {ROLES.map(role => (
                                        <th key={role.id} className="text-center p-4 text-zinc-400 font-bold uppercase tracking-wider">
                                            {role.id}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSIONS.filter(p => p.id !== 'all').map((permission) => (
                                    <tr key={permission.id} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                                        <td className="p-4 text-white">
                                            <div>
                                                <p className="font-medium">{permission.name}</p>
                                                <p className="text-xs text-zinc-500">{permission.category}</p>
                                            </div>
                                        </td>
                                        {ROLES.map(role => {
                                            const hasPermission = role.permissions.includes('all') || role.permissions.includes(permission.id)
                                            return (
                                                <td key={role.id} className="p-4 text-center">
                                                    {hasPermission ? (
                                                        <div className="inline-flex h-5 w-5 rounded-full bg-emerald-500/20 items-center justify-center">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex h-5 w-5 rounded-full bg-zinc-800 items-center justify-center">
                                                            <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Recent Users */}
            <div>
                <h2 className="text-lg font-bold mb-4">Recent Users</h2>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-800">
                            {users.slice(0, 10).map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30">
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.email}</p>
                                        <p className="text-xs text-zinc-500">
                                            Joined {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <select
                                        value={user.role || 'buyer'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                                    >
                                        {ROLES.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
