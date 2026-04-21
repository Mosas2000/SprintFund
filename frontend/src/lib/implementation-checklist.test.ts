import { describe, it, expect } from 'vitest';
import {
  INTEGRATION_CHECKLIST,
  FEATURE_265_IMPLEMENTATION,
  FEATURE_259_IMPLEMENTATION,
} from './implementation-checklist';

describe('Implementation Checklist', () => {
  it('contains all integration tasks', () => {
    expect(INTEGRATION_CHECKLIST.length).toBeGreaterThan(15);
  });

  it('marks all tasks as complete', () => {
    const incompleteItems = INTEGRATION_CHECKLIST.filter(
      item => item.status !== 'complete'
    );
    expect(incompleteItems).toHaveLength(0);
  });

  it('defines feature 265 implementation', () => {
    expect(FEATURE_265_IMPLEMENTATION.issue).toContain('265');
    expect(FEATURE_265_IMPLEMENTATION.components.length).toBeGreaterThan(0);
    expect(FEATURE_265_IMPLEMENTATION.tests.length).toBeGreaterThan(0);
  });

  it('defines feature 259 implementation', () => {
    expect(FEATURE_259_IMPLEMENTATION.issue).toContain('259');
    expect(FEATURE_259_IMPLEMENTATION.components.length).toBeGreaterThan(0);
    expect(FEATURE_259_IMPLEMENTATION.hooks.length).toBeGreaterThan(0);
  });

  it('lists all components for feature 265', () => {
    expect(FEATURE_265_IMPLEMENTATION.components).toEqual([
      'ContractEventStream.tsx',
      'EventAnalyticsPanel.tsx',
    ]);
  });

  it('lists all components for feature 259', () => {
    expect(FEATURE_259_IMPLEMENTATION.components).toContain(
      'GovernanceNotificationManager.tsx'
    );
    expect(FEATURE_259_IMPLEMENTATION.components).toContain(
      'NotificationPreferencesModal.tsx'
    );
  });

  it('includes test files for both features', () => {
    const allTests = [
      ...FEATURE_265_IMPLEMENTATION.tests,
      ...FEATURE_259_IMPLEMENTATION.tests,
    ];
    expect(allTests.length).toBeGreaterThanOrEqual(5);
  });
});
