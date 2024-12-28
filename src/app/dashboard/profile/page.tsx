import React, { Suspense } from 'react'
import NotFoundCard from '@/components/NotFoundCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileForm from './components/ProfileForm';
import { getAuthUser } from '@/lib/action';
import { Address, User } from '@prisma/client';

export default async function profilePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfilePageComponent />
    </Suspense>
  )
}

async function ProfilePageComponent() {
  let initialProfile: User & { addresses: Address[] } | null = null;
  let res = await getAuthUser([], { phone: true, addresses: true })
  if (res.success) initialProfile = res.data

  if (!initialProfile)
    return (
      <NotFoundCard
        title='Profile Not Found 😑'
        url='/dashboard'
        buttonLabel='Go Back'
      />
    )

  console.log(initialProfile)

  return (
    <ProfileForm initialProfile={initialProfile} />
  )
}