'use client';

import { useState } from 'react';

export default function QuadraticVotingCalculator() {
  const [weight, setWeight] = useState(1);
  const cost = weight * weight; // Quadratic voting formula

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Quadratic Voting Calculator
      </h3>
      
      {/* Formula Explanation */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">
          How Quadratic Voting Works
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
          Cost = (Vote Weight)² STX
        </p>
        <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
          <p>• Weight 1 = 1 STX (1² = 1)</p>
          <p>• Weight 2 = 4 STX (2² = 4)</p>
          <p>• Weight 3 = 9 STX (3² = 9)</p>
          <p>• Weight 4 = 16 STX (4² = 16)</p>
          <p>• Weight 5 = 25 STX (5² = 25)</p>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Select Vote Weight: {weight}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Cost Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white text-center mb-4">
        <div className="text-sm opacity-90 mb-1">Total Cost</div>
        <div className="text-4xl font-bold">{cost} STX</div>
        <div className="text-sm opacity-75 mt-1">for {weight} vote weight</div>
      </div>

      {/* Examples */}
      <div className="border-t dark:border-gray-700 pt-4">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white text-sm">
          💡 Why Quadratic Voting?
        </h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>✓ Prevents whale dominance</li>
          <li>✓ Costs increase exponentially with vote weight</li>
          <li>✓ Encourages balanced participation</li>
          <li>✓ Fair representation for all stakeholders</li>
        </ul>
      </div>

      {/* Formula Visual */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded text-center">
        <code className="text-xs text-gray-700 dark:text-gray-300">
          {weight}² = {weight} × {weight} = {cost} STX
        </code>
      </div>
    </div>
  );
}
