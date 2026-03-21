export class PaginationUtils {
  static calculateSkip(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  static calculateTotalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
  }

  static clampPage(page: number, totalPages: number): number {
    return Math.max(1, Math.min(page, totalPages));
  }

  static isFirstPage(page: number): boolean {
    return page === 1;
  }

  static isLastPage(page: number, totalPages: number): boolean {
    return page === totalPages;
  }

  static getRangeStart(page: number, pageSize: number): number {
    return (page - 1) * pageSize + 1;
  }

  static getRangeEnd(page: number, pageSize: number, total: number): number {
    return Math.min(page * pageSize, total);
  }

  static getPageNumbers(
    currentPage: number,
    totalPages: number,
    windowSize: number = 5
  ): (number | string)[] {
    const pages: (number | string)[] = [];

    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfWindow = Math.floor(windowSize / 2);

    if (currentPage <= halfWindow) {
      for (let i = 1; i <= windowSize; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfWindow) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - windowSize + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - Math.floor(halfWindow / 2); i <= currentPage + Math.floor(halfWindow / 2); i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }
}
