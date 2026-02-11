import { VendorProvider } from '@/providers/vendor-provider'

export default function ChatLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <VendorProvider>
            {children}
        </VendorProvider>
    )
}
