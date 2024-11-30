'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import Image from 'next/image'
import BlurImage from '@/components/BlurImage'
import { Product } from '../page'
import { PublishStatus } from '@prisma/client'
import { cn } from '@/lib/utils'


export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="Name" />
            </div>
        ),
        cell: ({ row }) => <div className='flex flex-col items-center gap-3'>
            {row.original.images.length ?
                <div className='border border-input rounded-md'>
                    <BlurImage
                        src={row.original.images[0].url}
                        alt={'product-image'}
                        className="rounded-md size-12"
                    />
                </div> :
                null
            }
            <span>{row.original.name}</span>
        </div>,
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "category_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "stock",
        header: "Stock",
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
    {
        accessorKey: "is_featured",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Featured" />
        ),
        cell: ({ row }) => {
            const featured: boolean = row.getValue("is_featured");
            console.log(featured)
            return (
                <span>
                    {featured ? '✅' : "❌"}
                </span>
            )
        },
    },
]