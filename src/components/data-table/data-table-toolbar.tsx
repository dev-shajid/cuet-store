'use client';

import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Table } from '@tanstack/react-table';
import useDebounce from '@/hooks/use-debounce';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [localSearchValue, setLocalSearchValue] = useState(params.get('search') ?? '');

  const debouncedSearch = useCallback(
    useDebounce((value: string) => {
      const searchParams = new URLSearchParams(params.toString());
      searchParams.set('search', value);
      if (!value) searchParams.delete('search');
      router.push(`?${searchParams.toString()}`);
    }, 500),
    [params, pathname, router]
  );

  useEffect(() => {
    debouncedSearch(localSearchValue);
  }, [localSearchValue, debouncedSearch]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(event.target.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Items by name"
          value={localSearchValue}
          onChange={handleFilterChange}
          className="h-8 max-w-sm w-full"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
