import { DataTable } from '@/components/data-table'
import PageHeader from '@/components/PageHeader'
import { TableDataType } from '@/types/type'
import React, { Suspense } from 'react'
import { columns } from './components/Columns'
import { getCategories } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Category } from '@prisma/client'
import LoadingDataTable from '@/components/data-table/loading-data-table'

export default async function CategoriesPage({ searchParams }: { searchParams: URLSearchParams }) {

  return (
    <div className='sm:space-y-12 space-y-8'>
      {/* Top Section */}
      <PageHeader
        title='Categories'
        url='/dashboard/categories/add'
      />


      {/* Table Section */}
      <Suspense fallback={<LoadingDataTable />}>
        <CategoriesTable searchParams={searchParams} />
      </Suspense>

    </div>
  )
}

async function CategoriesTable({ searchParams }: { searchParams: URLSearchParams }) {
  let query = await searchParams;

  const res: ApiResponseType<TableDataType<Category>> = await getCategories(query);

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
