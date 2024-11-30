import React, { Suspense } from 'react'
import SellingOrderForm from './components/SellingOrderForm'
import NotFoundCard from '@/components/NotFoundCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getSellingOrder } from '@/lib/action';
import { OrderDetails } from '@/types/type';

export default async function SellingOrderPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SellingOrderPageComponent params={params} />
    </Suspense>
  )
}

async function SellingOrderPageComponent({ params }: { params: { type: string } }) {
  let initialSellingOrder: OrderDetails | null = null;
  const paramType = (await params).type
  let res;
  // if (paramType != 'add') {
  res = await getSellingOrder(paramType)
  if (res.success) initialSellingOrder = res.data

  if(!initialSellingOrder) return (
    <NotFoundCard
      title='SellingOrder Not Found 😑'
      url='/dashboard/sellingOrders'
      buttonLabel='Go Back'
    />
  )
  // }


  return (
    <>
      <SellingOrderForm order={initialSellingOrder} />
    </>
  )
}