import React, { Suspense } from 'react'
import NotFoundCard from '@/components/NotFoundCard';
import { getReview } from '@/lib/action';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReviewForm from './components/ReviewForm';
import { Review } from '@/types/type';

export default async function reviewPage({ params }: { params: { type: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReviewPageComponent params={params} />
    </Suspense>
  )
}

async function ReviewPageComponent({ params }: { params: { type: string } }) {
  let initialReview: Review | null = null;
  const paramType = (await params).type
  let res = await getReview(paramType)
  if (res.success) initialReview = res.data

  if (!initialReview)
    return (
      <NotFoundCard
        title='review Not Found 😑'
        url='/dashboard/reviews'
        buttonLabel='Go Back'
      />
    )

    console.log(initialReview)

  return (
    <ReviewForm initialReview={initialReview} />
  )
}