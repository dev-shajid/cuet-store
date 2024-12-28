"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { TableDataType } from "@/types/type"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import LoadingDataTable from "./loading-data-table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TableDataType<TData>
    clickable?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    clickable = true,
}: DataTableProps<TData, TValue>) {
    const pathname = usePathname()
    const router = useRouter()

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4 sm:max-w-full max-w-[calc(100dvw-40px)] mx-auto">
            <DataTableToolbar table={table} />
            <div className="rounded-md border overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="cursor-pointer hover:bg-indigo-500/10"
                                        onClick={() => {
                                            if (!clickable) return;
                                            const rowData = row.original as { id: string }
                                            router.push(`${pathname}/${rowData.id}`)
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) :
                                (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                hasNextPage={data?.hasNextPage}
                hasPreviousPage={data?.hasPreviousPage}
                nextPage={data?.nextPage}
                previousPage={data?.previousPage}
                totalPages={data?.totalPages}
                totalCounts={data?.totalCounts}
            />
        </div>
    )
}
