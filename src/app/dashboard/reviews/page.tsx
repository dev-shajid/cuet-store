
import { DataTable } from '@/components/data-table'
import { DataTableQueryProps, Product, TableDataType } from '@/types/type'
import React, { Suspense } from 'react'
import { columns } from './components/Columns'
import { getReviews } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import PageHeader from '@/components/PageHeader'
import LoadingDataTable from '@/components/data-table/loading-data-table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Review } from '@prisma/client'

export default async function reviewsPage({ searchParams }: { searchParams: URLSearchParams }) {

  return (
    <div className='sm:space-y-12 space-y-8'>
      {/* Top Section */}
      <PageHeader
        title='Reviews'
      />


      {/* Table Section */}
      <Suspense fallback={<LoadingDataTable />}>
        <ReviewsTable searchParams={searchParams} />
      </Suspense>

    </div>
  )
}

async function ReviewsTable({ searchParams }: { searchParams: URLSearchParams }) {
  let query: DataTableQueryProps = { ...(await searchParams), onlyPublished: false };

  const res: ApiResponseType<TableDataType<Review & { product: Product }>> = await getReviews(query);
  console.log(res?.data?.data)

  if (!res.data || !res?.success) return (
    <Alert>
      <AlertTitle>❌ Error:</AlertTitle>
      <AlertDescription>
        {res.message}
      </AlertDescription>
    </Alert>
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={res.data}
      />
    </>
  )
}
