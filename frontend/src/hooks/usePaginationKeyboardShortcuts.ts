import { useCallback } from 'react';
import { usePaginationStore } from '@/store/pagination';

interface PaginationKeyboardShortcutsOptions {
  enabled?: boolean;
}

export const usePaginationKeyboardShortcuts = ({
  enabled = true,
}: PaginationKeyboardShortcutsOptions = {}) => {
  const { page, nextPage, previousPage, totalPages } = usePaginationStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        if (e.key === 'ArrowRight' || e.key === ']') {
          e.preventDefault();
          if (page < totalPages) nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === '[') {
          e.preventDefault();
          if (page > 1) previousPage();
        }
      }
    },
    [enabled, page, totalPages, nextPage, previousPage]
  );

  return { handleKeyDown };
};
