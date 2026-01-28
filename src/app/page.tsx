import HomeClient from './home-client'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
    return <HomeClient footer={<SiteFooter />} />
}
