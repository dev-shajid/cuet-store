import { DataTable } from '@/components/data-table'
import PageHeader from '@/components/PageHeader'
import { DataTableQueryProps, Product, TableDataType } from '@/types/type'
import React, { Suspense } from 'react'
import { columns } from './components/Columns'
import { getProducts } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import LoadingDataTable from '@/components/data-table/loading-data-table'

export default async function ProductsPage({ searchParams }: { searchParams: URLSearchParams }) {

  return (
    <div className='sm:space-y-12 space-y-8'>
      {/* Top Section */}
      <PageHeader
        title='Products'
        url='/dashboard/products/add'
      />


      {/* Table Section */}
      <Suspense fallback={<LoadingDataTable />}>
        <ProductsTable searchParams={searchParams} />
      </Suspense>

    </div>
  )
}

async function ProductsTable({ searchParams }: { searchParams: URLSearchParams }) {
  let query: DataTableQueryProps = {...(await searchParams), onlyPublished: false};

  const res: ApiResponseType<TableDataType<Product>> = await getProducts(query);

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
