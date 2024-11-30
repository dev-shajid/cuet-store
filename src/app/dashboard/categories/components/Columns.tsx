'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Category, Product, PublishStatus } from '@prisma/client'
import { cn } from '@/lib/utils'
import BlurImage from '@/components/BlurImage'


export const columns: ColumnDef<Partial<Category>>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className='flex justify-center'>
                <DataTableColumnHeader column={column} title="Name" />
            </div>
        ),
        cell: ({ row }) => <div className=''>
            <div className='flex flex-col items-center gap-3'>
                {row.original.image ?
                    <div className='rounded-md'>
                        <BlurImage
                            src={row.original.image}
                            alt={'category-image'}
                            className="rounded-md size-6"
                        />
                    </div> :
                    null
                    // <div className='size-12 rounded-md border border-input bg-muted'/>
                }
                <span>{row.original.name}</span>
            </div>
        </div>,
    },
    {
        accessorKey: "description",
        header: "Description",
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
            const featured: boolean = row.getValue("is_featured")
            return (
                <span>
                    {featured === true ? '✅' : "❌"}
                </span>
            )
        },
    },
    {
        accessorKey: "products",
        header: "Total Products",
        cell: ({ row }) => (
            <span className="">
                {(row.getValue("products") as Product[]).length}
            </span>
        ),
    },
    // {
    //     id: "actions",
    //     cell:({row})=> <CellAction data={row.original} />,
    //     header: ()=><FileEdit size={16} />,
    // },
]