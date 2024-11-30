import { DataTable } from '@/components/data-table'
import PageHeader from '@/components/PageHeader'
import { TableDataType } from '@/types/type'
import React, { Suspense } from 'react'
import { columns } from './components/Columns'
import { getCustomers } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Order } from '@prisma/client'
import LoadingDataTable from '@/components/data-table/loading-data-table'

export default async function CustomersPage({ searchParams }: { searchParams: URLSearchParams }) {

  return (
    <div className='sm:space-y-12 space-y-8'>
      {/* Top Section */}
      <PageHeader
        title='Customers'
        // url='/dashboard/selling/add'
      />


      {/* Table Section */}
      <Suspense fallback={<LoadingDataTable />}>
        <CustomersTable searchParams={searchParams} />
      </Suspense>

    </div>
  )
}

async function CustomersTable({ searchParams }: { searchParams: URLSearchParams }) {
  let query = await searchParams;

  const res: ApiResponseType<TableDataType<Order>> = await getCustomers(query);
  console.log(res)

  if (!res.data || !res?.success) return (
    <Alert>
      <AlertTitle>❌ Error:</AlertTitle>
      <AlertDescription>
        {res.message}
      </AlertDescription>
    </Alert>
  )

  console.log(res.data)
  return (
    <>
      <DataTable
        columns={columns}
        data={res.data}
      />
    </>
  )
}
