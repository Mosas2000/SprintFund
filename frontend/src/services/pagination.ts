import { PaginatedResponse, PaginationParams } from '@/types/pagination';

export class PaginationService {
  static paginate<T>(
    items: T[],
    page: number,
    pageSize: number
  ): PaginatedResponse<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);

    if (page < 1) page = 1;
    if (page > totalPages && totalPages > 0) page = totalPages;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = items.slice(startIndex, endIndex);

    return {
      data,
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static calculateTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  static isValidPage(page: number, totalPages: number): boolean {
    return page >= 1 && page <= totalPages;
  }

  static getPageRange(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): number[] {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  static getOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  static getPageFromOffset(offset: number, pageSize: number): number {
    return Math.floor(offset / pageSize) + 1;
  }
}
