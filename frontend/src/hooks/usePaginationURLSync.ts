import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePaginationStore } from '@/store/pagination';

interface PaginationURLSyncProps {
  pageParamName?: string;
  pageSizeParamName?: string;
}

export const usePaginationURLSync = ({
  pageParamName = 'page',
  pageSizeParamName = 'pageSize',
}: PaginationURLSyncProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, pageSize, setPage, setPageSize } = usePaginationStore();

  useEffect(() => {
    const urlPage = searchParams.get(pageParamName);
    const urlPageSize = searchParams.get(pageSizeParamName);

    if (urlPage && parseInt(urlPage) !== page) {
      setPage(parseInt(urlPage));
    }
    if (urlPageSize && parseInt(urlPageSize) !== pageSize) {
      setPageSize(parseInt(urlPageSize));
    }
  }, [searchParams, page, pageSize, setPage, setPageSize, pageParamName, pageSizeParamName]);

  const updateURL = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParamName, newPage.toString());
    params.set(pageSizeParamName, newPageSize.toString());
    router.push(`?${params.toString()}`);
  };

  return { updateURL };
};
