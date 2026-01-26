import { create } from 'zustand';
import { ProposalMetrics, VoterMetrics, fetchAllProposals, fetchVoterMetrics, clearAnalyticsCache } from '../utils/analytics/dataCollector';

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  categories: string[];
  statusFilter: 'all' | 'successful' | 'failed' | 'active';
  amountRange: {
    min: number;
    max: number;
  };
}

export interface AggregateStats {
  totalFunded: number;
  successRate: number;
  avgTimeToFunding: number;
  totalProposals: number;
  activeProposals: number;
}

interface AnalyticsState {
  proposals: ProposalMetrics[];
  voters: VoterMetrics[];
  isLoading: boolean;
  lastUpdated: number;
  error: string | null;
  filters: AnalyticsFilters;
  autoRefreshEnabled: boolean;
  fetchAnalyticsData: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateFilters: (filters: Partial<AnalyticsFilters>) => void;
  clearCache: () => void;
  setAutoRefresh: (enabled: boolean) => void;
}

const getDefaultFilters = (): AnalyticsFilters => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  return {
    dateRange: { start, end },
    categories: [],
    statusFilter: 'all',
    amountRange: { min: 0, max: Infinity }
  };
};

const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  proposals: [],
  voters: [],
  isLoading: false,
  lastUpdated: 0,
  error: null,
  filters: getDefaultFilters(),
  autoRefreshEnabled: true,

  fetchAnalyticsData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const proposals = await fetchAllProposals(true, (current, total) => {
        console.log(`Loading proposals: ${current}/${total}`);
      });

      const voters = await fetchVoterMetrics(proposals);

      set({
        proposals,
        voters,
        isLoading: false,
        lastUpdated: Date.now(),
        error: null
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch analytics data'
      });
    }
  },

  refreshData: async () => {
    clearAnalyticsCache();
    await get().fetchAnalyticsData();
  },

  updateFilters: (filters: Partial<AnalyticsFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearCache: () => {
    clearAnalyticsCache();
    set({
      proposals: [],
      voters: [],
      lastUpdated: 0,
      error: null
    });
  },

  setAutoRefresh: (enabled: boolean) => {
    set({ autoRefreshEnabled: enabled });
  }
}));

export const useFilteredProposals = (): ProposalMetrics[] => {
  const proposals = useAnalyticsStore(state => state.proposals);
  const filters = useAnalyticsStore(state => state.filters);

  return proposals.filter(proposal => {
    const proposalDate = new Date(proposal.createdAt * 10 * 60 * 1000);
    
    if (proposalDate < filters.dateRange.start || proposalDate > filters.dateRange.end) {
      return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(proposal.category)) {
      return false;
    }

    if (filters.statusFilter !== 'all') {
      if (filters.statusFilter === 'successful' && !proposal.executed) {
        return false;
      }
      if (filters.statusFilter === 'failed') {
        const now = Date.now();
        const deadline = proposal.deadline * 10 * 60 * 1000;
        if (proposal.executed || deadline > now) {
          return false;
        }
        if (proposal.votesFor <= proposal.votesAgainst) {
          return true;
        }
        return false;
      }
      if (filters.statusFilter === 'active') {
        const now = Date.now();
        const deadline = proposal.deadline * 10 * 60 * 1000;
        if (proposal.executed || deadline < now) {
          return false;
        }
      }
    }

    if (proposal.amount < filters.amountRange.min || proposal.amount > filters.amountRange.max) {
      return false;
    }

    return true;
  });
};

export const useAggregateStats = (): AggregateStats => {
  const filteredProposals = useFilteredProposals();

  const totalFunded = filteredProposals
    .filter(p => p.executed)
    .reduce((sum, p) => sum + p.amount, 0);

  const successfulProposals = filteredProposals.filter(p => p.executed);
  const successRate = filteredProposals.length > 0
    ? (successfulProposals.length / filteredProposals.length) * 100
    : 0;

  const proposalsWithTimeToFunding = successfulProposals.filter(p => p.timeToFunding !== undefined);
  const avgTimeToFunding = proposalsWithTimeToFunding.length > 0
    ? proposalsWithTimeToFunding.reduce((sum, p) => sum + (p.timeToFunding || 0), 0) / proposalsWithTimeToFunding.length
    : 0;

  const now = Date.now();
  const activeProposals = filteredProposals.filter(p => {
    if (p.executed) return false;
    const deadline = p.deadline * 10 * 60 * 1000;
    return deadline > now;
  }).length;

  return {
    totalFunded,
    successRate,
    avgTimeToFunding,
    totalProposals: filteredProposals.length,
    activeProposals
  };
};

let refreshInterval: NodeJS.Timeout | null = null;

export const startAutoRefresh = () => {
  if (refreshInterval) return;

  const store = useAnalyticsStore.getState();
  
  refreshInterval = setInterval(() => {
    const state = useAnalyticsStore.getState();
    if (state.autoRefreshEnabled && !state.isLoading) {
      state.fetchAnalyticsData();
    }
  }, 5 * 60 * 1000);
};

export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

if (typeof window !== 'undefined') {
  startAutoRefresh();

  window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
  });
}

export default useAnalyticsStore;
