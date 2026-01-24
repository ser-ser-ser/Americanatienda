"use client"

import React from "react"
import { useNode } from "@craftjs/core"
import { cn } from "@/lib/utils"

interface ButtonProps {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
    className?: string
}

export const Button = ({ children, variant = "primary", size = "md", className }: ButtonProps) => {
    const { connectors: { connect, drag } } = useNode()

    const variants = {
        primary: "bg-[#FF007F] text-white hover:opacity-90 border-transparent shadow-[#FF007F]/20",
        secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 border-transparent",
        ghost: "bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 border-transparent",
        outline: "bg-transparent border border-slate-300 dark:border-white/20 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5"
    }

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base"
    }

    return (
        <button
            ref={(ref) => connect(drag(ref as HTMLElement))}
            className={cn(
                "inline-flex items-center justify-center rounded transition-all font-display font-bold tracking-widest uppercase shadow-lg",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </button>
    )
}

Button.craft = {
    displayName: "Button",
    props: {
        children: "Click Me",
        variant: "primary",
        size: "md",
    },
    related: {
        // We can add a settings panel here later
    }
}
