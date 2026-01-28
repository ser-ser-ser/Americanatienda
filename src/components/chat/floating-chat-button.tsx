'use client'

import { useChat } from '@/providers/chat-provider'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function FloatingChatButton({ vendorId }: { vendorId?: string }) {
    const { startSupportChat, startConversation, isOpen, setIsOpen } = useChat()
    const [hidden, setHidden] = useState(false)

    // Hide button if chat is open to avoid clutter (optional, depends on preference)
    // Actually, usually the button toggles the chat. 
    // If chat is a drawer/sheet, the generic shadcn sheet has its own trigger or we control open state.
    // Our provider controls open state, so we just call startSupportChat (which opens it) 
    // OR we might want to just toggle it if already active. 

    if (isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={() => {
                        if (vendorId) {
                            startConversation(vendorId)
                        } else {
                            startSupportChat()
                        }
                    }}
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-2xl bg-rose-600 hover:bg-rose-700 text-white p-0"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </motion.div>
        </AnimatePresence>
    )
}
