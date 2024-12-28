'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudUpload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface ImageUploadProps {
    onImageUpload: (url: string) => void
    currentImage?: string
    fallback?: string
}

export function ImageUpload({ onImageUpload, currentImage, fallback }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const { onClose, onOpen } = useLoadingOverlay(state => state)

    return (
        <div className="flex flex-col items-center space-y-4">
            <CldUploadWidget
                uploadPreset='pzyfwikc'
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                    if (typeof result.info === "object" && "secure_url" in result.info) {
                        const url = result.info.secure_url;
                        onImageUpload(url);
                    }
                }}
                options={{ multiple: false }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <div onClick={onClick} className='cursor-pointer size-32 rounded-full after:h-full after:w-full after:rounded-full after:hover:bg-black/50 relative after:absolute after:top-0 after:right-0 transition-all duration-300'>
                            <Avatar className="w-full h-full">
                                <AvatarImage src={currentImage} alt={fallback} />
                                <AvatarFallback>{fallback}</AvatarFallback>
                            </Avatar>
                        </div>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

