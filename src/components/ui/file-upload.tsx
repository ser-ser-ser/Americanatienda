'use client'

import { useState, useId, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, Crop as CropIcon, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

interface FileUploadProps {
    onUploadComplete: (url: string) => void
    bucketName?: string
    folderName?: string
    accept?: string
    label?: string
    aspectRatio?: number // e.g., 16/9, 1/1
    children?: React.ReactNode
}

export function FileUpload({
    onUploadComplete,
    bucketName = 'cms_media',
    folderName = 'cms',
    accept = 'image/*,video/*',
    label = "Upload File",
    aspectRatio,
    children
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isCropOpen, setIsCropOpen] = useState(false)

    const supabase = createClient()
    const uniqueId = useId()
    const inputId = `file-upload-${uniqueId}`

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const isImage = file.type.startsWith('image/')

            // If it's an image AND we have an aspect ratio, open cropper
            if (isImage && aspectRatio) {
                const reader = new FileReader()
                reader.addEventListener('load', () => {
                    setImageSrc(reader.result?.toString() || null)
                    setIsCropOpen(true)
                })
                reader.readAsDataURL(file)
            } else {
                // Direct upload for non-images or if no aspect ratio enforced
                await uploadFile(file)
            }
            // Reset input
            e.target.value = ''
        }
    }

    const uploadFile = async (file: File | Blob) => {
        try {
            setUploading(true)

            // Determine extension
            let fileExt = 'png' // Default for blobs
            if (file instanceof File) {
                fileExt = file.name.split('.').pop() || 'png'
            }

            const fileName = `${folderName}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName)

            onUploadComplete(data.publicUrl)
            toast.success('Upload complete')
            setIsCropOpen(false)
            setImageSrc(null)

        } catch (error: any) {
            toast.error('Error uploading: ' + error.message)
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleCropSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        try {
            setUploading(true)
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedBlob) {
                const fileExt = imageSrc.startsWith('data:image/png') ? 'png' : 'jpeg'
                const fileName = `${folderName}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`
                const file = new File([croppedBlob], fileName, { type: `image/${fileExt}` })

                await uploadFile(file)
            }
        } catch (e) {
            console.error(e)
            toast.error('Failed to crop image')
            setUploading(false)
        }
    }

    const handleMagicPolish = async () => {
        if (!imageSrc) return

        try {
            setUploading(true)
            toast.info('Applying Studio Magic... (Removing BG + Adding Polish)')

            // 1. Remove Background
            const { removeBackground } = await import('@imgly/background-removal')
            const noBgBlob = await removeBackground(imageSrc)
            const noBgUrl = URL.createObjectURL(noBgBlob)

            // 2. Create Canvas for Composition
            const img = new Image()
            img.src = noBgUrl
            await new Promise((resolve) => { img.onload = resolve })

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('No context')

            // Set canvas to square (or aspect ratio if we want to enforce it, but let's stick to image size or square padding)
            // Strategy: Keep original dimensions but fill with white
            canvas.width = img.width
            canvas.height = img.height

            // 3. Draw White Background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // 4. Draw Drop Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
            ctx.shadowBlur = 40
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 20

            // 5. Draw Subject (Scaling down slightly to make room for shadow without clipping if needed, or just draw)
            // Let's scale down 90% to ensure shadow fits and it looks "framed"
            const padding = Math.min(canvas.width, canvas.height) * 0.05
            const drawWidth = canvas.width - (padding * 2)
            const drawHeight = canvas.height - (padding * 2)

            ctx.drawImage(img, padding, padding, drawWidth, drawHeight)

            // 6. Output
            canvas.toBlob((blob) => {
                if (!blob) throw new Error('Canvas error')
                const finalUrl = URL.createObjectURL(blob)
                setImageSrc(finalUrl)
                setCrop({ x: 0, y: 0 }) // Reset crop to center
                setZoom(1)
                toast.success('Studio Look Applied! ✨')
                setUploading(false)
            }, 'image/jpeg', 0.95)

        } catch (error) {
            console.error(error)
            toast.error('Failed to polish image')
            setUploading(false)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                {children ? (
                    <div onClick={() => document.getElementById(inputId)?.click()} className="cursor-pointer w-full h-full">
                        {children}
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById(inputId)?.click()}
                        className="cursor-pointer border-white/10 hover:bg-white/10 text-zinc-300"
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploading ? 'Processing...' : label}
                    </Button>
                )}
                <Input
                    id={inputId}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
                <DialogContent className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Adjust Image</DialogTitle>
                        <DialogDescription>
                            Drag to reposition. Zoom to adjust fit.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden border border-zinc-800 mt-4">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio || 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div className="py-4 flex items-center gap-4">
                        <span className="text-sm text-zinc-400 min-w-[3rem]">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>

                    <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
                        <div className="flex bg-current/10 rounded-md p-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-zinc-400 hover:text-white"
                                onClick={handleMagicPolish}
                                disabled={uploading}
                            >
                                <Sparkles className="mr-1.5 h-3 w-3 text-purple-400" />
                                Studio Look
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => setIsCropOpen(false)} disabled={uploading}>
                                Cancel
                            </Button>
                            <Button onClick={handleCropSave} disabled={uploading}>
                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CropIcon className="mr-2 h-4 w-4" />}
                                Save & Upload
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
