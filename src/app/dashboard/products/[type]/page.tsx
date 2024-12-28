import React, { Suspense } from 'react'
import ProductForm from './components/ProductForm'
import NotFoundCard from '@/components/NotFoundCard';
import { getProduct } from '@/lib/action';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types/type';

export default async function ProductPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductPageComponent params={params} />
    </Suspense>
  )
}

async function ProductPageComponent({ params }: { params: { type: string } }) {
  let initialProduct: Partial<Product> | null = null;
  const paramType = (await params).type
  let res;
  if (paramType != 'add') {
    res = await getProduct(paramType)
    if (res.success) initialProduct = res.data

    else return (
      <NotFoundCard
        title='Product Not Found 😑'
        url='/dashboard/products'
        buttonLabel='Go Back'
      />
    )
  }

  return (
    <ProductForm initialProduct={initialProduct} />
  )
}