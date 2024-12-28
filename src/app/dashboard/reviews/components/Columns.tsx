'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import Image from 'next/image'
import BlurImage from '@/components/BlurImage'
import { PublishStatus, Review } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Product } from '@/types/type'


export const columns: ColumnDef<Review & { product: Product }>[] = [
    {
        accessorKey: "rating",
        header: ({ column }) => (
            <div className='flex justify-start'>
                <DataTableColumnHeader column={column} title="Raging" />
            </div>
        ),
    },
    {
        accessorKey: "comment",
        header: "Comment",
    },
    {
        accessorKey: "product.name",
        header: "Product Name",
    },
    {
        accessorKey: "product.images",
        header: "Product Image",
        cell: ({ row }) => <div className='flex flex-col items-start gap-3'>
            {row.original.product.images.length ?
                <div className='border border-input rounded-md'>
                    <BlurImage
                        src={row.original.product.images[0].url}
                        alt={'product-image'}
                        className="rounded-md size-12"
                    />
                </div> :
                null
            }
        </div>,
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const createdAt: Date = new Date(row.getValue("created_at"));
            return createdAt.toLocaleDateString();
        },
    },
]