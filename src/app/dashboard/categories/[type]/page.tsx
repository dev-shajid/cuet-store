import React, { Suspense } from 'react'
import CategoryForm from './components/CategoryForm'
import NotFoundCard from '@/components/NotFoundCard';
import { getCategory } from '@/lib/action';
import LoadingSpinner from '@/components/LoadingSpinner';

export default async function CategoryPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Category params={params} />
    </Suspense>
  )
}

async function Category({ params }: { params: { type: string } }) {
  let initialCategory = null;
  const paramType = (await params).type
  let res;
  if (paramType != 'add') {
    res = await getCategory(paramType)
    if (res.success) initialCategory = res.data

    else return (
      <NotFoundCard
        title='Category Not Found 😑'
        url='/categories'
        buttonLabel='Go Back'
      />
    )
  }

  console.log(initialCategory)

  return (
    <CategoryForm initialCategory={initialCategory} />
  )
}