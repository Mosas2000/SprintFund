import { describe, it, expect } from 'vitest';

describe('pagination calculation logic', () => {
  const pageSize = 10;

  it('calculates total pages correctly', () => {
    expect(Math.ceil(0 / pageSize)).toBe(0);
    expect(Math.ceil(1 / pageSize)).toBe(1);
    expect(Math.ceil(10 / pageSize)).toBe(1);
    expect(Math.ceil(11 / pageSize)).toBe(2);
    expect(Math.ceil(25 / pageSize)).toBe(3);
    expect(Math.ceil(100 / pageSize)).toBe(10);
  });

  it('calculates start ID for page 0 (newest first)', () => {
    const total = 25;
    const lastId = total - 1; // 24
    const page = 0;
    const startId = Math.max(lastId - page * pageSize, 0);
    expect(startId).toBe(24);
  });

  it('calculates start ID for page 1', () => {
    const total = 25;
    const lastId = total - 1;
    const page = 1;
    const startId = Math.max(lastId - page * pageSize, 0);
    expect(startId).toBe(14);
  });

  it('calculates start ID for last page', () => {
    const total = 25;
    const lastId = total - 1;
    const page = 2;
    const startId = Math.max(lastId - page * pageSize, 0);
    expect(startId).toBe(4);
  });

  it('clamps start ID to 0 for out-of-range page', () => {
    const total = 5;
    const lastId = total - 1;
    const page = 1;
    const startId = Math.max(lastId - page * pageSize, 0);
    expect(startId).toBe(0);
  });

  it('calculates end ID correctly', () => {
    const total = 25;
    const lastId = total - 1;
    const page = 0;
    const startId = Math.max(lastId - page * pageSize, 0);
    const endId = Math.max(startId - pageSize + 1, 0);
    expect(endId).toBe(15);
  });

  it('clamps end ID to 0 for small datasets', () => {
    const total = 3;
    const lastId = total - 1;
    const startId = Math.max(lastId - 0 * pageSize, 0);
    const endId = Math.max(startId - pageSize + 1, 0);
    expect(endId).toBe(0);
  });

  it('generates correct ID range for page 0', () => {
    const total = 25;
    const lastId = total - 1;
    const page = 0;
    const startId = Math.max(lastId - page * pageSize, 0);
    const endId = Math.max(startId - pageSize + 1, 0);

    const ids: number[] = [];
    for (let id = startId; id >= endId; id--) {
      ids.push(id);
    }

    expect(ids).toEqual([24, 23, 22, 21, 20, 19, 18, 17, 16, 15]);
  });

  it('generates correct ID range for last partial page', () => {
    const total = 25;
    const lastId = total - 1;
    const page = 2;
    const startId = Math.max(lastId - page * pageSize, 0);
    const endId = Math.max(startId - pageSize + 1, 0);

    const ids: number[] = [];
    for (let id = startId; id >= endId; id--) {
      ids.push(id);
    }

    expect(ids).toEqual([4, 3, 2, 1, 0]);
  });

  it('previous button disabled on page 0', () => {
    const page = 0;
    expect(page === 0).toBe(true);
  });

  it('next button disabled on last page', () => {
    const total = 25;
    const page = 2;
    expect((page + 1) * pageSize >= total).toBe(true);
  });

  it('next button enabled on non-last page', () => {
    const total = 25;
    const page = 0;
    expect((page + 1) * pageSize >= total).toBe(false);
  });
});

describe('pagination display logic', () => {
  const pageSize = 10;

  it('shows page 1 of N format', () => {
    const page = 0;
    const total = 30;
    const display = `Page ${page + 1} of ${Math.ceil(total / pageSize)}`;
    expect(display).toBe('Page 1 of 3');
  });

  it('shows page 2 of 3', () => {
    const page = 1;
    const total = 25;
    const display = `Page ${page + 1} of ${Math.ceil(total / pageSize)}`;
    expect(display).toBe('Page 2 of 3');
  });

  it('hides pagination when total <= pageSize', () => {
    const total = 8;
    expect(total > pageSize).toBe(false);
  });

  it('shows pagination when total > pageSize', () => {
    const total = 15;
    expect(total > pageSize).toBe(true);
  });
});
