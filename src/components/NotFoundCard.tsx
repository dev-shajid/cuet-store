import React from 'react'
import { LinkButton } from './ui/link-button'

export default function NotFoundCard({
    title = 'Not Found 😢',
    message = 'Could not find requested resource',
    url = '/',
    buttonLabel = 'Go to Home',
}: { title?: string, message?: string, url?: string, buttonLabel?: string }) {
    return (
        <main className="flex justify-center items-center w-full h-[70dvh]">
            <div className='border border-foreground/15 bg-muted/10 p-16 flex flex-col gap-3 rounded-md text-center backdrop-blur-md'>
                <h3>{title}</h3>
                <p>{message}</p>
                <LinkButton href={url}>{buttonLabel}</LinkButton>
            </div>
        </main>
    )
}
