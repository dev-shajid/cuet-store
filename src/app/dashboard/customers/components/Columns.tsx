'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Order, OrderStatus } from '@prisma/client'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import GetStatusClass from '@/components/GetStatusClass'

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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
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