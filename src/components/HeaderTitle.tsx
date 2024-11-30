import React from 'react'
import { Separator } from './ui/separator'
import { LinkButton } from './ui/link-button'

export default function HeaderTitle({ children, url }: { children: React.ReactNode, url?: string }) {
    return (
        <div className='space-y-2'>
            <div className='flex justify-between items-center'>
                <h4>{children}</h4>
                {url && <LinkButton href={url} className='text-sm' variant='outline' size='sm'>View all</LinkButton>}
            </div>
            <Separator className='bg-foreground/15 relative after:absolute after:top-0 after:left-0 after:w-32 after:h-0.5 after:bg-indigo-500' />
        </div>
    )
}
