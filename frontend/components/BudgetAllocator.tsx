'use client';

import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryBudget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
}

interface BudgetPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
}

export default function BudgetAllocator() {
  const [currentPeriod, setCurrentPeriod] = useState<'monthly' | 'quarterly'>('monthly');
  const [budgets, setBudgets] = useState<CategoryBudget[]>([
    { category: 'DeFi', allocated: 200000, spent: 145000, remaining: 55000, percentage: 72.5, color: '#3B82F6' },
    { category: 'NFT', allocated: 150000, spent: 98000, remaining: 52000, percentage: 65.3, color: '#8B5CF6' },
    { category: 'Infrastructure', allocated: 180000, spent: 125000, remaining: 55000, percentage: 69.4, color: '#10B981' },
    { category: 'Community', allocated: 100000, spent: 65000, remaining: 35000, percentage: 65, color: '#F59E0B' },
    { category: 'Marketing', allocated: 70000, spent: 52000, remaining: 18000, percentage: 74.3, color: '#EC4899' }
  ]);

  const [periods] = useState<BudgetPeriod[]>([
    { id: '1', name: 'January 2024', startDate: '2024-01-01', endDate: '2024-01-31', totalBudget: 700000 },
    { id: '2', name: 'Q1 2024', startDate: '2024-01-01', endDate: '2024-03-31', totalBudget: 2100000 }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryBudget | null>(null);
  const [newAllocation, setNewAllocation] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Check for budget alerts
    const newAlerts: string[] = [];
    budgets.forEach(budget => {
      if (budget.percentage >= 90) {
        newAlerts.push(`⚠️ ${budget.category} budget is at ${budget.percentage.toFixed(1)}% - Critical!`);
      } else if (budget.percentage >= 75) {
        newAlerts.push(`⚡ ${budget.category} budget is at ${budget.percentage.toFixed(1)}% - Warning`);
      }
    });
    setAlerts(newAlerts);
  }, [budgets]);

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);

  const utilizationChartData = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        label: 'Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#EF4444',
        borderWidth: 2
      },
      {
        label: 'Remaining',
        data: budgets.map(b => b.remaining),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10B981',
        borderWidth: 2
      }
    ]
  };

  const allocationDoughnutData = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        data: budgets.map(b => b.allocated),
        backgroundColor: budgets.map(b => b.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${(value / 1000).toFixed(0)}K`
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  const editBudget = (category: CategoryBudget) => {
    setEditingCategory(category);
    setNewAllocation(category.allocated);
    setShowEditModal(true);
  };

  const saveBudget = () => {
    if (!editingCategory) return;

    setBudgets(budgets.map(b => 
      b.category === editingCategory.category
        ? {
            ...b,
            allocated: newAllocation,
            remaining: newAllocation - b.spent,
            percentage: (b.spent / newAllocation) * 100
          }
        : b
    ));

    setShowEditModal(false);
    setEditingCategory(null);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'Warning';
    if (percentage >= 50) return 'On Track';
    return 'Healthy';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 Budget Allocator</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track spending against category budgets
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={currentPeriod}
            onChange={(e) => setCurrentPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            + Create Budget Period
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Budget Alerts</h3>
          <div className="space-y-1">
            {alerts.map((alert, idx) => (
              <div key={idx} className="text-sm text-yellow-700 dark:text-yellow-400">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Allocated</div>
          <div className="text-3xl font-bold">{(totalAllocated / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-75 mt-2">STX</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Spent</div>
          <div className="text-3xl font-bold">{(totalSpent / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-75 mt-2">
            {((totalSpent / totalAllocated) * 100).toFixed(1)}% utilized
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Remaining</div>
          <div className="text-3xl font-bold">{(totalRemaining / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-75 mt-2">
            {((totalRemaining / totalAllocated) * 100).toFixed(1)}% available
          </div>
        </div>
      </div>

      {/* Budget Utilization Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Budget Utilization by Category</h3>
        <div className="h-64">
          <Bar data={utilizationChartData} options={chartOptions} />
        </div>
      </div>

      {/* Category Budgets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Category Budget Details</h3>
        <div className="space-y-4">
          {budgets.map(budget => (
            <div key={budget.category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: budget.color }} />
                  <h4 className="font-semibold text-lg">{budget.category}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                    budget.percentage >= 90 ? 'bg-red-500' :
                    budget.percentage >= 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {getStatusText(budget.percentage)}
                  </span>
                </div>
                <button
                  onClick={() => editBudget(budget)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm 
                           hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  ✏️ Edit
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Allocated</div>
                  <div className="font-semibold">{(budget.allocated / 1000).toFixed(0)}K STX</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Spent</div>
                  <div className="font-semibold text-red-600">{(budget.spent / 1000).toFixed(0)}K STX</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Remaining</div>
                  <div className="font-semibold text-green-600">{(budget.remaining / 1000).toFixed(0)}K STX</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${getStatusColor(budget.percentage)}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{budget.percentage.toFixed(1)}% utilized</span>
                <span>{((budget.remaining / budget.allocated) * 100).toFixed(1)}% remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Budget Allocation Distribution</h3>
          <div className="h-64">
            <Doughnut data={allocationDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Budget Period History</h3>
          <div className="space-y-3">
            {periods.map(period => (
              <div
                key={period.id}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{period.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {(period.totalBudget / 1000).toFixed(0)}K STX
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Budget: {editingCategory.category}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Allocated Amount (STX)</label>
              <input
                type="number"
                value={newAllocation}
                onChange={(e) => setNewAllocation(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Current Spent:</span>
                  <span className="font-semibold">{(editingCategory.spent / 1000).toFixed(0)}K STX</span>
                </div>
                <div className="flex justify-between">
                  <span>New Remaining:</span>
                  <span className="font-semibold text-green-600">
                    {((newAllocation - editingCategory.spent) / 1000).toFixed(0)}K STX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>New Utilization:</span>
                  <span className="font-semibold">
                    {((editingCategory.spent / newAllocation) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveBudget}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                         hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
