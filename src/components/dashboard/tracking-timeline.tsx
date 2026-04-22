import { CheckCircle2, Truck, Package } from 'lucide-react'
import { format } from 'date-fns'

interface TrackingTimelineProps {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    estimated_delivery?: string;
}

export function TrackingTimeline({ status, created_at, estimated_delivery }: TrackingTimelineProps) {
    // Determine current step index based on status
    let currentStep = 0;
    if (status === 'processing' || status === 'pending') currentStep = 1; // Processed done
    if (status === 'shipped') currentStep = 2; // Shipped done, In Transit active
    if (status === 'delivered') currentStep = 4; // All done

    // Hardcode for demo if needed, but 'shipped' typically means it's with the carrier, so "In Transit" is the active phase.
    // Logic: 
    // Step 0: Processed (Done)
    // Step 1: Shipped (Done)
    // Step 2: In Transit (Active)
    // Step 3: Delivered (Pending)

    // Adjusting logic to match standard flow:
    // If status is 'shipped', it means it WAS shipped, so it IS in transit.
    const steps = [
        { label: 'PROCESSED', date: format(new Date(created_at), 'MMM d, h:mm a'), completed: true },
        { label: 'SHIPPED', date: 'Oct 13, 02:15 PM', completed: status === 'shipped' || status === 'delivered' },
        { label: 'IN TRANSIT', date: 'Expected Oct 15', active: status === 'shipped', completed: status === 'delivered' },
        { label: 'DELIVERED', date: 'Pending', completed: status === 'delivered' }
    ];

    return (
        <div className="relative w-full bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">

                {steps.map((step, index) => (
                    <div key={index} className="flex flex-1 w-full md:w-auto items-center">
                        <div className="flex flex-col items-center gap-3 w-full relative">
                            {/* Icon/Dot */}
                            <div className={`
                                h-12 w-12 rounded-full flex items-center justify-center border transition-all duration-500
                                ${step.completed ? 'bg-pink-600 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' :
                                    step.active ? 'bg-pink-600 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse' :
                                        'bg-zinc-900 border-pink-900/30'}
                            `}>
                                {step.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                ) : step.active ? (
                                    <div className="h-3 w-3 bg-white rounded-full" />
                                ) : (
                                    <div className="h-4 w-4 rounded-[1px] border border-zinc-700 bg-zinc-800" /> // Placeholder for future icon
                                )}
                            </div>

                            {/* Text */}
                            <div className="text-center">
                                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${step.active || step.completed ? 'text-white' : 'text-zinc-600'}`}>
                                    {step.label}
                                </div>
                                <div className="text-[10px] text-zinc-500">
                                    {step.date}
                                </div>
                            </div>
                        </div>

                        {/* Connector Line (except last item) */}
                        {index < steps.length - 1 && (
                            <div className={`hidden md:block h-px flex-1 mx-4 ${step.completed ? 'bg-pink-600' : 'bg-pink-900/20'}`} />
                        )}
                    </div>
                ))}

            </div>
        </div>
    )
}
