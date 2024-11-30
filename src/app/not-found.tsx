import { LinkButton } from '@/components/ui/link-button'
import Image from 'next/image'
import React from 'react'

export default function NotFoundPage() {
    return (
        <div className='flex flex-col justify-center items-center container'>
                <Image
                    src='/404.png'
                    alt='404'
                    className='dark:filter dark:invert dark:hue-rotate-30'
                    width={500}
                    height={500}
                />
                <LinkButton href='/' size='lg' className='mt-8'>
                    Go back home
                </LinkButton>
        </div>
    )
}
