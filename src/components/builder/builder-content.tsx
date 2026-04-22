'use client';

import { BuilderComponent, useBuilderApi } from '@builder.io/react';
import { builder } from '@builder.io/sdk';

interface RenderBuilderContentProps {
    content: any;
    model: string;
}

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_PUBLIC_API_KEY');

export function RenderBuilderContent({ content, model }: RenderBuilderContentProps) {
    // Call useBuilderApi to check if we are in preview mode
    const isPreviewing = useBuilderApi().isPreviewing;

    // If there is no content and we are not previewing, we might want to show a 404 or something else
    if (!content && !isPreviewing) {
        return null;
    }

    return <BuilderComponent content={content} model={model} />;
}
