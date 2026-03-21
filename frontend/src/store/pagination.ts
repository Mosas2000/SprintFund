import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaginationState } from '@/types/pagination';

interface PaginationStore extends PaginationState {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setPaginationState: (state: Partial<PaginationState>) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
}

const initialState: PaginationState = {
  page: 1,
  pageSize: 15,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const usePaginationStore = create<PaginationStore>(
  persist(
    (set, get) => ({
      ...initialState,

      setPage: (page: number) =>
        set((state) => ({
          page: Math.max(1, Math.min(page, state.totalPages)),
        })),

      setPageSize: (pageSize: number) =>
        set({ pageSize: Math.max(5, Math.min(pageSize, 100)), page: 1 }),

      setPaginationState: (state: Partial<PaginationState>) => set(state),

      nextPage: () =>
        set((state) => {
          if (state.hasNextPage) {
            return { page: state.page + 1 };
          }
          return {};
        }),

      previousPage: () =>
        set((state) => {
          if (state.hasPreviousPage) {
            return { page: state.page - 1 };
          }
          return {};
        }),

      goToPage: (page: number) =>
        set((state) => ({
          page: Math.max(1, Math.min(page, state.totalPages)),
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'pagination-store',
    }
  )
);
