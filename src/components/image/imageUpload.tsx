"use client";

import { ImagePlusIcon, TrashIcon } from 'lucide-react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: CloudinaryUploadWidgetResults) => {
        console.log(result.info)
        if (result.info && typeof result.info !== 'string' && result.info.secure_url) {
            const url = result.info.secure_url;
            console.log({url})
            onChange(url);
        }
    }

    if (!isMounted) return null;

    console.log(value)

    return (
        <div className="">
            <div className='mb-4 flex items-center gap-4'>
                {value?.map((url,index) => (
                    <div key={index} className='relative w-[200px] rounded-md aspect-square overflow-hidden'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={() => onRemove(url)} size='icon' variant='destructive'>
                                <TrashIcon size={16} />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt='Image'
                            fill
                            className='object-cover w-full h-full'
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                uploadPreset='pzyfwikc'
                onSuccess={onUpload}
            >
                {({ open }) => {
                    const onClick = () => {
                        // if (disabled) return;
                        open();
                    }
                    return (
                        <Button
                            type='button'
                            variant='secondary'
                            className='flex gap-2'
                            disabled={disabled}
                            onClick={onClick}
                        >
                            <ImagePlusIcon size={16} />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}
export default ImageUpload;