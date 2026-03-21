'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

export interface DateRangeFilterProps {
  onRangeChange: (startDate: Date, endDate: Date) => void;
  defaultRange?: 'week' | 'month' | 'all';
}

const presets = {
  week: { label: 'Last 7 Days', days: 7 },
  month: { label: 'Last 30 Days', days: 30 },
  quarter: { label: 'Last 90 Days', days: 90 },
  all: { label: 'All Time', days: null },
};

export function DateRangeFilter({
  onRangeChange,
  defaultRange = 'month',
}: DateRangeFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState(defaultRange);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePresetChange = (preset: 'week' | 'month' | 'quarter' | 'all') => {
    setSelectedPreset(preset);
    setShowCustom(false);

    const endDate = new Date();
    const startDate = new Date();

    const presetConfig = presets[preset];
    if (presetConfig.days) {
      startDate.setDate(startDate.getDate() - presetConfig.days);
    } else {
      startDate.setFullYear(2020);
    }

    onRangeChange(startDate, endDate);
  };

  const handleCustomRangeChange = () => {
    if (!customStart || !customEnd) return;

    const startDate = new Date(customStart);
    const endDate = new Date(customEnd);

    if (startDate <= endDate) {
      onRangeChange(startDate, endDate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Time Range</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(presets).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handlePresetChange(key as keyof typeof presets)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              selectedPreset === key
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
      >
        {showCustom ? 'Hide' : 'Show'} Custom Range
      </button>

      {showCustom && (
        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/60 mb-2">Start Date</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">End Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <button
            onClick={handleCustomRangeChange}
            disabled={!customStart || !customEnd}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Apply Custom Range
          </button>
        </div>
      )}
    </div>
  );
}
