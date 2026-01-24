"use client"

import React from "react"
import { useNode } from "@craftjs/core"
import { cn } from "@/lib/utils"

interface ContainerProps {
    children?: React.ReactNode
    className?: string
    padding?: string
    background?: string
}

export const Container = ({ children, className, padding = "p-4", background = "bg-transparent" }: ContainerProps) => {
    const { connectors: { connect, drag } } = useNode()

    return (
        <div
            ref={(ref) => connect(drag(ref as HTMLElement))}
            className={cn("min-h-[50px] border border-dashed border-transparent hover:border-slate-300 transition-colors", padding, background, className)}
        >
            {children}
        </div>
    )
}

Container.craft = {
    displayName: "Container",
    props: {
        padding: "p-4",
        background: "bg-transparent",
    },
    rules: {
        canDrag: () => true,
    },
}
