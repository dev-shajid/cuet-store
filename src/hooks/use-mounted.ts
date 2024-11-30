import React, { useEffect, useState } from 'react'

export default function useMounted() {
    const [mutate, setMutate] = useState(false)

    useEffect(() => {
      setMutate(true)
    }, [])

    return mutate
}
