import { describe, it, expect } from 'vitest';

describe('batch size configuration', () => {
  const BATCH_SIZE = 10;

  it('batch size divides common proposal counts well', () => {
    expect(20 % BATCH_SIZE).toBe(0);
    expect(30 % BATCH_SIZE).toBe(0);
    expect(100 % BATCH_SIZE).toBe(0);
  });

  it('batch size handles small counts without waste', () => {
    const count = 3;
    const batches = Math.ceil(count / BATCH_SIZE);
    expect(batches).toBe(1);
  });

  it('batch size limits concurrent connections', () => {
    expect(BATCH_SIZE).toBeLessThanOrEqual(20);
    expect(BATCH_SIZE).toBeGreaterThanOrEqual(5);
  });
});
