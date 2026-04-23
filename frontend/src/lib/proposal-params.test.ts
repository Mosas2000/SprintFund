import { describe, it, expect } from 'vitest';
import {
  parseStatus,
  parseCategory,
  parseSort,
  parsePage,
  parsePageSize,
  parseSearchParams,
  serializeParams,
  buildProposalUrl,
  countActiveFilters,
  isDefaultParams,
  DEFAULT_PARAMS,
} from './proposal-params';
import type { ProposalFilterParams } from './proposal-params';

describe('parseStatus', () => {
  it('returns default for null', () => {
    expect(parseStatus(null)).toBe('all');
  });

  it('accepts valid status values', () => {
    expect(parseStatus('all')).toBe('all');
    expect(parseStatus('active')).toBe('active');
    expect(parseStatus('executed')).toBe('executed');
  });

  it('returns default for unknown value', () => {
    expect(parseStatus('pending')).toBe('all');
    expect(parseStatus('')).toBe('all');
    expect(parseStatus('invalid')).toBe('all');
  });
});

describe('parseCategory', () => {
  it('returns default for null', () => {
    expect(parseCategory(null)).toBe('all');
  });

  it('accepts all valid categories', () => {
    const valid = ['all', 'development', 'design', 'marketing', 'community', 'research', 'other'] as const;
    valid.forEach((c) => expect(parseCategory(c)).toBe(c));
  });

  it('returns default for unknown value', () => {
    expect(parseCategory('finance')).toBe('all');
    expect(parseCategory('')).toBe('all');
  });
});

describe('parseSort', () => {
  it('returns default for null', () => {
    expect(parseSort(null)).toBe('newest');
  });

  it('accepts all valid sort options', () => {
    const valid = ['newest', 'oldest', 'highest', 'lowest', 'most-votes', 'ending-soon'] as const;
    valid.forEach((s) => expect(parseSort(s)).toBe(s));
  });

  it('accepts ending-soon as a valid sort value', () => {
    expect(parseSort('ending-soon')).toBe('ending-soon');
  });

  it('returns default for unknown value', () => {
    expect(parseSort('alphabetical')).toBe('newest');
    expect(parseSort('')).toBe('newest');
  });
});

describe('parsePage', () => {
  it('returns 1 for null', () => {
    expect(parsePage(null)).toBe(1);
  });

  it('parses valid page numbers', () => {
    expect(parsePage('1')).toBe(1);
    expect(parsePage('5')).toBe(5);
    expect(parsePage('100')).toBe(100);
  });

  it('returns 1 for non-numeric values', () => {
    expect(parsePage('abc')).toBe(1);
    expect(parsePage('')).toBe(1);
    expect(parsePage('1.5')).toBe(1);
  });

  it('returns 1 for values less than 1', () => {
    expect(parsePage('0')).toBe(1);
    expect(parsePage('-1')).toBe(1);
  });
});

describe('parsePageSize', () => {
  it('returns 10 for null', () => {
    expect(parsePageSize(null)).toBe(10);
  });

  it('parses valid page sizes', () => {
    expect(parsePageSize('15')).toBe(15);
    expect(parsePageSize('50')).toBe(50);
  });

  it('returns 10 for invalid values', () => {
    expect(parsePageSize('abc')).toBe(10);
    expect(parsePageSize('0')).toBe(10);
    expect(parsePageSize('-5')).toBe(10);
  });
});

describe('parseSearchParams', () => {
  it('returns defaults when no params set', () => {
    const params = parseSearchParams(new URLSearchParams());
    expect(params).toEqual(DEFAULT_PARAMS);
  });

  it('parses all params from URLSearchParams', () => {
    const qs = new URLSearchParams('status=active&category=development&sort=oldest&q=hello&page=3&pageSize=20');
    const params = parseSearchParams(qs);
    expect(params.status).toBe('active');
    expect(params.category).toBe('development');
    expect(params.sort).toBe('oldest');
    expect(params.q).toBe('hello');
    expect(params.page).toBe(3);
    expect(params.pageSize).toBe(20);
  });

  it('falls back to defaults for invalid param values', () => {
    const qs = new URLSearchParams('status=deleted&category=legal&sort=alpha&page=bad');
    const params = parseSearchParams(qs);
    expect(params.status).toBe('all');
    expect(params.category).toBe('all');
    expect(params.sort).toBe('newest');
    expect(params.page).toBe(1);
    expect(params.pageSize).toBe(10);
  });
});

describe('serializeParams', () => {
  it('produces empty URLSearchParams for default values', () => {
    const result = serializeParams(DEFAULT_PARAMS);
    expect(result.toString()).toBe('');
  });

  it('omits default values from output', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, page: 1, status: 'all' });
    expect(result.has('page')).toBe(false);
    expect(result.has('status')).toBe(false);
  });

  it('includes non-default status', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, status: 'active' });
    expect(result.get('status')).toBe('active');
  });

  it('includes non-default category', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, category: 'design' });
    expect(result.get('category')).toBe('design');
  });

  it('includes non-default sort', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, sort: 'most-votes' });
    expect(result.get('sort')).toBe('most-votes');
  });

  it('serializes ending-soon sort to query string', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, sort: 'ending-soon' });
    expect(result.get('sort')).toBe('ending-soon');
  });

  it('includes non-default search query', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, q: 'treasury' });
    expect(result.get('q')).toBe('treasury');
  });

  it('trims whitespace from search query', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, q: '  treasury  ' });
    expect(result.get('q')).toBe('treasury');
  });

  it('includes non-default page and pageSize', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, page: 2, pageSize: 20 });
    expect(result.get('page')).toBe('2');
    expect(result.get('pageSize')).toBe('20');
  });

  it('omits blank search query', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, q: '   ' });
    expect(result.has('q')).toBe(false);
  });

  it('includes page when greater than 1', () => {
    const result = serializeParams({ ...DEFAULT_PARAMS, page: 3 });
    expect(result.get('page')).toBe('3');
  });

  it('round-trips through parse and serialize', () => {
    const original: ProposalFilterParams = {
      status: 'executed',
      category: 'research',
      sort: 'highest',
      q: 'stacks',
      page: 4,
    };
    const serialized = serializeParams(original);
    const parsed = parseSearchParams(serialized);
    expect(parsed).toEqual(original);
  });

  it('round-trips ending-soon sort through parse and serialize', () => {
    const original: ProposalFilterParams = {
      status: 'active',
      category: 'all',
      sort: 'ending-soon',
      q: '',
      page: 1,
    };
    const serialized = serializeParams(original);
    const parsed = parseSearchParams(serialized);
    expect(parsed.sort).toBe('ending-soon');
    expect(parsed.status).toBe('active');
  });
});

describe('buildProposalUrl', () => {
  it('returns base url when all params are default', () => {
    const url = buildProposalUrl('/proposals', DEFAULT_PARAMS);
    expect(url).toBe('/proposals');
  });

  it('appends query string for non-default params', () => {
    const url = buildProposalUrl('/proposals', { ...DEFAULT_PARAMS, status: 'active' });
    expect(url).toBe('/proposals?status=active');
  });

  it('appends multiple params', () => {
    const url = buildProposalUrl('/proposals', {
      ...DEFAULT_PARAMS,
      status: 'active',
      category: 'development',
    });
    expect(url).toContain('status=active');
    expect(url).toContain('category=development');
    expect(url.startsWith('/proposals?')).toBe(true);
  });
});

describe('countActiveFilters', () => {
  it('returns 0 for default params', () => {
    expect(countActiveFilters(DEFAULT_PARAMS)).toBe(0);
  });

  it('counts status filter', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, status: 'active' })).toBe(1);
  });

  it('counts category filter', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, category: 'design' })).toBe(1);
  });

  it('counts sort filter', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, sort: 'oldest' })).toBe(1);
  });

  it('counts ending-soon as an active sort filter', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, sort: 'ending-soon' })).toBe(1);
  });

  it('counts search query', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, q: 'hello' })).toBe(1);
  });

  it('does not count blank query', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, q: '   ' })).toBe(0);
  });

  it('does not count page', () => {
    expect(countActiveFilters({ ...DEFAULT_PARAMS, page: 5 })).toBe(0);
  });

  it('counts multiple active filters', () => {
    const params: ProposalFilterParams = {
      status: 'active',
      category: 'development',
      sort: 'most-votes',
      q: 'test',
      page: 2,
    };
    expect(countActiveFilters(params)).toBe(4);
  });
});

describe('isDefaultParams', () => {
  it('returns true for default params', () => {
    expect(isDefaultParams(DEFAULT_PARAMS)).toBe(true);
  });

  it('returns false when status is non-default', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, status: 'active' })).toBe(false);
  });

  it('returns false when category is non-default', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, category: 'marketing' })).toBe(false);
  });

  it('returns false when sort is non-default', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, sort: 'oldest' })).toBe(false);
  });

  it('returns false when sort is ending-soon', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, sort: 'ending-soon' })).toBe(false);
  });

  it('returns false when q is set', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, q: 'governance' })).toBe(false);
  });

  it('returns true when q is only whitespace', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, q: '   ' })).toBe(true);
  });

  it('returns false when page is not 1', () => {
    expect(isDefaultParams({ ...DEFAULT_PARAMS, page: 2 })).toBe(false);
  });
});
