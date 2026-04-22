'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { ShippingSettings } from '@/components/dashboard/shipping/shipping-settings'

export function ShippingSettingsDialog() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121217] border-zinc-800 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Shipping Configuration</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Configure how customers receive their orders.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <ShippingSettings onSuccess={() => setIsOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
