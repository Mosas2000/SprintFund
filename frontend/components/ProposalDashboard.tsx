import React, { useMemo } from 'react';
import { PaginatedProposalList } from './PaginatedProposalList';
import { ProposalFilterPanel } from './ProposalFilterPanel';
import { ProposalSortbar } from './ProposalSortbar';
import { useProposalFilters } from '@/hooks/useProposalFilters';

interface ProposalDashboardProps {
  onProposalSelect?: (proposalId: string) => void;
}

export const ProposalDashboard: React.FC<ProposalDashboardProps> = ({
  onProposalSelect,
}) => {
  const { filters, sort, updateFilter, updateSort, clearFilters } = useProposalFilters();
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
    updateFilter('status', status);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateFilter('category', category);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateSort(sortBy, sortOrder);
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
