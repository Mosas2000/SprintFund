import React, { useState } from 'react';

interface PaginationLimiterProps {
  currentLimit: number;
  onLimitChange: (limit: number) => void;
  availableLimits?: number[];
}

export const PaginationLimiter: React.FC<PaginationLimiterProps> = ({
  currentLimit,
  onLimitChange,
  availableLimits = [5, 10, 15, 20, 25, 50, 100],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2"
      >
        Show {currentLimit}
        <span className="text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          {availableLimits.map((limit) => (
            <button
              key={limit}
              onClick={() => {
                onLimitChange(limit);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${
                limit === currentLimit ? 'bg-blue-50 font-semibold text-blue-600' : ''
              }`}
            >
              {limit} items
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
