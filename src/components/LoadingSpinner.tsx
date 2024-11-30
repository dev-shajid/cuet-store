import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className='flex justify-center items-center mt-12'>
        <Loader2 size={32} className='animate-spin' />
    </div>
  )
}
