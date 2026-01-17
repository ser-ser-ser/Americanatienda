'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Truck, Globe, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useVendor } from '@/providers/vendor-provider'

export function ShippingSettingsDialog() {
    const { activeStore } = useVendor()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [config, setConfig] = useState({
        local_delivery_enabled: false,
        local_radius_km: 5,
        local_base_price: 0,
        national_shipping_enabled: false,
        national_flat_rate: 0,
        free_shipping_threshold: 0
    })

    // Fetch Config on Open
    useEffect(() => {
        if (isOpen && activeStore) {
            fetchConfig()
        }
    }, [isOpen, activeStore])

    async function fetchConfig() {
        if (!activeStore) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/vendor/shipping-config?storeId=${activeStore.id}`)
            if (res.ok) {
                const data = await res.json()
                // Merge with defaults in case fields are missing from DB
                setConfig(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error('Failed to load settings', error)
            toast.error('Failed to load shipping settings')
        } finally {
            setIsLoading(false)
        }
    }

    async function saveConfig() {
        if (!activeStore) return
        setIsSaving(true)
        try {
            const res = await fetch('/api/vendor/shipping-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: activeStore.id,
                    ...config
                })
            })

            if (!res.ok) throw new Error('Failed to save')

            toast.success('Shipping settings saved')
            setIsOpen(false)
        } catch (error) {
            toast.error('Could not save settings')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121217] border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Shipping Configuration</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Configure how customers receive their orders.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#ff007f]" /></div>
                ) : (
                    <Tabs defaultValue="local" className="mt-4">
                        <TabsList className="bg-black border border-zinc-800 w-full">
                            <TabsTrigger value="local" className="w-1/2 data-[state=active]:bg-zinc-900">
                                <Truck className="w-4 h-4 mr-2" /> Local
                            </TabsTrigger>
                            <TabsTrigger value="global" className="w-1/2 data-[state=active]:bg-zinc-900">
                                <Globe className="w-4 h-4 mr-2" /> National
                            </TabsTrigger>
                        </TabsList>

                        {/* Local Settings */}
                        <TabsContent value="local" className="space-y-4 py-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Enable Local Delivery</Label>
                                    <p className="text-xs text-zinc-500">Allow customers nearby to request instant delivery.</p>
                                </div>
                                <Switch
                                    checked={config.local_delivery_enabled}
                                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, local_delivery_enabled: c }))}
                                    className="data-[state=checked]:bg-[#ff007f]"
                                />
                            </div>

                            {config.local_delivery_enabled && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-zinc-500">Radius (km)</Label>
                                        <Input
                                            type="number"
                                            className="bg-black border-zinc-800"
                                            value={config.local_radius_km}
                                            onChange={(e) => setConfig(prev => ({ ...prev, local_radius_km: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-zinc-500">Base Price ($)</Label>
                                        <Input
                                            type="number"
                                            className="bg-black border-zinc-800"
                                            value={config.local_base_price}
                                            onChange={(e) => setConfig(prev => ({ ...prev, local_base_price: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* National Settings */}
                        <TabsContent value="global" className="space-y-4 py-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Enable National Shipping</Label>
                                    <p className="text-xs text-zinc-500">Deliver to customers across the country.</p>
                                </div>
                                <Switch
                                    checked={config.national_shipping_enabled}
                                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, national_shipping_enabled: c }))}
                                    className="data-[state=checked]:bg-cyan-500"
                                />
                            </div>

                            {config.national_shipping_enabled && (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-zinc-500">Flat Rate Shipping Cost ($)</Label>
                                        <Input
                                            type="number"
                                            className="bg-black border-zinc-800"
                                            value={config.national_flat_rate}
                                            onChange={(e) => setConfig(prev => ({ ...prev, national_flat_rate: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-zinc-500">Free Shipping Threshold ($)</Label>
                                        <Input
                                            type="number"
                                            className="bg-black border-zinc-800"
                                            value={config.free_shipping_threshold}
                                            onChange={(e) => setConfig(prev => ({ ...prev, free_shipping_threshold: Number(e.target.value) }))}
                                        />
                                        <p className="text-[10px] text-zinc-500">Order value required for free shipping (0 to disable)</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}

                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-500">Cancel</Button>
                    <Button onClick={saveConfig} disabled={isSaving || isLoading} className="bg-white text-black hover:bg-zinc-200">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
