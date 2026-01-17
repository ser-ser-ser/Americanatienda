interface RewardsCardProps {
    points: number;
    tier: string;
    nextTier?: string;
}

export function RewardsCard({ points, tier, nextTier = 'Platinum' }: RewardsCardProps) {
    return (
        <div className="flex gap-4 w-full lg:w-auto">
            {/* 3D Card: Points */}
            <div className="relative group w-full lg:w-48">
                <div className="absolute inset-0 bg-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative h-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reward Points</div>
                    <div className="text-3xl font-black text-white mt-2">{points.toLocaleString()}</div>
                    <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-pink-500" />
                    </div>
                </div>
            </div>

            {/* 3D Card: Tier */}
            <div className="relative group w-full lg:w-48">
                <div className="absolute inset-0 bg-white rounded-2xl blur opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="relative h-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Member Tier</div>
                    <div className="text-2xl font-serif italic text-white mt-2">{tier}</div>
                    <div className="text-[10px] text-zinc-600 mt-4">Next: {nextTier}</div>
                </div>
            </div>
        </div>
    )
}
