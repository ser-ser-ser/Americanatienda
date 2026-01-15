
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-black">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto max-h-screen">
                {children}
            </main>
        </div>
    )
}
