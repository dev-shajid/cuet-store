'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Order } from '@prisma/client'

export const columns: ColumnDef<Partial<Order>>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => (
            <span>{new Date(row.getValue("created_at")).toLocaleDateString()}</span>
        ),
    },
    // {
    //     id: "actions",
    //     cell:({row})=> <CellAction data={row.original} />,
    //     header: ()=><FileEdit size={16} />,
    // },
]