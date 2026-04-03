export const errorBoundaryExamples = {
  proposalList: `
import { ProposalListErrorBoundary } from '@/components/error-boundaries';
import { ProposalList } from '@/components/ProposalList';

export function ProposalListSection() {
  return (
    <ProposalListErrorBoundary>
      <ProposalList />
    </ProposalListErrorBoundary>
  );
}
  `,

  analyticsDashboard: `
import { AnalyticsDashboardErrorBoundary } from '@/components/error-boundaries';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export function AnalyticsSection() {
  return (
    <AnalyticsDashboardErrorBoundary>
      <AnalyticsDashboard />
    </AnalyticsDashboardErrorBoundary>
  );
}
  `,

  votingInterface: `
import { VotingInterfaceErrorBoundary } from '@/components/error-boundaries';
import { VotingUI } from '@/components/VotingUI';

export function VotingSection() {
  return (
    <VotingInterfaceErrorBoundary>
      <VotingUI />
    </VotingInterfaceErrorBoundary>
  );
}
  `,

  completeLayout: `
import { 
  ProposalListErrorBoundary, 
  AnalyticsDashboardErrorBoundary,
  DashboardStatsErrorBoundary,
  TransactionHistoryErrorBoundary 
} from '@/components/error-boundaries';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <DashboardStatsErrorBoundary>
        <DashboardStats />
      </DashboardStatsErrorBoundary>

      <div className="grid grid-cols-2 gap-6">
        <ProposalListErrorBoundary>
          <ProposalList />
        </ProposalListErrorBoundary>

        <AnalyticsDashboardErrorBoundary>
          <AnalyticsDashboard />
        </AnalyticsDashboardErrorBoundary>
      </div>

      <TransactionHistoryErrorBoundary>
        <TransactionHistory />
      </TransactionHistoryErrorBoundary>
    </div>
  );
}
  `,

  errorTracking: `
import { useErrorTracking } from '@/hooks/useErrorTracking';

export function MyComponent() {
  const { logError, logInfo, logWarning } = useErrorTracking('MyComponent');

  const handleSubmit = async (data: any) => {
    try {
      logInfo('Submitting form');
      await submitForm(data);
      logInfo('Form submitted successfully');
    } catch (error) {
      logError(error as Error, 'high');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
  `,
};
