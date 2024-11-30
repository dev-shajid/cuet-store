import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface DataTablePaginationProps {
  defaultLimit?: number
  defaultPage?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  nextPage?: number
  previousPage?: number
  totalPages?: number
  totalCounts?: number
}

export function DataTablePagination({
  defaultLimit = 10,
  defaultPage = 1,
  hasNextPage=false,
  hasPreviousPage=false,
  nextPage=1,
  previousPage=1,
  totalPages=1,
}: DataTablePaginationProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [page, setPage] = useState<number>(defaultPage);
  const [limit, setLimit] = useState<number>(defaultLimit);

  useEffect(() => {
      // Get limit and page from search params or set to defaults
      const urlLimit = parseInt(params.get("limit") || `${defaultLimit}`, 10);
      const urlPage = parseInt(params.get("page") || `${defaultPage}`, 10);

      setLimit(urlLimit);
      setPage(urlPage);

      // Set default limit and page if not present in URL
      const searchParams = new URLSearchParams(params.toString());
      if (!params.get("limit")) searchParams.set("limit", `${urlLimit}`);
      if (!params.get("page")) searchParams.set("page", `${urlPage}`);
      router.push(`?${searchParams.toString()}`);
  }, [params, router, defaultLimit, defaultPage]);

  const handlePageChange = (newPage: number) => {
      setPage(newPage);
      const searchParams = new URLSearchParams(params.toString());
      searchParams.set("page", `${newPage}`);
      router.push(`?${searchParams.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      const searchParams = new URLSearchParams(params.toString());
      searchParams.set("limit", `${newLimit}`);
      searchParams.set("page", "1"); // Reset to page 1 when limit changes
      router.push(`?${searchParams.toString()}`);
  };

  return (
      <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
              {/* {totalCounts} of{" "}
              {totalCounts} row(s) selected. */}
          </div>
          <div className="flex items-center sm:space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                      value={`${limit}`}
                      onValueChange={(value) => handleLimitChange(Number(value))}
                  >
                      <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={limit} />
                      </SelectTrigger>
                      <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                  {pageSize}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                  <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                          handlePageChange(previousPage);
                      }}
                      disabled={!hasPreviousPage}
                  >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                          handlePageChange(nextPage);
                      }}
                      disabled={!hasNextPage}
                  >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRightIcon className="h-4 w-4" />
                  </Button>
              </div>
          </div>
      </div>
  )
}
