import { describe, it, expect } from 'vitest';
import { ROUTE_TITLES } from '../../lib/route-titles';

describe('ROUTE_TITLES', () => {
  it('exports a non-empty object', () => {
    expect(typeof ROUTE_TITLES).toBe('object');
    expect(Object.keys(ROUTE_TITLES).length).toBeGreaterThan(0);
  });

  it('all values are non-empty strings', () => {
    Object.values(ROUTE_TITLES).forEach(title => {
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    });
  });

  it('all keys are route paths', () => {
    Object.keys(ROUTE_TITLES).forEach(key => {
      expect(key).toMatch(/^\//);
    });
  });

  it('contains a root route', () => {
    expect(ROUTE_TITLES['/']).toBeDefined();
  });
});
