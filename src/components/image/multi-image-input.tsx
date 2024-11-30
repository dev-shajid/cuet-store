import React, { useState } from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form'
import { UploadCloudIcon, XIcon } from 'lucide-react'
import { Input } from '../ui/input'

interface MultiIMageInputProps {
    isLoading?: boolean
    images: File[]
    setImages: React.Dispatch<React.SetStateAction<File[]>>
}

export default function MultiImageInput({ isLoading, images, setImages }: MultiIMageInputProps) {

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files)
            setImages((prevImages) => [...prevImages, ...fileArray])
        }
    }

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    }

    return (
        <div>
            <FormItem>
                <FormLabel
                    htmlFor='images'
                    className='flex flex-col items-center justify-center w-full h-40 rounded-md border border-muted-foreground border-dashed text-muted-foreground cursor-pointer'
                >
                    <UploadCloudIcon size={40} />
                    Click to upload images
                </FormLabel>
                <FormControl>
                    <Input
                        id='images'
                        type='file'
                        multiple
                        disabled={isLoading}
                        accept='image/*'
                        onChange={handleImageChange}
                        className='hidden'
                    />
                </FormControl>
                <FormMessage />
            </FormItem>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                    {images.map((image, index) => (
                        <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Uploaded ${index}`}
                                className="object-cover w-full h-full"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
