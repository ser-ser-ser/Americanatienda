'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Notification = {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    link?: string
    is_read: boolean
    created_at: string
}

type NotificationContextType = {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string, link?: string) => Promise<void>
    markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

    useEffect(() => {
        let channel: any;

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch initial notifications
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20)

            if (data && isMounted.current) setNotifications(data)

            // 2. Subscribe to new notifications
            channel = supabase.channel(`notifications:${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        const newNotif = payload.new as Notification
                        if (isMounted.current) {
                            setNotifications(prev => [newNotif, ...prev])
                        }

                        // Play "sonidito" - Using a crisp, premium notification sound
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3') // A shorter, cleaner "Ding"
                        audio.volume = 0.7
                        const playPromise = audio.play()
                        if (playPromise !== undefined) {
                            playPromise.catch(e => {
                                console.log("Audio play blocked by browser. This is normal until the user interacts with the dashboard. Error:", e)
                            })
                        }

                        // Show visible toast for immediate feedback
                        toast(newNotif.title, {
                            description: newNotif.message,
                            action: newNotif.link ? {
                                label: 'View',
                                onClick: () => router.push(newNotif.link!)
                            } : undefined,
                        })
                    }
                )
                .subscribe()
        }

        init()

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [supabase, router])

    const markAsRead = async (id: string, link?: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        )

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)

        if (link) router.push(link)
    }

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
        if (unreadIds.length === 0) return

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds)
    }

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
