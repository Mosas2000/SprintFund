# Analytics System

Comprehensive analytics system for SprintFund DAO providing insights into proposals, voting patterns, and trends.

## Architecture

### Phase 1: Data Infrastructure (Branch: feat/analytics-data-collector)

**Data Collection Layer**
- `utils/analytics/dataCollector.ts`: Fetches proposals and voter metrics from blockchain
  - Pagination support (50 items per page)
  - Caching with 5-minute TTL
  - Retry logic with exponential backoff
  - Interfaces: ProposalMetrics (17 fields), VoterMetrics (6 fields)

**Data Processing Pipeline**
- `utils/analytics/dataProcessor.ts`: Advanced analytics and pattern detection
  - Success factor analysis (optimal ranges, timing, thresholds)
  - Voting pattern identification (whale/active/casual clustering)
  - Category trend calculation (growth rates, saturation)
  - Anomaly detection (3-sigma rule)
  - Time series data generation (moving averages, regression)

**State Management**
- `store/analyticsStore.ts`: Zustand store with filters and computed values
  - Auto-refresh every 5 minutes
  - Date range, category, status, and amount filtering
  - Aggregate stats computation (total funded, success rate, etc.)

**API Integration**
- `utils/analytics/apiIntegration.ts`: External data enrichment
  - STX price data (CoinGecko)
  - Network metrics (Hiro Stacks API)
  - GitHub integration
  - Rate limiting and caching (1-hour TTL)

**Utility Functions**
- `utils/analytics/helpers.ts`: 20+ utility functions
  - Metric formatting (currency with K/M/B suffixes)
  - Statistical calculations
  - Trend detection
  - Color scale generation

### Phase 2: Visualizations (Branch: feat/analytics-visualizations)

**Components**

1. **SuccessRateChart**
   - Interactive line chart with multiple series
   - Date range selector (7d/30d/90d/1y/all)
   - Moving averages (7-day, 30-day)
   - Export to PNG/CSV
   - 437 lines

2. **CategoryPerformance**
   - Bar chart (funding by category)
   - Pie chart (proposal distribution)
   - Sortable table with 7 metrics
   - Click to filter dashboard
   - 355 lines

3. **VotingHeatmap**
   - 7x24 calendar grid (days × hours)
   - Multiple metrics toggle
   - 90 days of historical data
   - Peak time detection
   - 319 lines

4. **FundingTimeline**
   - Horizontal scatter timeline
   - Zoom and playback controls
   - Cumulative funding chart
   - Category filtering
   - 377 lines

5. **VoterNetworkGraph**
   - Force-directed network graph
   - Canvas-based rendering
   - Node size = total votes
   - Multiple view modes
   - 392 lines

6. **SuccessPredictor**
   - ML-based prediction tool
   - 5 weighted scoring factors
   - Real-time recommendations
   - Confidence intervals
   - Form input with validation

7. **ProposalComparator**
   - Side-by-side comparison (up to 3)
   - Velocity chart comparison
   - Voter overlap calculation
   - CSV export

8. **LiveAnalytics**
   - Real-time widget (10s updates)
   - Live voting feed
   - Sparkline charts (24h/7d/30d)
   - Network status indicator
   - Expandable/collapsible

**Analytics Dashboard**
- `app/analytics/page.tsx`: Main dashboard integrating all components
- Tab-based navigation with 8 views
- Responsive grid layouts
- Loading and error states

## Usage

### Accessing Analytics

Navigate to `/analytics` route to view the dashboard.

### Navigation

The analytics page is accessible from the main navigation bar in the header.

### Component Imports

```typescript
import {
  SuccessRateChart,
  CategoryPerformance,
  VotingHeatmap,
  FundingTimeline,
  VoterNetworkGraph,
  SuccessPredictor,
  ProposalComparator,
  LiveAnalytics
} from '@/components/analytics';
```

### State Management

```typescript
import { useAnalyticsStore } from '@/store/analyticsStore';

const { 
  proposals, 
  voters, 
  isLoading, 
  fetchAnalyticsData,
  updateFilters 
} = useAnalyticsStore();
```

## Features

- Real-time data updates every 5 minutes
- Multiple visualization types (line, bar, pie, scatter, network, heatmap)
- Interactive filtering and sorting
- Export capabilities (PNG, CSV)
- Responsive design
- Dark mode support
- Live analytics widget with floating UI
- ML-based success prediction
- Side-by-side proposal comparison

## Technology Stack

- **Framework**: Next.js 16.1.4, React 19.2.3
- **State**: Zustand
- **Charts**: recharts 3.6.0
- **Data**: lodash, date-fns, simple-statistics
- **Styling**: Tailwind CSS 4
- **Icons**: lucide-react
- **Blockchain**: @stacks/transactions

## Performance

- Client-side caching with 5-minute TTL
- Pagination for large datasets
- Rate limiting for external APIs
- Debounced search and filters
- Canvas rendering for complex visualizations

## Future Enhancements

- WebSocket integration for true real-time updates
- Advanced ML models for prediction
- Historical data warehouse
- Custom report builder
- Email/notification alerts
- API endpoint for external access
