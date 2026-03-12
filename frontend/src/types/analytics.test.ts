import { describe, it, expect } from 'vitest';
import type {
  InsightDataPoint,
  InsightChartData,
  InsightChartDataset,
  InsightUserContext,
  ChartTickValue,
  RechartsTooltipEntry,
  RechartsTooltipProps,
  RechartsLegendEntry,
  RechartsLegendProps,
  ChartJsTickValue,
  CoinGeckoPriceResponse,
  CoinGeckoHistoryResponse,
  HiroBlockListResponse,
  HiroBlock,
  HiroBlockTransaction,
  HiroMempoolResponse,
  GitHubRepoResponse,
  GitHubCommitResponse,
  GitHubContributorResponse,
  ProposalWithBlocks,
  ScheduledVoteItem,
  AIRecommendationMetadata,
  StacksUserData,
  VelocityDataPoint,
  KPICardProps,
  StatsCardProps,
  HealthScoreProps,
} from './analytics';

describe('Analytics types', () => {
  describe('InsightDataPoint', () => {
    it('requires label and value fields', () => {
      const point: InsightDataPoint = { label: 'Q1', value: 100 };
      expect(point.label).toBe('Q1');
      expect(point.value).toBe(100);
    });

    it('supports optional timestamp, category, and metadata', () => {
      const point: InsightDataPoint = {
        label: 'Q1',
        value: 100,
        timestamp: 1700000000,
        category: 'development',
        metadata: { source: 'on-chain', confidence: 0.95, verified: true },
      };
      expect(point.metadata?.source).toBe('on-chain');
    });
  });

  describe('InsightChartData', () => {
    it('holds labels and datasets arrays', () => {
      const chart: InsightChartData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Proposals', data: [10, 15, 20] },
        ],
      };
      expect(chart.labels).toHaveLength(3);
      expect(chart.datasets[0].data).toEqual([10, 15, 20]);
    });

    it('dataset supports optional color and type', () => {
      const dataset: InsightChartDataset = {
        label: 'Votes',
        data: [5, 8],
        color: '#10B981',
        type: 'line',
      };
      expect(dataset.type).toBe('line');
    });
  });

  describe('InsightUserContext', () => {
    it('all fields are optional', () => {
      const ctx: InsightUserContext = {};
      expect(ctx.address).toBeUndefined();
    });

    it('includes last proposal for comparative insights', () => {
      const ctx: InsightUserContext = {
        address: 'SP123',
        lastProposal: {
          id: 5,
          title: 'Test',
          category: 'development',
          amount: 1000000,
          votesFor: 10,
          votesAgainst: 2,
          executed: false,
        },
        stakeAmount: 50000000,
        voteCount: 12,
      };
      expect(ctx.lastProposal?.id).toBe(5);
    });
  });

  describe('Chart callback types', () => {
    it('ChartTickValue accepts string or number', () => {
      const numVal: ChartTickValue = 100;
      const strVal: ChartTickValue = '100K';
      expect(numVal).toBe(100);
      expect(strVal).toBe('100K');
    });

    it('ChartJsTickValue accepts string or number', () => {
      const val: ChartJsTickValue = 500;
      expect(val).toBe(500);
    });
  });

  describe('RechartsTooltipProps', () => {
    it('has optional active, payload, and label', () => {
      const props: RechartsTooltipProps = {
        active: true,
        payload: [
          {
            name: 'votes',
            value: 42,
            dataKey: 'votesFor',
            color: '#10B981',
            payload: { month: 'Jan' },
          },
        ],
        label: 'January',
      };
      expect(props.active).toBe(true);
      expect(props.payload?.[0].value).toBe(42);
    });

    it('tooltip entry has all required fields', () => {
      const entry: RechartsTooltipEntry = {
        name: 'Success Rate',
        value: 85.5,
        dataKey: 'successRate',
        color: '#3B82F6',
        payload: {},
      };
      expect(entry.dataKey).toBe('successRate');
    });
  });

  describe('RechartsLegendProps', () => {
    it('has optional payload array', () => {
      const props: RechartsLegendProps = {
        payload: [
          { value: 'Series A', dataKey: 'a', color: 'red' },
        ],
      };
      expect(props.payload?.[0].value).toBe('Series A');
    });

    it('legend entry supports optional type', () => {
      const entry: RechartsLegendEntry = {
        value: 'Line',
        dataKey: 'line',
        color: '#000',
        type: 'line',
      };
      expect(entry.type).toBe('line');
    });
  });

  describe('API response types', () => {
    it('CoinGeckoPriceResponse has optional blockstack.usd', () => {
      const resp: CoinGeckoPriceResponse = {
        blockstack: { usd: 1.25 },
      };
      expect(resp.blockstack?.usd).toBe(1.25);
    });

    it('CoinGeckoHistoryResponse has nested market_data', () => {
      const resp: CoinGeckoHistoryResponse = {
        market_data: {
          current_price: { usd: 0.85 },
        },
      };
      expect(resp.market_data?.current_price?.usd).toBe(0.85);
    });

    it('HiroBlockListResponse holds block results', () => {
      const block: HiroBlock = {
        height: 150000,
        burn_block_time_iso: '2024-01-01T00:00:00Z',
        txs: [{ fee_rate: 250, tx_id: 'abc' }],
      };
      const resp: HiroBlockListResponse = {
        results: [block],
        total: 1,
      };
      expect(resp.results[0].height).toBe(150000);
    });

    it('HiroBlockTransaction is optional within blocks', () => {
      const tx: HiroBlockTransaction = { fee_rate: 300 };
      expect(tx.fee_rate).toBe(300);
      expect(tx.tx_id).toBeUndefined();
    });

    it('HiroMempoolResponse has total count', () => {
      const resp: HiroMempoolResponse = { total: 45 };
      expect(resp.total).toBe(45);
    });

    it('GitHubRepoResponse has stargazers and updated_at', () => {
      const resp: GitHubRepoResponse = {
        stargazers_count: 42,
        updated_at: '2024-01-15T10:00:00Z',
      };
      expect(resp.stargazers_count).toBe(42);
    });

    it('GitHubCommitResponse has sha', () => {
      const resp: GitHubCommitResponse = { sha: 'abc123' };
      expect(resp.sha).toBe('abc123');
    });

    it('GitHubContributorResponse has login and contributions', () => {
      const resp: GitHubContributorResponse = {
        login: 'dev1',
        contributions: 50,
      };
      expect(resp.login).toBe('dev1');
    });
  });

  describe('ProposalWithBlocks', () => {
    it('extends proposal with optional block fields', () => {
      const p: ProposalWithBlocks = {
        id: 1,
        proposer: 'SP123',
        amount: 100000000,
        title: 'Grant',
        description: 'A grant proposal',
        votesFor: 20,
        votesAgainst: 5,
        executed: true,
        createdAt: 12000,
        executionBlock: 12500,
        creationBlock: 12000,
      };
      expect(p.executionBlock! - p.creationBlock!).toBe(500);
    });

    it('block fields are optional', () => {
      const p: ProposalWithBlocks = {
        id: 2,
        proposer: 'SP456',
        amount: 50000000,
        title: 'Fund',
        description: 'A fund',
        votesFor: 10,
        votesAgainst: 3,
        executed: false,
        createdAt: 11000,
      };
      expect(p.executionBlock).toBeUndefined();
    });
  });

  describe('ScheduledVoteItem', () => {
    it('has all required scheduling fields', () => {
      const item: ScheduledVoteItem = {
        proposalId: 5,
        voteType: 'yes',
        executionTime: Date.now() + 3600000,
        createdAt: Date.now(),
        status: 'pending',
      };
      expect(item.voteType).toBe('yes');
      expect(item.status).toBe('pending');
    });

    it('status can be executed or cancelled', () => {
      const executed: ScheduledVoteItem = {
        proposalId: 1,
        voteType: 'no',
        executionTime: Date.now(),
        createdAt: Date.now() - 3600000,
        status: 'executed',
      };
      expect(executed.status).toBe('executed');
    });
  });

  describe('AIRecommendationMetadata', () => {
    it('all fields are optional', () => {
      const meta: AIRecommendationMetadata = {};
      expect(meta.relatedProposalId).toBeUndefined();
    });

    it('supports all metadata fields', () => {
      const meta: AIRecommendationMetadata = {
        relatedProposalId: 3,
        historicalAccuracy: 0.92,
        confidenceInterval: [0.85, 0.99],
        dataSource: 'on-chain',
        lastUpdated: Date.now(),
      };
      expect(meta.confidenceInterval).toEqual([0.85, 0.99]);
    });
  });

  describe('StacksUserData', () => {
    it('has required fields for Stacks Connect session', () => {
      const userData: StacksUserData = {
        appPrivateKey: 'abc123def',
        hubUrl: 'https://hub.blockstack.org',
        profile: {
          stxAddress: {
            mainnet: 'SP123',
            testnet: 'ST123',
          },
        },
      };
      expect(userData.profile.stxAddress.mainnet).toBe('SP123');
    });

    it('supports optional fields', () => {
      const userData: StacksUserData = {
        appPrivateKey: 'key',
        hubUrl: 'https://hub.blockstack.org',
        username: 'testuser',
        profile: {
          stxAddress: { mainnet: 'SP1', testnet: 'ST1' },
          btcAddress: 'bc1...',
        },
        identityAddress: 'ID123',
        decentralizedID: 'did:stack:v2:123',
      };
      expect(userData.username).toBe('testuser');
    });
  });

  describe('VelocityDataPoint', () => {
    it('has hour and dynamic proposal keys', () => {
      const point: VelocityDataPoint = {
        hour: 5,
        proposal1: 100,
        proposal2: 75,
      };
      expect(point.hour).toBe(5);
      expect(point['proposal1']).toBe(100);
    });
  });

  describe('Component prop types', () => {
    it('KPICardProps has all required fields', () => {
      const props: KPICardProps = {
        title: 'Total Proposals',
        value: 42,
        trend: '+12%',
        positive: true,
        sparkData: [10, 20, 15, 30, 25],
      };
      expect(props.sparkData).toHaveLength(5);
    });

    it('StatsCardProps has required and optional fields', () => {
      const props: StatsCardProps = {
        label: 'Voter Turnout',
        value: '85%',
        trend: '+5%',
        trendUp: true,
        highlight: false,
      };
      expect(props.label).toBe('Voter Turnout');
    });

    it('HealthScoreProps has all required fields', () => {
      const props: HealthScoreProps = {
        title: 'Governance Health',
        score: 92,
        status: 'Excellent',
        color: 'green',
      };
      expect(props.score).toBe(92);
    });
  });
});
