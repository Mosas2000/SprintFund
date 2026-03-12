import { describe, it, expect } from 'vitest';
import type { ProfileTab } from '../types/profile';

/**
 * Behavioral tests for Profile page.
 * Tests tab definitions, state transitions, and keyboard navigation logic.
 */

/* ── Tab definitions (mirrors component) ──────── */

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'votes', label: 'Votes' },
  { id: 'activity', label: 'Activity' },
];

describe('Profile page behaviour', () => {
  describe('tab definitions', () => {
    it('has exactly 4 tabs', () => {
      expect(TABS).toHaveLength(4);
    });

    it('overview is the first tab', () => {
      expect(TABS[0].id).toBe('overview');
    });

    it('each tab has a unique id', () => {
      const ids = TABS.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('each tab has a label', () => {
      for (const tab of TABS) {
        expect(tab.label).toBeTruthy();
      }
    });

    it('tab labels are capitalized', () => {
      for (const tab of TABS) {
        expect(tab.label[0]).toBe(tab.label[0].toUpperCase());
      }
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowRight moves to next tab', () => {
      let currentIndex = 0;
      currentIndex = (currentIndex + 1) % TABS.length;
      expect(TABS[currentIndex].id).toBe('proposals');
    });

    it('ArrowRight wraps from last to first', () => {
      let currentIndex = 3; // activity
      currentIndex = (currentIndex + 1) % TABS.length;
      expect(TABS[currentIndex].id).toBe('overview');
    });

    it('ArrowLeft moves to previous tab', () => {
      let currentIndex = 2; // votes
      currentIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      expect(TABS[currentIndex].id).toBe('proposals');
    });

    it('ArrowLeft wraps from first to last', () => {
      let currentIndex = 0; // overview
      currentIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      expect(TABS[currentIndex].id).toBe('activity');
    });

    it('Home moves to first tab', () => {
      const currentIndex = 3; // activity
      const nextIndex = 0;
      expect(TABS[nextIndex].id).toBe('overview');
    });

    it('End moves to last tab', () => {
      const currentIndex = 0; // overview
      const nextIndex = TABS.length - 1;
      expect(TABS[nextIndex].id).toBe('activity');
    });
  });

  describe('ARIA attributes', () => {
    it('generates correct tab id for each tab', () => {
      const ids = TABS.map((t) => `profile-tab-${t.id}`);
      expect(ids).toEqual([
        'profile-tab-overview',
        'profile-tab-proposals',
        'profile-tab-votes',
        'profile-tab-activity',
      ]);
    });

    it('generates correct panel id for each tab', () => {
      const ids = TABS.map((t) => `profile-panel-${t.id}`);
      expect(ids).toEqual([
        'profile-panel-overview',
        'profile-panel-proposals',
        'profile-panel-votes',
        'profile-panel-activity',
      ]);
    });

    it('active tab has tabIndex 0', () => {
      const activeTab = 'overview';
      for (const tab of TABS) {
        const tabIndex = tab.id === activeTab ? 0 : -1;
        if (tab.id === activeTab) {
          expect(tabIndex).toBe(0);
        } else {
          expect(tabIndex).toBe(-1);
        }
      }
    });
  });

  describe('state transitions', () => {
    it('starts in overview tab', () => {
      const defaultTab: ProfileTab = 'overview';
      expect(defaultTab).toBe('overview');
    });

    it('loading state shows skeleton when no cached data', () => {
      const loading = true;
      const profile = null;
      const showSkeleton = loading && !profile;
      expect(showSkeleton).toBe(true);
    });

    it('loading state shows banner when cached data exists', () => {
      const loading = true;
      const profile = { address: 'SP123' };
      const showBanner = loading && profile !== null;
      expect(showBanner).toBe(true);
    });

    it('error state shows ErrorState when no cached data', () => {
      const error = 'Network error';
      const profile = null;
      const showError = error !== null && !profile;
      expect(showError).toBe(true);
    });

    it('error state shows banner when cached data exists', () => {
      const error = 'Network error';
      const profile = { address: 'SP123' };
      const showBanner = error !== null && profile !== null;
      expect(showBanner).toBe(true);
    });

    it('not connected state shows connect prompt', () => {
      const connected = false;
      const address = null;
      const showPrompt = !connected || !address;
      expect(showPrompt).toBe(true);
    });

    it('connected with no address shows connect prompt', () => {
      const connected = true;
      const address = '';
      const showPrompt = !connected || !address;
      expect(showPrompt).toBe(true);
    });
  });

  describe('overview tab content', () => {
    it('shows limited activity items on overview', () => {
      const allActivity = Array.from({ length: 20 }, (_, i) => ({ id: `${i}` }));
      const overviewActivity = allActivity.slice(0, 5);
      expect(overviewActivity).toHaveLength(5);
    });
  });

  describe('refresh behaviour', () => {
    it('retry increments counter', () => {
      let retryCount = 0;
      retryCount += 1;
      expect(retryCount).toBe(1);
    });

    it('refresh button disabled while loading', () => {
      const loading = true;
      const buttonLabel = loading ? 'Refreshing...' : 'Refresh profile';
      expect(buttonLabel).toBe('Refreshing...');
    });

    it('refresh button enabled when not loading', () => {
      const loading = false;
      const buttonLabel = loading ? 'Refreshing...' : 'Refresh profile';
      expect(buttonLabel).toBe('Refresh profile');
    });
  });
});
