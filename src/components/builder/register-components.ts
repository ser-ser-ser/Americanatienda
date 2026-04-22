'use client';

import { Builder } from '@builder.io/react';
import { MinimalTheme } from '@/components/templates/MinimalTheme';
import { BoutiqueTheme } from '@/components/templates/BoutiqueTheme';
import { BrutalistTheme } from '@/components/templates/BrutalistTheme';
import { DarkSocialTheme } from '@/components/templates/DarkSocialTheme';

// Register specific Americana components in Builder.io
Builder.registerComponent(MinimalTheme, {
    name: 'Minimal Theme',
    inputs: [
        { name: 'storeName', type: 'string', defaultValue: 'Americana Store' },
        { name: 'description', type: 'string', defaultValue: 'The future of commerce.' },
    ],
});

Builder.registerComponent(BoutiqueTheme, {
    name: 'Boutique Theme',
    inputs: [
        { name: 'brandName', type: 'string', defaultValue: 'Americana Boutique' },
    ],
});

Builder.registerComponent(BrutalistTheme, {
    name: 'Brutalist Theme',
    inputs: [
        { name: 'title', type: 'string', defaultValue: 'Brutal Fashion' },
    ],
});

Builder.registerComponent(DarkSocialTheme, {
    name: 'Dark Social Theme',
    inputs: [
        { name: 'handle', type: 'string', defaultValue: '@americana' },
    ],
});
