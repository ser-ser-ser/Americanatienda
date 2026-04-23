// ============================================================
// AMERICANA TIENDA — PAGE BUILDER TYPE SYSTEM
// ============================================================

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

// ── All available block types ───────────────────────────────
export type BlockType =
    // Layout
    | 'container' | 'grid' | 'columns' | 'section' | 'divider'
    // Text
    | 'heading' | 'paragraph' | 'list' | 'quote' | 'button'
    // Media
    | 'image' | 'video' | 'icon' | 'avatar'
    // Forms
    | 'form-input' | 'form-textarea' | 'form-select' | 'form-checkbox' | 'form-radio'
    // Navigation
    | 'navbar' | 'link-block' | 'breadcrumb' | 'tabs-block'
    // Marketing
    | 'hero' | 'feature' | 'pricing' | 'testimonial' | 'cta' | 'faq'
    // E-commerce
    | 'product-card' | 'products-grid' | 'categories-grid' | 'cart-block'
    // Effects
    | 'carousel' | 'card-slider'
    // Social
    | 'social-proof'

// ── Block category for the sidebar ──────────────────────────
export type BlockCategory =
    | 'layout' | 'text' | 'media' | 'forms'
    | 'navigation' | 'marketing' | 'ecommerce' | 'effects'

export interface BlockDefinition {
    type: BlockType
    label: string
    icon: string
    category: BlockCategory
    defaultProps: Record<string, any>
    description?: string
}

// ── Base block structure ─────────────────────────────────────
export interface BuilderBlock {
    id: string
    type: BlockType
    props: Record<string, any>
    children?: BuilderBlock[]  // for container/columns/grid
    styles?: BlockStyles       // per-block custom styles
}

export interface BlockStyles {
    paddingTop?: number
    paddingBottom?: number
    paddingLeft?: number
    paddingRight?: number
    marginTop?: number
    marginBottom?: number
    backgroundColor?: string
    backgroundImage?: string
    backgroundVideo?: string
    backgroundOverlay?: number  // 0-100
    borderRadius?: number
    minHeight?: number
    textAlign?: 'left' | 'center' | 'right'
}

// ── Page / Layout ─────────────────────────────────────────────
export interface PageLayout {
    version: number
    blocks: BuilderBlock[]
    theme?: PageTheme
    meta?: {
        title?: string
        description?: string
    }
}

export interface PageTheme {
    primaryColor: string
    fontFamily: string
    borderRadius: number
}

// ══ Default Page Themes ══════════════════════════════════════
export const DEFAULT_THEMES: Record<string, PageTheme> = {
    default: {
        primaryColor: '#ff007f',
        fontFamily: 'Inter',
        borderRadius: 12,
    },
    boutique: {
        primaryColor: '#c9a96e',
        fontFamily: 'Playfair Display',
        borderRadius: 4,
    },
    dark: {
        primaryColor: '#00d4ff',
        fontFamily: 'Space Grotesk',
        borderRadius: 16,
    },
    minimal: {
        primaryColor: '#000000',
        fontFamily: 'Inter',
        borderRadius: 2,
    },
}

// ── Builder History (Undo/Redo) ──────────────────────────────
export interface BuilderHistory {
    past: BuilderBlock[][]
    future: BuilderBlock[][]
}

// ── Blocks Library Definition ────────────────────────────────
export const BLOCK_LIBRARY: BlockDefinition[] = [
    // ── LAYOUT ──────────────────────────────────────────────
    {
        type: 'section',
        label: 'Section',
        icon: 'Square',
        category: 'layout',
        description: 'Full-width section with background',
        defaultProps: {
            minHeight: 200,
            backgroundColor: 'transparent',
            paddingY: 64,
        },
    },
    {
        type: 'container',
        label: 'Container',
        icon: 'Box',
        category: 'layout',
        description: 'Centered max-width container',
        defaultProps: { maxWidth: '1200px', paddingX: 24 },
    },
    {
        type: 'columns',
        label: 'Columns',
        icon: 'Columns',
        category: 'layout',
        description: '2–4 side by side columns',
        defaultProps: { columns: 2, gap: 24 },
    },
    {
        type: 'grid',
        label: 'Grid',
        icon: 'Grid3X3',
        category: 'layout',
        description: 'Custom CSS grid',
        defaultProps: { cols: 3, gap: 16 },
    },
    {
        type: 'divider',
        label: 'Divider',
        icon: 'Minus',
        category: 'layout',
        description: 'Horizontal divider line',
        defaultProps: { color: '#333', thickness: 1, style: 'solid', marginY: 32 },
    },
    // ── TEXT ────────────────────────────────────────────────
    {
        type: 'heading',
        label: 'Heading',
        icon: 'Heading',
        category: 'text',
        defaultProps: {
            text: 'Tu Título Aquí',
            level: 'h2',
            align: 'left',
            size: '3xl',
            weight: 'bold',
            color: '#ffffff',
            fontStyle: 'normal',
        },
    },
    {
        type: 'paragraph',
        label: 'Paragraph',
        icon: 'AlignLeft',
        category: 'text',
        defaultProps: {
            text: 'Escribe tu texto aquí. Este es un párrafo de ejemplo con información importante para tus visitantes.',
            align: 'left',
            size: 'base',
            color: '#a1a1aa',
        },
    },
    {
        type: 'list',
        label: 'List',
        icon: 'List',
        category: 'text',
        defaultProps: {
            items: ['Primer elemento', 'Segundo elemento', 'Tercer elemento'],
            listType: 'unordered',
            color: '#ffffff',
        },
    },
    {
        type: 'quote',
        label: 'Quote',
        icon: 'Quote',
        category: 'text',
        defaultProps: {
            text: '"Una cita inspiradora que conecta con tu audiencia."',
            author: '— Autor',
            align: 'center',
        },
    },
    {
        type: 'button',
        label: 'Button',
        icon: 'MousePointer',
        category: 'text',
        defaultProps: {
            label: 'Explorar',
            link: '/',
            variant: 'primary',
            size: 'md',
            align: 'center',
            newTab: false,
        },
    },
    // ── MEDIA ────────────────────────────────────────────────
    {
        type: 'image',
        label: 'Image',
        icon: 'Image',
        category: 'media',
        defaultProps: {
            src: '',
            alt: '',
            fit: 'cover',
            position: 'center',
            aspectRatio: '16/9',
            link: '',
            borderRadius: 8,
        },
    },
    {
        type: 'video',
        label: 'Video',
        icon: 'Video',
        category: 'media',
        defaultProps: {
            src: '',
            autoplay: true,
            muted: true,
            loop: true,
            controls: false,
            aspectRatio: '16/9',
            objectFit: 'cover',
        },
    },
    {
        type: 'icon',
        label: 'Icon',
        icon: 'Star',
        category: 'media',
        defaultProps: {
            name: 'Star',
            size: 48,
            color: '#ff007f',
            align: 'center',
        },
    },
    {
        type: 'avatar',
        label: 'Avatar',
        icon: 'UserCircle',
        category: 'media',
        defaultProps: {
            src: '',
            name: 'Nombre',
            role: 'Rol',
            size: 80,
            align: 'center',
        },
    },
    // ── MARKETING ────────────────────────────────────────────
    {
        type: 'hero',
        label: 'Hero',
        icon: 'Layers',
        category: 'marketing',
        description: 'Hero principal con fondo de video/imagen',
        defaultProps: {
            title: 'AMERICANA',
            subtitle: 'Hecho con Intención. Diseñado para Durar.',
            description: 'Descubre las mejores marcas independientes de México y América Latina.',
            ctaLabel: 'Explorar Colecciones',
            ctaLink: '/collections',
            ctaSecondaryLabel: '',
            ctaSecondaryLink: '',
            backgroundType: 'gradient',
            backgroundVideo: '',
            backgroundImage: '',
            overlayOpacity: 50,
            minHeight: 100,
            contentAlign: 'center',
        },
    },
    {
        type: 'feature',
        label: 'Feature',
        icon: 'Zap',
        category: 'marketing',
        defaultProps: {
            icon: 'Zap',
            title: 'Feature Title',
            description: 'Descripción de esta característica increíble.',
            layout: 'vertical',
            iconColor: '#ff007f',
        },
    },
    {
        type: 'testimonial',
        label: 'Testimonial',
        icon: 'MessageSquare',
        category: 'marketing',
        defaultProps: {
            quote: '"Americana Tienda cambió la forma en que compro. Siempre encuentro algo único."',
            author: 'María G.',
            role: 'Cliente fiel',
            avatar: '',
            rating: 5,
        },
    },
    {
        type: 'cta',
        label: 'CTA Band',
        icon: 'Megaphone',
        category: 'marketing',
        defaultProps: {
            title: 'Vende en Americana Tienda',
            description: 'Abre tu tienda en minutos. Sin comisiones abusivas.',
            ctaLabel: 'Comenzar gratis',
            ctaLink: '/onboarding',
            backgroundColor: '#18181b',
            accentColor: '#ff007f',
        },
    },
    {
        type: 'faq',
        label: 'FAQ',
        icon: 'HelpCircle',
        category: 'marketing',
        defaultProps: {
            title: 'Preguntas Frecuentes',
            items: [
                { question: '¿Cómo abro mi tienda?', answer: 'Es muy fácil, solo regístrate y sigue los pasos.' },
                { question: '¿Cuánto cuesta?', answer: 'Tenemos planes gratis y de pago según tus necesidades.' },
            ],
        },
    },
    {
        type: 'pricing',
        label: 'Pricing',
        icon: 'DollarSign',
        category: 'marketing',
        defaultProps: {
            title: 'Elige tu Plan',
            plans: [
                { name: 'Free', price: '$0', period: 'mes', features: ['5 productos', 'Soporte básico'], cta: 'Empezar' },
                { name: 'Pro', price: '$299', period: 'mes', features: ['Productos ilimitados', 'Soporte prioritario', 'Analytics'], cta: 'Elegir Pro', featured: true },
            ],
        },
    },
    // ── E-COMMERCE ───────────────────────────────────────────
    {
        type: 'products-grid',
        label: 'Products Grid',
        icon: 'ShoppingBag',
        category: 'ecommerce',
        defaultProps: {
            title: 'Productos Destacados',
            subtitle: 'Curados con propósito',
            columns: 3,
            limit: 6,
            filterCategory: '',
            showPrice: true,
            showAddToCart: true,
        },
    },
    {
        type: 'categories-grid',
        label: 'Categories',
        icon: 'LayoutGrid',
        category: 'ecommerce',
        defaultProps: {
            title: 'Colecciones',
            subtitle: 'Explora',
            columns: 3,
            style: 'cards',
        },
    },
    {
        type: 'product-card',
        label: 'Product Card',
        icon: 'Package',
        category: 'ecommerce',
        defaultProps: {
            productId: '',
            showBadge: true,
            showRating: false,
        },
    },
    // ── EFFECTS / CAROUSELS ──────────────────────────────────
    {
        type: 'carousel',
        label: 'Carousel',
        icon: 'GalleryHorizontal',
        category: 'effects',
        description: 'Slider horizontal con scroll snapping',
        defaultProps: {
            title: '',
            items: [],
            itemType: 'image',   // image | product | custom
            autoplay: false,
            autoplayDelay: 3000,
            loop: true,
            slidesPerView: 3,
            slidesPerViewMobile: 1,
            slidesPerViewTablet: 2,
            showArrows: true,
            showDots: true,
            snapAlign: 'start',
        },
    },
    {
        type: 'card-slider',
        label: 'Card Slider',
        icon: 'CreditCard',
        category: 'effects',
        description: 'Cards con swipe horizontal y snap',
        defaultProps: {
            title: '',
            cards: [
                { image: '', title: 'Card 1', description: '', link: '' },
                { image: '', title: 'Card 2', description: '', link: '' },
                { image: '', title: 'Card 3', description: '', link: '' },
            ],
            cardWidth: 320,
            gap: 24,
            snapAlign: 'center',
            showArrows: true,
        },
    },
    // ── SOCIAL PROOF ─────────────────────────────────────────
    {
        type: 'social-proof',
        label: 'Social Proof',
        icon: 'Users',
        category: 'marketing',
        defaultProps: {
            type: 'logos',  // logos | stats | reviews
            title: 'Marcas que confían en nosotros',
            items: [],
        },
    },
]

// ── Template Presets ─────────────────────────────────────────
export interface PageTemplate {
    id: string
    name: string
    description: string
    thumbnail: string
    category: 'marketplace' | 'store' | 'landing'
    theme: PageTheme
    blocks: BuilderBlock[]
}
