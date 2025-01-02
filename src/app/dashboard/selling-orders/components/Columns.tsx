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
        accessorKey: "user.name",
        header: "Customer",
    },
    {
        accessorKey: "user_phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }) => (
            <span>{formatCurrency(row.getValue("total_amount"))}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as OrderStatus;
            return (
                <Badge variant="outline" className={`capitalize ${GetStatusClass(status)}`}>
                    {status}
                </Badge>
            )
        },
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
]