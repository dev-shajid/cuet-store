import React, { Suspense } from 'react'
import CustomerForm from './components/CustomerForm'
import NotFoundCard from '@/components/NotFoundCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order } from '@prisma/client';
import { getCustomer } from '@/lib/action';
import { OrderDetails } from '@/types/type';

export default async function CustomerPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CustomerPageComponent params={params} />
    </Suspense>
  )
}

async function CustomerPageComponent({ params }: { params: { type: string } }) {
  let initialCustomer: OrderDetails | null = null;
  const paramType = (await params).type
  let res;
  // if (paramType != 'add') {
  res = await getCustomer(paramType)
  if (res.success) initialCustomer = res.data

  if(!initialCustomer) return (
    <NotFoundCard
      title='Customer Not Found 😑'
      url='/dashboard/customers'
      buttonLabel='Go Back'
    />
  )
  // }


  return (
    <>
      <CustomerForm order={initialCustomer} />
    </>
  )
}