'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { SliderContent, PublishStatus } from '@prisma/client'

// interface SliderContent extends PrismaSliderContent {
//     product: Product
// }
import { cn } from '@/lib/utils'
import BlurImage from '@/components/BlurImage'
import { Product } from '@/types/type'


export const columns: ColumnDef<Partial<SliderContent & { product: Product }>>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="Name" />
            </div>
        ),
        cell: ({ row }) => <div className='flex flex-col items-center gap-3'>
            {row.original?.product?.images?.length ?
                <div className='border border-input rounded-md'>
                    <BlurImage
                        src={row.original?.product?.images[0]?.url}
                        alt={'product-image'}
                        className="rounded-md size-12"
                    />
                </div> :
                null
            }
        </div>,
    },
    {
        accessorKey: "productName",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="Product Name" />
            </div>
        ),
        cell: ({ row }) => <div>{row.original.product?.name ?? ''}</div>,
    },
    {
        accessorKey: "start_at",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="Start" />
            </div>
        ),
        cell: ({ row }) => {
            const date = row.original?.start_at as Date;
            return <div>{new Date(date).toLocaleDateString()}</div>
        }
    },
    {
        accessorKey: "end_at",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="End" />
            </div>
        ),
        cell: ({ row }) => {
            const date = row.original?.end_at as Date;
            return <div>{new Date(date).toLocaleDateString()}</div>
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status: PublishStatus = row.getValue("status")
            return (
                <span className={cn(
                    "px-2 py-1 rounded-full text-xs text",
                    status === PublishStatus.ACTIVE ? "bg-green-500/20 border border-green-500/40 text-green-500" : "bg-red-500/20 border border-red-500/40 text-red-500"
                )}>
                    {status === PublishStatus.ACTIVE ? "Active" : "Inactive"}
                </span>
            )
        },
    },
]