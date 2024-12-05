import { DataTable } from '@/components/data-table'
import PageHeader from '@/components/PageHeader'
import { DataTableQueryProps, TableDataType } from '@/types/type'
import React, { Suspense } from 'react'
import { columns } from './components/Columns'
import { getSlidersContent } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PublishStatus, SliderContent } from '@prisma/client'
import LoadingDataTable from '@/components/data-table/loading-data-table'

export default async function SlidersContentPage({ searchParams }: { searchParams: URLSearchParams }) {

  return (
    <div className='sm:space-y-12 space-y-8'>
      {/* Top Section */}
      <PageHeader
        title='SlidersContent'
        url='/dashboard/slides/add'
      />


      {/* Table Section */}
      <Suspense fallback={<LoadingDataTable />}>
        <SlidersContentTable searchParams={searchParams} />
      </Suspense>

    </div>
  )
}

async function SlidersContentTable({ searchParams }: { searchParams: URLSearchParams }) {
  let query: DataTableQueryProps & {admin:boolean} = {...(await searchParams), admin: true};

  const res = await getSlidersContent(query);

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
