'use client'

import React from 'react'

interface VideoSectionProps {
    videoUrl?: string | null
}

export function VideoSection({ videoUrl }: VideoSectionProps) {
    // Fallback logic inside component or passed prop? 
    // MinimalTheme had logic: store.config?.promo_video || true (default to enabled) and specific fallback URL.
    // I will use the passed videoUrl directly, and if missing, show placeholder or use default if logic dictates.
    // User instruction: "Crea un componente simple de video".
    // I will preserve the "default americana video" logic either here or in parent.
    // Ideally parent passes the resolve URL. But if videoUrl is null, what happens?
    // MinimalTheme line 211: {store.config?.promo_video || true ? ... }
    // MinimalTheme line 213: src={store.config?.promo_video || '/multimedia/americanatienda.mp4?v=2'}
    // So if config is empty, it uses the default.

    // I will accept videoUrl. If it is provided (even if default), I render video. 
    // If undefined provided, I use default? 
    // To make it reusable, I'll accept `videoUrl`. If `videoUrl` is present, render video.
    // If I want to support the "Placeholder" state (when no video is configured in builder), parent should control that.
    // HOWEVER, for now, to replicate MinimalTheme exactly:

    const finalVideoUrl = videoUrl || '/multimedia/americanatienda.mp4?v=2';
    // But wait, the placeholder logic in MinimalTheme was:
    // ) : ( /* Placeholder Video Style */ ... )
    // BUT the condition was `store.config?.promo_video || true`. `true` means ALWAYS show video (or default).
    // So the placeholder wasn't really being used unless I misunderstood `|| true`. `|| true` makes it ALWAYS true.
    // So it always showed the video (user's video OR default).
    // I will implement the Video Logic to show the video provided or default.

    return (
        <section className="w-full bg-black">
            <div className="relative w-full aspect-video md:aspect-21/9 max-h-[80vh] overflow-hidden">
                <video
                    src={finalVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
        </section>
    )
}
