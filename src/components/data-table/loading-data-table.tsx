import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingDataTable() {
  return (
    <div className='flex justify-center items-center'>
        <Loader2 size={32} className='animate-spin' />
    </div>
  )
}
