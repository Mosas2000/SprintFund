import { describe, it, expect } from 'vitest';

describe('Promise.allSettled vs Promise.all comparison', () => {
  it('Promise.all rejects on first failure', async () => {
    const promises = [
      Promise.resolve('ok'),
      Promise.reject(new Error('fail')),
      Promise.resolve('also ok'),
    ];

    await expect(Promise.all(promises)).rejects.toThrow('fail');
  });

  it('Promise.allSettled collects all results', async () => {
    const promises = [
      Promise.resolve('ok'),
      Promise.reject(new Error('fail')),
      Promise.resolve('also ok'),
    ];

    const results = await Promise.allSettled(promises);

    expect(results).toHaveLength(3);
    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
    expect(results[2].status).toBe('fulfilled');
  });

  it('Promise.allSettled fulfilled results have value', async () => {
    const results = await Promise.allSettled([Promise.resolve(42)]);
    const r = results[0];
    if (r.status === 'fulfilled') {
      expect(r.value).toBe(42);
    }
  });

  it('Promise.allSettled rejected results have reason', async () => {
    const results = await Promise.allSettled([Promise.reject(new Error('err'))]);
    const r = results[0];
    if (r.status === 'rejected') {
      expect(r.reason.message).toBe('err');
    }
  });

  it('filtering fulfilled results excludes failures', async () => {
    const promises = [
      Promise.resolve(1),
      Promise.reject(new Error('fail')),
      Promise.resolve(3),
    ];

    const results = await Promise.allSettled(promises);
    const fulfilled = results
      .filter((r): r is PromiseFulfilledResult<number> => r.status === 'fulfilled')
      .map(r => r.value);

    expect(fulfilled).toEqual([1, 3]);
  });
});
