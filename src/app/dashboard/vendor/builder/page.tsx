import { Suspense } from 'react'
import PageBuilder from '@/components/vendor/builder/page-builder'
import { saveVendorPageAction, getBuilderInitData } from '@/app/actions/builder-actions'

export default async function VendorBuilderPage() {
    const initData = await getBuilderInitData('home')

    if (!initData) return null;

    return (
        <div className="h-screen w-full bg-black">
            <Suspense fallback={
                <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ff007f] w-1/3 animate-[loading_2s_infinite]" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Initializing Design Engine...</p>
                    </div>
                    <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}</style>
                </div>
            }>
                <PageBuilder
                    storeName={initData.storeName}
                    initialData={initData.initialData}
                    onSave={saveVendorPageAction}
                />
            </Suspense>
        </div>
    )
}
