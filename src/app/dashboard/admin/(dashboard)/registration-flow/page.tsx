'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
    ShieldCheck,
    Search,
    UserPlus,
    FileText,
    Bell,
    BadgeCheck,
    CheckCircle,
    Ban,
    Link as LinkIcon,
    Store,
    RefreshCw,
    AlertCircle
} from 'lucide-react'

// Types
type Store = {
    id: string
    name: string
    slug: string
    status: 'pending' | 'active' | 'suspended' | 'rejected'
    description: string
    stripe_account_id: string | null
    owner_id: string
    created_at: string
}

export default function StoreApprovalLogicFlow() {
    const supabase = createClient()
    const [stores, setStores] = useState<Store[]>([])
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch Logic
    const fetchStores = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Failed to load stores')
        } else {
            setStores(data as Store[])
            if (!selectedStore && data.length > 0) {
                // Auto select first pending if available
                const firstPending = data.find((s: Store) => s.status === 'pending')
                setSelectedStore(firstPending || data[0])
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const updateStatus = async (status: string) => {
        if (!selectedStore) return
        try {
            const { error } = await supabase
                .from('stores')
                .update({ status })
                .eq('id', selectedStore.id)

            if (error) throw error

            toast.success(`Outcome: ${status.toUpperCase()}`)

            // Refresh
            const { data } = await supabase.from('stores').select('*').eq('id', selectedStore.id).single()
            if (data) {
                setStores(prev => prev.map(s => s.id === selectedStore.id ? data : s))
                setSelectedStore(data)
            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Styles for Flow Cards
    const flowCardClass = cn(
        "relative backdrop-blur-xl border border-[#333] transition-all duration-300 p-5 w-64",
        "bg-[#121212]/95 hover:border-[#0db9f2] hover:shadow-[0_0_20px_rgba(13,185,242,0.2)]"
    )

    return (
        <div className="flex h-full bg-[#0a0a0a] text-white font-sans overflow-hidden">

            {/* LEFT PANEL: Queue Inspector (Replaces Sidebar List) */}
            <div className="w-80 border-r border-[#222] bg-[#0a0a0a]/90 flex flex-col z-20">
                <div className="p-6 border-b border-[#222]">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff007f]">Process_Inspector</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="p-3 bg-white/5 border border-white/5">
                            <p className="text-[9px] text-white/30 uppercase font-bold mb-2 tracking-widest">Selected Phase</p>
                            <p className="text-sm font-bold tracking-tight text-white">
                                {selectedStore ? selectedStore.name : 'No Selection'}
                                <span className={cn(
                                    "text-[9px] ml-2 px-1 border uppercase",
                                    selectedStore?.status === 'active' ? "text-green-500 border-green-500/30" :
                                        selectedStore?.status === 'pending' ? "text-[#ff007f] border-[#ff007f]/30" : "text-red-500 border-red-500/30"
                                )}>
                                    {selectedStore?.status || 'IDLE'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] text-white/30 uppercase font-bold mb-3 tracking-widest">Active Applications</p>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {stores.map(store => (
                                    <div
                                        key={store.id}
                                        onClick={() => setSelectedStore(store)}
                                        className={cn(
                                            "flex items-center justify-between text-[10px] p-2 transition-colors cursor-pointer border-l-2",
                                            selectedStore?.id === store.id ? "bg-white/10 border-[#ff007f]" : "bg-white/5 border-transparent hover:bg-white/10"
                                        )}
                                    >
                                        <span className="text-white font-bold uppercase truncate max-w-[120px]">{store.name}</span>
                                        <span className={cn(
                                            "uppercase",
                                            store.status === 'pending' ? "text-[#ff007f]" : "text-white/40"
                                        )}>{store.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] text-white/30 uppercase font-bold mb-3 tracking-widest">Validation Rules</p>
                            <div className="bg-[#050505] p-4 text-[10px] font-mono text-[#0db9f2]/80 leading-relaxed border border-white/5">
                                <span className="text-[#ff007f]">&quot;kyc_rule&quot;:</span> &quot;GLOBAL_ISO_2024&quot;,<br />
                                <span className="text-[#ff007f]">&quot;auto_fail&quot;:</span> [&quot;invalid_tax_id&quot;],<br />
                                <span className="text-[#ff007f]">&quot;notify&quot;:</span> &quot;admin_channel&quot;
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CANVAS: The Logic Flow */}
            <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]" style={{
                backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}>
                {/* SVG Connections Background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
                    <defs>
                        <marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="10" refY="3.5">
                            <polygon fill="#0db9f2" points="0 0, 10 3.5, 0 7"></polygon>
                        </marker>
                    </defs>
                    {/* Hardcoded paths relative to the cards roughly centered */}
                    <path d="M400 300 L480 300" stroke="#333" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead)" />
                    <path d="M736 300 L816 300" stroke="#333" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead)" />
                    <path d="M1072 300 L1152 300" stroke="#0db9f2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>

                {/* Flow Content Container */}
                <div className="absolute inset-0 overflow-auto flex items-center p-20 min-w-[1600px]">

                    {/* STEP 1: Signup (Static) */}
                    <div className={cn(flowCardClass, "border-l-2 border-l-[#0db9f2]")}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-bold text-[#0db9f2] tracking-widest uppercase">Step 01</span>
                            <UserPlus className="text-[#0db9f2] w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Seller Sign-up</h3>
                        <p className="text-[10px] text-white/50 leading-relaxed mb-4">Initial authentication via OAuth.</p>
                        <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-[#0db9f2]"></div>
                            <span className="text-[9px] font-mono text-white/40">TRIGGER: auth.register</span>
                        </div>
                    </div>

                    <div className="w-20"></div>

                    {/* STEP 2: Data Submission (Static) */}
                    <div className={cn(flowCardClass, "border-l-2 border-l-[#0db9f2]")}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-bold text-[#0db9f2] tracking-widest uppercase">Step 02</span>
                            <FileText className="text-[#0db9f2] w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Data Submission</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded">
                                <span className="text-[9px] uppercase font-bold text-white/70">Identity Verification</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded">
                                <span className="text-[9px] uppercase font-bold text-white/70">Brand Story</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-[#0db9f2]"></div>
                            <span className="text-[9px] font-mono text-white/40">UPLOAD: s3_secure</span>
                        </div>
                    </div>

                    <div className="w-20"></div>

                    {/* STEP 3: Admin Review (Dynamic) */}
                    <div className={cn(
                        flowCardClass,
                        "border-l-2 w-80 scale-110 shadow-2xl z-10",
                        selectedStore?.status === 'pending' ? "border-l-[#ff007f] border-[#ff007f]" : "border-l-[#0db9f2]"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <span className={cn(
                                "text-[9px] font-bold tracking-widest uppercase",
                                selectedStore?.status === 'pending' ? "text-[#ff007f]" : "text-[#0db9f2]"
                            )}>Step 03 (Active)</span>
                            <BadgeCheck className={cn("w-5 h-5", selectedStore?.status === 'pending' ? "text-[#ff007f] animate-pulse" : "text-[#0db9f2]")} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Master Admin Review</h3>

                        {selectedStore ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-black/50 rounded border border-white/10">
                                    <p className="text-[10px] text-white/40 mb-1">Store Name</p>
                                    <p className="text-sm font-bold text-white">{selectedStore.name}</p>
                                </div>
                                <div className="p-3 bg-black/50 rounded border border-white/10">
                                    <p className="text-[10px] text-white/40 mb-1">Description</p>
                                    <p className="text-xs text-zinc-300 line-clamp-3">{selectedStore.description}</p>
                                </div>

                                {selectedStore.status === 'pending' && (
                                    <div className="flex items-center gap-2 p-2 border border-[#ff007f]/20 bg-[#ff007f]/5">
                                        <AlertCircle className="w-4 h-4 text-[#ff007f]" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-[#ff007f]">Awaiting Human Input</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[10px] text-white/50 italic">Select a store from the inspector...</p>
                        )}
                    </div>

                    <div className="w-20"></div>

                    {/* STEP 4: Outcome (Actions) */}
                    <div className="flex flex-col gap-6">
                        {/* Approve Branch */}
                        <div className={cn(flowCardClass, "border-l-2 border-l-green-500 hover:border-green-400 cursor-pointer")} onClick={() => updateStatus('active')}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[9px] font-bold text-green-500 tracking-widest uppercase">Outcome A</span>
                                <CheckCircle className="text-green-500 w-5 h-5" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Approve & Onboard</h3>
                            <div className="space-y-1 text-[10px] text-white/60 mb-3">
                                <div className="flex items-center gap-2"><LinkIcon className="w-3 h-3" /> Stripe Connect Linked</div>
                                <div className="flex items-center gap-2"><Store className="w-3 h-3" /> Live Storefront Active</div>
                            </div>
                            <div className="pt-3 border-t border-white/5">
                                <span className="text-[9px] font-mono text-green-500/50">ACTION: set_status('active')</span>
                            </div>
                        </div>

                        {/* Reject Branch */}
                        <div className="opacity-60 hover:opacity-100 transition-opacity">
                            <div className={cn(flowCardClass, "border-l-2 border-l-red-500 hover:border-red-400 cursor-pointer")} onClick={() => updateStatus('rejected')}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] font-bold text-red-500 tracking-widest uppercase">Outcome B</span>
                                    <Ban className="text-red-500 w-5 h-5" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Reject Application</h3>
                                <p className="text-[10px] text-white/50 leading-relaxed">System will send denial notice email.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Stats */}
                <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between px-8 z-20">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                            <span className="size-2 rounded-full bg-[#0db9f2] animate-pulse shadow-[0_0_8px_#0db9f2]"></span>
                            Logic Engine: V2.1.0-PROD
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                            Mean Approval Time: <span className="text-white">4.2 Hours</span>
                        </div>
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                        Americana Marketplace OS | Proprietary Workflow Engine
                    </div>
                </div>

            </div>
        </div>
    )
}
