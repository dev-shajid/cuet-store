import React, { Suspense } from 'react'
import BuyingOrderForm from './components/BuyingOrderForm'
import NotFoundCard from '@/components/NotFoundCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getBuyingOrder } from '@/lib/action';
import { OrderDetails } from '@/types/type';

export default async function BuyingOrderPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BuyingOrderPageComponent params={params} />
    </Suspense>
  )
}

async function BuyingOrderPageComponent({ params }: { params: { type: string } }) {
  let initialBuyingOrder: OrderDetails | null = null;
  const paramType = (await params).type
  let res;
  // if (paramType != 'add') {
  res = await getBuyingOrder(paramType)
  if (res.success) initialBuyingOrder = res.data

  if(!initialBuyingOrder) return (
    <NotFoundCard
      title='BuyingOrder Not Found 😑'
      url='/dashboard/buyingOrders'
      buttonLabel='Go Back'
    />
  )
  // }


  return (
    <>
      <BuyingOrderForm order={initialBuyingOrder} />
    </>
  )
}