import React from 'react';

interface TreasuryBalanceProps {
    balance: number;
    allocated?: number;
    currency?: string;
}

export default function TreasuryBalance({ balance, allocated = 0, currency = 'STX' }: TreasuryBalanceProps) {
    const available = balance - allocated;
    const allocationPercentage = balance > 0 ? (allocated / balance) * 100 : 0;

    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold opacity-90">Treasury Balance</h3>
                <div className="text-3xl">💰</div>
            </div>

            {/* Total Balance */}
            <div className="mb-6">
                <div className="text-sm opacity-75 mb-1">Total Balance</div>
                <div className="text-4xl font-bold">
                    {formatAmount(balance)} <span className="text-2xl opacity-90">{currency}</span>
                </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-xs opacity-75 mb-1">Available</div>
                    <div className="text-xl font-semibold">
                        {formatAmount(available)} {currency}
                    </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-xs opacity-75 mb-1">Allocated</div>
                    <div className="text-xl font-semibold">
                        {formatAmount(allocated)} {currency}
                    </div>
                </div>
            </div>

            {/* Allocation Progress Bar */}
            {allocated > 0 && (
                <div>
                    <div className="flex items-center justify-between text-xs opacity-75 mb-2">
                        <span>Allocation</span>
                        <span>{allocationPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/60 rounded-full transition-all duration-500"
                            style={{ width: `${allocationPercentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
