import React, { Suspense } from 'react'
import SliderContentForm from './components/SliderContentForm'
import NotFoundCard from '@/components/NotFoundCard';
import { getSliderContent } from '@/lib/action';
import LoadingSpinner from '@/components/LoadingSpinner';

export default async function SliderContentPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SliderContent params={params} />
    </Suspense>
  )
}

async function SliderContent({ params }: { params: { type: string } }) {
  let initialSliderContent = undefined;
  const paramType = (await params).type
  let res;
  if (paramType != 'add') {
    res = await getSliderContent(paramType)
    if (res.success) initialSliderContent = res.data

    else return (
      <NotFoundCard
        title='SliderContent Not Found 😑'
        url='/categories'
        buttonLabel='Go Back'
      />
    )
  }

  console.log(initialSliderContent)

  return (
    <SliderContentForm initialSliderContent={initialSliderContent} />
  )
}