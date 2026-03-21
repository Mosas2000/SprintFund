# Governance Analytics Dashboard - Integration Guide

## Overview

This guide explains how the Governance Analytics Dashboard integrates with SprintFund and how to troubleshoot or extend the integration.

## Architecture Integration

### Data Flow

```
SprintFund Contract
    ↓
    ├─ Proposal Data
    ├─ Vote Records
    └─ Status Information
         ↓
GovernanceAnalyticsService (Fetch & Calculate)
    ↓
useGovernanceAnalytics Hook (Expose to Components)
    ↓
Dashboard Components (Display)
    ├─ Charts
    ├─ KPI Panels
    ├─ Tables
    └─ Export
```

### Component Hierarchy

```
GovernanceAnalyticsDashboard (Main)
├─ AnalyticsKPIPanel
├─ PerformanceMetricsPanel
├─ SuccessRateChart
├─ CategoryChart
├─ VotingTrendsChart
├─ VoterParticipationTrendChart
├─ STXDistributionChart
├─ FundingMetricsChart
├─ VotingPowerConcentrationChart
├─ ProposerActivityChart
├─ TreasuryBalanceChart
├─ AnalyticsExportPanel
├─ ProposalComparisonTool
└─ Detailed Category Table
```

## Integration Points

### 1. Analytics Route

**Location**: `frontend/src/app/analytics/page.tsx`

The analytics dashboard is integrated as a tab:

```typescript
const TAB_COMPONENTS: Record<TabType, ComponentType> = {
  // ... other tabs
  governance: GovernanceDashboard,  // New tab
};

const tabs = [
  // ... other tabs
  { id: 'governance', label: 'Governance', icon: Vote },
];
```

### 2. Data Fetching

**Service**: `frontend/src/services/governance-analytics.ts`

Fetches proposals from SprintFund contract:

```typescript
const response = await callReadOnlyFunction({
  contractAddress: SPRINTFUND_CONTRACT_ADDRESS,
  contractName: 'sprintfund',
  functionName: 'get-proposals',
  // ...
});
```

### 3. Hook Integration

**Hook**: `frontend/src/hooks/useGovernanceAnalytics.ts`

Main integration point for components:

```typescript
const {
  proposals,
  proposalStats,
  categoryStats,
  voterStats,
  votingPower,
  timeline,
  loading,
  error,
  refetch,
} = useGovernanceAnalytics();
```

## Configuration

### Analytics Config

**File**: `frontend/src/config/analytics.config.ts`

Adjust these settings for your deployment:

```typescript
export const ANALYTICS_CONFIG = {
  DATA_REFRESH_INTERVAL: 60000,        // 60 seconds
  API_CACHE_TTL: 300,                  // 5 minutes
  TOP_STAKERS_COUNT: 10,               // Top 10 analysis
  WHALE_CONCENTRATION_THRESHOLD: 50,   // 50% threshold
  MAX_HISTORICAL_DAYS: 365,            // 1 year
};
```

### Contract Address

Update in `governance-analytics.ts`:

```typescript
const SPRINTFUND_CONTRACT_ADDRESS = 'SP...sprintfund';
const STACKS_API_URL = 'https://api.testnet.hiro.so';
```

## Extending the Dashboard

### Adding a New Chart

1. Create component in `frontend/components/`:

```typescript
'use client';

import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import { MyChart } from 'recharts';

export default function MyAnalyticsChart() {
  const { proposals, loading } = useGovernanceAnalytics();

  if (loading) return <LoadingState />;

  const data = /* transform data */;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">My Chart Title</h3>
      <MyChart data={data} />
    </div>
  );
}
```

2. Add to dashboard in `GovernanceAnalyticsDashboard.tsx`:

```typescript
import MyAnalyticsChart from './MyAnalyticsChart';

// In return JSX:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <MyAnalyticsChart />
  {/* ... other charts */}
</div>
```

### Adding a New Metric

1. Add calculation to `GovernanceAnalyticsService`:

```typescript
async calculateMyMetric(proposals: Proposal[]): Promise<MyMetricType> {
  // Calculate metric
  return metric;
}
```

2. Add to hook `useGovernanceAnalytics`:

```typescript
const [myMetric, setMyMetric] = useState<MyMetricType | null>(null);

const fetchAnalytics = async () => {
  const metric = await service.calculateMyMetric(proposals);
  setMyMetric(metric);
};
```

3. Use in components via hook.

## Troubleshooting

### Data Not Loading

**Issue**: Charts show empty states
**Solutions**:
1. Check browser console for errors
2. Verify contract address is correct
3. Ensure Stacks API URL is reachable
4. Check network tab for API calls

### Stale Data

**Issue**: Data doesn't update automatically
**Solutions**:
1. Click manual refresh button
2. Check `DATA_REFRESH_INTERVAL` in config
3. Verify hook auto-refresh is enabled
4. Check browser console for errors

### Performance Issues

**Issue**: Dashboard loads slowly
**Solutions**:
1. Increase `API_CACHE_TTL`
2. Reduce `MAX_HISTORICAL_DAYS`
3. Enable browser caching headers
4. Check network performance

### Chart Rendering Issues

**Issue**: Charts don't appear or display incorrectly
**Solutions**:
1. Check browser console for errors
2. Verify Recharts is installed
3. Check data format matches chart requirements
4. Test with sample data

## Monitoring

### Performance Metrics

Access via console:

```typescript
import { performanceMonitor } from '@/utils/performance-monitor';

console.log(performanceMonitor.report());
```

### Analytics Logs

Access via console:

```typescript
import { analyticsLogger } from '@/utils/analytics-logger';

console.log(analyticsLogger.getLogs());
console.log(analyticsLogger.getStatistics());
```

### Cache Status

Monitor cache hits/misses:

```typescript
import { analyticsCacheManager } from '@/utils/cache-manager';

console.log(analyticsCacheManager.getStats());
```

## Security Considerations

1. **Read-Only Operations**: All contract calls are read-only
2. **No Private Data**: All data is public from blockchain
3. **No User Storage**: No user data stored locally
4. **Input Validation**: All inputs validated before use
5. **XSS Prevention**: React automatically escapes JSX

## Deployment Checklist

- [ ] Contract addresses updated for target network
- [ ] API URLs point to correct Stacks API
- [ ] Environment variables configured
- [ ] TypeScript compilation passes
- [ ] No console warnings
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Mobile responsive verified
- [ ] Error boundaries tested
- [ ] Export functionality tested

## Rollback Procedure

If issues occur:

1. Switch to previous branch:
```bash
git checkout feat/transaction-status-tracking
```

2. Redeploy application

3. Report issue on GitHub

## Support & Contribution

For issues or enhancements:

1. Check troubleshooting section
2. Review documentation files
3. Check GitHub issues
4. Submit pull request for fixes

## Version History

- **v1.0.0** - Initial release with core analytics
- Future versions will add enhancements

## Environment Requirements

- Node.js 16+
- React 18+
- TypeScript 4.9+
- Stacks.js SDK
- Recharts for charting

## Related Files

- Main dashboard: `frontend/components/GovernanceAnalyticsDashboard.tsx`
- Service: `frontend/src/services/governance-analytics.ts`
- Hook: `frontend/src/hooks/useGovernanceAnalytics.ts`
- Config: `frontend/src/config/analytics.config.ts`
- Documentation: `ANALYTICS_*.md`

## Next Steps

1. Deploy to production
2. Monitor performance metrics
3. Gather user feedback
4. Plan enhancements
5. Consider WebSocket integration for real-time updates
