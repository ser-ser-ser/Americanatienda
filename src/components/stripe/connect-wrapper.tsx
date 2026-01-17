'use client'

import React, { useState, useEffect } from "react"
import { ConnectComponentsProvider } from "@stripe/react-connect-js"
import { loadConnectAndInitialize } from "@stripe/connect-js"
import { toast } from "sonner"

export default function ConnectWrapper({
    stripeAccountId,
    children,
}: {
    stripeAccountId: string
    children: React.ReactNode
}) {
    const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!stripeAccountId) return

        const fetchClientSecret = async () => {
            const response = await fetch("/api/stripe/account-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId: stripeAccountId }),
            })

            if (!response.ok) {
                const err = await response.json()
                console.error("Failed to fetch client secret:", err)
                toast.error(`Stripe Error: ${err.error || response.statusText}`)
                setLoading(false)
                return ""
            }

            const { clientSecret } = await response.json()
            return clientSecret
        }

        // Initialize Stripe Connect
        const instance = loadConnectAndInitialize({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret,
            appearance: {
                overlays: "dialog",
                variables: {
                    colorPrimary: "#f4256a", // Americana Pink
                    colorBackground: "#0a0a0a", // Dark Background
                    colorText: "#ffffff",
                    fontFamily: "var(--font-sans)",
                },
            },
        })

        setStripeConnectInstance(instance)
        setLoading(false)
    }, [stripeAccountId])

    if (loading) return null

    return (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            {children}
        </ConnectComponentsProvider>
    )
}
