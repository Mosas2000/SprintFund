import { PaginationService } from '@/services/pagination';
import { PaginationUtils } from '@/utils/pagination-utils';

export interface ProposalFilterOptions {
  status?: string;
  category?: string;
  minFunding?: number;
  maxFunding?: number;
  search?: string;
}

export interface ProposalSortOptions {
  sortBy: 'createdAt' | 'title' | 'requestedAmount' | 'votes';
  sortOrder: 'asc' | 'desc';
}

export class ProposalPaginationService {
  static async fetchPaginatedProposals(
    page: number,
    pageSize: number,
    filters: ProposalFilterOptions = {},
    sort: ProposalSortOptions = { sortBy: 'createdAt', sortOrder: 'desc' }
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.minFunding) params.append('minFunding', filters.minFunding.toString());
    if (filters.maxFunding) params.append('maxFunding', filters.maxFunding.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`/api/proposals/paginated?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch proposals: ${response.statusText}`);
    }

    return response.json();
  }

  static validatePaginationParams(page: number, pageSize: number) {
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(5, Math.min(100, pageSize));
    return { validPage, validPageSize };
  }

  static calculatePageStats(
    page: number,
    pageSize: number,
    totalItems: number
  ) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalItems);

    return {
      totalPages,
      startItem,
      endItem,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
