import React from 'react';

interface ProposalFilterPanelProps {
  onStatusChange: (status: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  currentStatus?: string;
  currentCategory?: string;
}

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];
const CATEGORY_OPTIONS = ['Development', 'Marketing', 'Operations', 'Research'];

export const ProposalFilterPanel: React.FC<ProposalFilterPanelProps> = ({
  onStatusChange,
  onCategoryChange,
  currentStatus,
  currentCategory,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2">Status</h3>
        <div className="space-y-2">
          <button
            onClick={() => onStatusChange(null)}
            className={`block w-full text-left px-2 py-1 rounded text-sm ${
              !currentStatus
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`block w-full text-left px-2 py-1 rounded text-sm capitalize ${
                currentStatus === status
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-sm mb-2">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left px-2 py-1 rounded text-sm ${
              !currentCategory
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                currentCategory === category
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
