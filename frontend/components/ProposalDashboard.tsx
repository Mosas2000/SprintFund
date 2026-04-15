import React from 'react';
import { PaginatedProposalList } from './PaginatedProposalList';
import { ProposalFilterPanel } from './ProposalFilterPanel';
import { ProposalSortbar } from './ProposalSortbar';
import { useProposalFilters } from '@/hooks/useProposalFilters';

interface ProposalDashboardProps {
  onProposalSelect?: (proposalId: number) => void;
}

type ValidSortBy = 'title' | 'createdAt' | 'votes' | 'requestedAmount';

export const ProposalDashboard: React.FC<ProposalDashboardProps> = ({
  onProposalSelect,
}) => {
  const { sort, updateFilter, updateSort } = useProposalFilters();
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
    updateFilter('status', status ?? undefined);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateFilter('category', category ?? undefined);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    // Validate sortBy is one of the allowed values
    const validSortBy: ValidSortBy[] = ['title', 'createdAt', 'votes', 'requestedAmount'];
    if (validSortBy.includes(sortBy as ValidSortBy)) {
      updateSort(sortBy as ValidSortBy, sortOrder);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-64 flex-shrink-0">
          <ProposalFilterPanel
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            currentStatus={selectedStatus || undefined}
            currentCategory={selectedCategory || undefined}
          />
        </div>

        <div className="flex-1 space-y-4">
          <ProposalSortbar
            sortBy={sort.sortBy}
            sortOrder={sort.sortOrder}
            onSortChange={handleSortChange}
          />

          <PaginatedProposalList onProposalSelect={onProposalSelect} />
        </div>
      </div>
    </div>
  );
};
