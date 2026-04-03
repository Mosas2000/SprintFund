export class PaginationValidator {
  static validatePageNumber(page: number, totalPages: number): number {
    if (totalPages === 0) return 1;
    return Math.max(1, Math.min(page, totalPages));
  }

  static validatePageSize(pageSize: number): number {
    const MIN_PAGE_SIZE = 5;
    const MAX_PAGE_SIZE = 100;
    return Math.max(MIN_PAGE_SIZE, Math.min(pageSize, MAX_PAGE_SIZE));
  }

  static isValidPageParams(page: number, pageSize: number, totalItems: number): boolean {
    if (page < 1 || pageSize < 1) return false;
    if (totalItems === 0) return page === 1;
    const totalPages = Math.ceil(totalItems / pageSize);
    return page <= totalPages;
  }

  static calculateTotalPages(totalItems: number, pageSize: number): number {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / pageSize);
  }

  static sanitizeParams(page: number, pageSize: number, totalItems: number) {
    const validPageSize = this.validatePageSize(pageSize);
    const totalPages = this.calculateTotalPages(totalItems, validPageSize);
    const validPage = this.validatePageNumber(page, totalPages);

    return {
      page: validPage,
      pageSize: validPageSize,
      totalPages,
      isValid: this.isValidPageParams(validPage, validPageSize, totalItems),
    };
  }
}
