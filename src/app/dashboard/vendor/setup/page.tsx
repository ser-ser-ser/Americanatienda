'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Store, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { FileUpload } from '@/components/ui/file-upload'

export default function VendorSetupPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo_url: '',
        cover_image_url: ''
    })
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

            const { error } = await supabase.from('stores').insert({
                owner_id: user.id,
                name: formData.name,
                slug: slug,
                description: formData.description,
                logo_url: formData.logo_url,
                cover_image_url: formData.cover_image_url,
                status: 'pending' // Explictly pending
            })

            if (error) throw error

            toast.success('Application submitted successfully!')
            window.location.href = '/dashboard/vendor' // Force reload to trigger layout check
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Failed to submit application')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Store className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Setup Your Store</h1>
                    <p className="text-zinc-400">
                        Tell us about your brand. This information will be reviewed by our team.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input
                            required
                            placeholder="e.g. Neon Dreams"
                            className="bg-black/50 border-zinc-700"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            required
                            placeholder="What do you sell? (e.g. Premium vaporizers and accessories)"
                            className="bg-black/50 border-zinc-700 h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Store Logo</Label>
                            <div className="h-40 border-2 border-dashed border-zinc-700 rounded-lg overflow-hidden bg-black/30">
                                <FileUpload
                                    bucketName="cms_media"
                                    folderName="vendors"
                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                                    label={formData.logo_url ? "Change Logo" : "Upload Logo"}
                                />
                                {formData.logo_url && (
                                    <div className="absolute inset-0 z-0 pointer-events-none">
                                        <img src={formData.logo_url} className="w-full h-full object-cover opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Cover Video/Image</Label>
                            <div className="h-40 border-2 border-dashed border-zinc-700 rounded-lg overflow-hidden bg-black/30">
                                <FileUpload
                                    bucketName="cms_media"
                                    folderName="vendors"
                                    accept="image/*,video/*"
                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                                    label={formData.cover_image_url ? "Change Cover" : "Upload Cover"}
                                />
                                {formData.cover_image_url && (
                                    <div className="absolute inset-0 z-0 pointer-events-none">
                                        {formData.cover_image_url.endsWith('.mp4') ? (
                                            <video src={formData.cover_image_url} className="w-full h-full object-cover opacity-50" muted />
                                        ) : (
                                            <img src={formData.cover_image_url} className="w-full h-full object-cover opacity-50" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full text-lg h-12 font-bold" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <><Sparkles className="mr-2 h-4 w-4" /> Submit Application</>}
                    </Button>
                </form>
            </div>
        </div>
    )
}
