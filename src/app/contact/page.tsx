import ContactClient from './contact-client'
import { SiteFooter } from '@/components/site-footer'

export default function ContactPage() {
    return <ContactClient footer={<SiteFooter />} />
}
