'use client';

import { BuilderComponent } from '@builder.io/react';
import { builder } from '@builder.io/sdk';

interface RenderBuilderContentProps {
    content: any;
    model: string;
}

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');

export function RenderBuilderContent({ content, model }: RenderBuilderContentProps) {
    if (!content) {
        return null;
    }
    return <BuilderComponent content={content} model={model} />;
}
