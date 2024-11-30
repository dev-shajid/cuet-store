import React from 'react'
import { LinkButton } from './ui/link-button'
import { Button } from './ui/button'

interface PageHeaderProps {
    title: string
    button?: boolean
    url?: string
    disabled?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
    onClick?: () => void
    button_label?: string
}

export default function PageHeader({ title, url, button_label, disabled, button = false, variant, onClick }: PageHeaderProps) {
    return (
        <div className='flex items-center justify-between gap-4 mb-4'>
            <h4 className='font-normal'>{title}</h4>

            {
                url ?
                    <LinkButton
                        href={url!}
                        size='sm'
                    >
                        {button_label ?? "Add New"}
                    </LinkButton> :
                    button ?
                        <Button
                            disabled={disabled}
                            size='sm'
                            onClick={onClick}
                            variant={variant}
                        >
                            {button_label ?? "Click Me"}
                        </Button> :
                        null
            }
        </div>
    )
}
