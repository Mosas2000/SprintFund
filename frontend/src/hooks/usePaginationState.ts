import { usePaginationStore } from '@/store/pagination';
import { PaginationService } from '@/services/pagination';

interface PaginationOptions {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const usePaginationState = (options: PaginationOptions = {}) => {
  const store = usePaginationStore();

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, store.totalPages));
    store.setPage(validPage);
    options.onPageChange?.(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changePageSize = (newSize: number) => {
    store.setPageSize(newSize);
    options.onPageSizeChange?.(newSize);
    goToPage(1);
  };

  const nextPage = () => {
    if (store.page < store.totalPages) {
      goToPage(store.page + 1);
    }
  };

  const previousPage = () => {
    if (store.page > 1) {
      goToPage(store.page - 1);
    }
  };

  const canGoNext = store.page < store.totalPages;
  const canGoPrevious = store.page > 1;
  const pageNumbers = PaginationService.getPageRange(
    store.page,
    store.totalPages
  );

  return {
    currentPage: store.page,
    pageSize: store.pageSize,
    totalPages: store.totalPages,
    totalItems: store.totalItems,
    pageNumbers,
    canGoNext,
    canGoPrevious,
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    setTotalItems: store.setTotalItems,
  };
};
