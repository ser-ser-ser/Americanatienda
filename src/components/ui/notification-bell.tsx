'use client'

import { useNotifications } from '@/providers/notification-provider'
import { Bell, Check, Package, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu' // Assuming standard shadcn/radix path
import { cn } from '@/lib/utils'

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-black animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-white/10 text-white">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-[10px] text-pink-500 hover:text-pink-400"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-zinc-500">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                className={cn(
                                    "p-3 flex items-start gap-3 focus:bg-white/5 cursor-pointer",
                                    !notif.is_read && "bg-white/5"
                                )}
                                onClick={() => markAsRead(notif.id, notif.link)}
                            >
                                <div className="mt-1">
                                    {notif.type === 'order' ? (
                                        <Package className="h-4 w-4 text-green-500" />
                                    ) : notif.type === 'chat' ? (
                                        <MessageCircle className="h-4 w-4 text-blue-500" />
                                    ) : (
                                        <Bell className="h-4 w-4 text-zinc-400" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={cn("text-sm font-medium", !notif.is_read ? "text-white" : "text-zinc-400")}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-zinc-500 line-clamp-2">
                                        {notif.message}
                                    </p>
                                    <p className="text-[10px] text-zinc-600">
                                        {new Date(notif.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                {!notif.is_read && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-2" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
