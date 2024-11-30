'use client'

import { axios } from '@/lib/axios';
import { TableDataType } from '@/types/type';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'
import useDebounce from './use-debounce';
import { UUID } from 'crypto';
import { useToast } from './use-toast';

interface FilterProps {
    type: 'categories' | 'products' | 'users';
}

interface CommonType {
    name: string
    id: UUID
}


export default function useFilter<T extends CommonType>({type}: FilterProps) {
    const { data } = useSession()
    const {toast} = useToast()
    const [items, setItems] = useState<T[] | null>([])
    const [initialItems, setInitialItems] = useState<T[] | null>([])
    const [loadingFilterItem, setLoadingFilterItem] = useState<boolean>(false)


    const getCategories = async (searchCategory?: string) => {
        if (!data) return null;
        setLoadingFilterItem(true)
        const searchParams = new URLSearchParams()
        if (searchCategory) searchParams.append("search", searchCategory);
        const res = await axios<TableDataType<T>>(`/api/v1/${type}?${searchParams.toString()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${data.access_token}`
            }
        })
        setLoadingFilterItem(false);
        if(!res.success) {
            toast({
                title: '❌ Error',
                description: res.message,
            })
            return null;
        }
        return res.data.data;
    }



    const debounceSearch = useDebounce(async (value: string) => {
        if (value === "") {
            setLoadingFilterItem(false)
            setItems(initialItems)
            return;
        }
        const res = await getCategories(value)
        setItems(res)
    })



    useEffect(() => {
        getCategories()
            .then((data) => {
                setInitialItems(data)
                setItems(data)
            })
    }, [data])


    return {
        filterItems: items || initialItems,//: (items || initialItems)?.map((category) => ({ label: category.name, value: category.id })),
        setSearchItem: debounceSearch,
        loadingFilterItem,
        setLoadingFilterItem,
    };
}
