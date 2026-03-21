import { useProposalPagination } from '@/hooks/useProposalPagination';
import { usePaginationState } from '@/hooks/usePaginationState';
import { PaginationValidator } from '@/utils/pagination-validator';

export function useValidatedProposalPagination() {
  const pagination = useProposalPagination();
  const state = usePaginationState({
    onPageChange: pagination.setPage,
    onPageSizeChange: pagination.setPageSize,
  });

  const validated = PaginationValidator.sanitizeParams(
    state.currentPage,
    state.pageSize,
    pagination.totalItems
  );

  if (!validated.isValid) {
    pagination.setPage(validated.page);
  }

  return {
    ...pagination,
    ...state,
    isValid: validated.isValid,
  };
}
