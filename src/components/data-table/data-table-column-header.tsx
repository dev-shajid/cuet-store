import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
} from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {

    const router = useRouter()
    const params = useSearchParams()
    const [queryOptions, setQuery] = useState<{ sort_order: 'asc' | 'desc', sort_by: string } | null>(null)

    useEffect(() => {
        const sort_order = params.get("sort_order")!
        const sort_by = params.get("sort_by");

        if (sort_order && sort_by) {
            setQuery({
                sort_order: sort_order === "asc" ? "asc" : "desc",
                sort_by: sort_by || column.id,
            });
        }
        else{
            setQuery(null);
        }

    }, [params, column]);

    const handleSortClick = () => {
        const isSameField = queryOptions?.sort_by.toLowerCase() === column.id.toLowerCase();
        const nextSort = isSameField && queryOptions?.sort_order === "asc" ? "desc" : "asc";

        setQuery({
            sort_order: nextSort,
            sort_by: column.id,
        });


        const searchParams = new URLSearchParams(params.toString());
        searchParams.set('sort_order', nextSort);
        searchParams.set('sort_by', column.id);
        router.push(`?${searchParams.toString()}`);
    };

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={handleSortClick}
            >
                <span>{title}</span>
                {
                    queryOptions?.sort_by == column.id ?
                        (queryOptions?.sort_order === "desc" ? (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                        )) : (
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        )
                }
            </Button>
        </div>
    )
}
