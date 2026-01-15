'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Save, Sparkles, User, Quote, Calendar, Image as ImageIcon } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'
import { toast } from 'sonner'
import { useVendor } from '@/providers/vendor-provider'

export default function VendorProfilePage() {
    const supabase = createClient()
    const { activeStore, refreshStores, isLoading: isVendorLoading } = useVendor()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        founder_name: '',
        founder_role: 'Founder & Visionary',
        founder_bio: '',
        founder_quote: '',
        founder_image_url: '',
        establishment_date: ''
    })

    // Load Data
    useEffect(() => {
        if (activeStore) {
            setFormData({
                founder_name: activeStore.founder_name || '',
                founder_role: activeStore.founder_role || 'Founder & Visionary',
                founder_bio: activeStore.founder_bio || '',
                founder_quote: activeStore.founder_quote || '',
                founder_image_url: activeStore.founder_image_url || '',
                establishment_date: activeStore.establishment_date || ''
            })
        }
    }, [activeStore])

    const handleSave = async () => {
        if (!activeStore) return
        setSaving(true)

        try {
            const { error } = await supabase
                .from('stores')
                .update({
                    founder_name: formData.founder_name,
                    founder_role: formData.founder_role,
                    founder_bio: formData.founder_bio,
                    founder_quote: formData.founder_quote,
                    founder_image_url: formData.founder_image_url,
                    establishment_date: formData.establishment_date
                })
                .eq('id', activeStore.id)

            if (error) throw error

            toast.success('Visionary profile updated successfully')
            refreshStores()
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (isVendorLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    if (!activeStore) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
                <p>No store selected.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold font-serif italic text-white mb-2">Visionary Profile</h1>
                        <p className="text-zinc-400">Tell the story behind the brand. This appears on your public shop page.</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-zinc-200">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Profile
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left: Founder Portrait */}
                    <Card className="bg-zinc-900 border-zinc-800 md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Portrait</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden border border-zinc-800 relative group">
                                {formData.founder_image_url ? (
                                    <img
                                        src={formData.founder_image_url}
                                        alt="Founder"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 p-4 text-center">
                                        <User className="h-12 w-12 mb-2 opacity-50" />
                                        <span className="text-xs uppercase font-bold tracking-widest">No Portrait</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <FileUpload
                                        bucketName="cms_media"
                                        folderName="founders"
                                        label="Upload Portrait"
                                        aspectRatio={3 / 4}
                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, founder_image_url: url }))}
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-2 text-center">
                                Professional editorial shot recommended.
                                <br />Aspect Ratio 3:4.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Right: Details Form */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Identity */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="text-purple-500 h-5 w-5" />
                                    Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={formData.founder_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, founder_name: e.target.value }))}
                                            className="bg-zinc-950 border-zinc-700"
                                            placeholder="e.g. Elara Von Night"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role / Title</Label>
                                        <Input
                                            value={formData.founder_role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, founder_role: e.target.value }))}
                                            className="bg-zinc-950 border-zinc-700"
                                            placeholder="e.g. Founder & Creative Director"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Est. Date / Era</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                        <Input
                                            value={formData.establishment_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, establishment_date: e.target.value }))}
                                            className="bg-zinc-950 border-zinc-700 pl-9"
                                            placeholder="e.g. Est. 2021 or 'Since the 90s'"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Philosophy */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Quote className="text-rose-500 h-5 w-5" />
                                    Philosophy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Signature Quote</Label>
                                    <Textarea
                                        value={formData.founder_quote}
                                        onChange={(e) => setFormData(prev => ({ ...prev, founder_quote: e.target.value }))}
                                        className="bg-zinc-950 border-zinc-700 font-serif italic"
                                        placeholder='"Fashion is armor for the unapologetic."'
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bio / Manifesto</Label>
                                    <Textarea
                                        value={formData.founder_bio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, founder_bio: e.target.value }))}
                                        className="bg-zinc-950 border-zinc-700 min-h-[150px]"
                                        placeholder="Share your vision, background, or the ethos of your brand..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}
