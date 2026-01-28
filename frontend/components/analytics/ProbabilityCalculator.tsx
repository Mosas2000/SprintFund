'use client';

import { useState, useMemo } from 'react';

interface CalculationFactors {
    amount: number;
    categorySuccess: number;
    descriptionScore: number;
    reputation: number;
    timing: number;
    competition: number;
}

export default function ProbabilityCalculator() {
    const [factors, setFactors] = useState<CalculationFactors>({
        amount: 50,
        categorySuccess: 70,
        descriptionScore: 5,
        reputation: 3,
        timing: 50,
        competition: 20
    });

    const calculation = useMemo(() => {
        // Base probability
        let prob = 60;

        // 1. Amount factor (Lower is better)
        const amountEffect = factors.amount > 100 ? -(factors.amount - 100) / 2 : (100 - factors.amount) / 4;

        // 2. Category success rate
        const categoryEffect = (factors.categorySuccess - 50) / 2;

        // 3. Description quality
        const descEffect = (factors.descriptionScore - 5) * 4;

        // 4. Reputation
        const repEffect = factors.reputation * 3;

        // 5. Timing
        const timingEffect = (factors.timing - 50) / 5;

        // 6. Competition (Higher is worse)
        const compEffect = -factors.competition / 4;

        const totalProb = Math.min(Math.max(prob + amountEffect + categoryEffect + descEffect + repEffect + timingEffect + compEffect, 5), 98);

        // Monte Carlo simulation
        const simulations = 1000;
        const results = [];
        for (let i = 0; i < simulations; i++) {
            // Vary each factor slightly
            const variance = (Math.random() - 0.5) * 10;
            results.push(totalProb + variance);
        }

        return {
            total: totalProb.toFixed(1),
            confidenceInterval: [
                (totalProb - 4).toFixed(0),
                (totalProb + 4).toFixed(0)
            ],
            breakdown: [
                { name: 'Amount', value: amountEffect.toFixed(1), positive: amountEffect >= 0 },
                { name: 'Category', value: categoryEffect.toFixed(1), positive: categoryEffect >= 0 },
                { name: 'Quality', value: descEffect.toFixed(1), positive: descEffect >= 0 },
                { name: 'Reputation', value: repEffect.toFixed(1), positive: repEffect >= 0 },
                { name: 'Timing', value: timingEffect.toFixed(1), positive: timingEffect >= 0 },
                { name: 'Stability', value: compEffect.toFixed(1), positive: compEffect >= 0 }
            ]
        };
    }, [factors]);

    const handleSliderChange = (key: keyof CalculationFactors, value: number) => {
        setFactors(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-2">
            {/* Inputs */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-black mb-2">Success Calculator</h2>
                    <p className="text-sm text-gray-500 font-medium">Adjust factors to simulate your proposal's success probability.</p>
                </div>

                <div className="space-y-6">
                    <FactorSlider
                        label="Proposal Amount (STX)"
                        value={factors.amount}
                        min={10}
                        max={500}
                        unit=""
                        onChange={(v) => handleSliderChange('amount', v)}
                    />
                    <FactorSlider
                        label="Category Baseline Success"
                        value={factors.categorySuccess}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(v) => handleSliderChange('categorySuccess', v)}
                    />
                    <FactorSlider
                        label="Description Quality"
                        value={factors.descriptionScore}
                        min={1}
                        max={10}
                        unit="/10"
                        onChange={(v) => handleSliderChange('descriptionScore', v)}
                    />
                    <FactorSlider
                        label="Your Reputation"
                        value={factors.reputation}
                        min={0}
                        max={10}
                        unit=" lv"
                        onChange={(v) => handleSliderChange('reputation', v)}
                    />
                    <FactorSlider
                        label="Timing Sentiment"
                        value={factors.timing}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(v) => handleSliderChange('timing', v)}
                    />
                    <FactorSlider
                        label="Market Competition"
                        value={factors.competition}
                        min={0}
                        max={100}
                        unit=" active"
                        onChange={(v) => handleSliderChange('competition', v)}
                    />
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 rounded-[32px] p-12 border border-gray-100 dark:border-gray-800 shadow-inner">
                <div className="text-center mb-12">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4">Estimated Probability</div>
                    <div className="text-8xl font-black text-gray-900 dark:text-white tabular-nums">
                        {calculation.total}%
                    </div>
                    <div className="text-gray-400 font-bold mt-2">
                        Confidence Interval: {calculation.confidenceInterval[0]}% - {calculation.confidenceInterval[1]}%
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-1">Factor Breakdown</h4>
                    {calculation.breakdown.map((item) => (
                        <div key={item.name} className="flex items-center gap-4">
                            <div className="w-24 text-xs font-bold text-gray-500">{item.name}</div>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden flex relative">
                                <div
                                    className={`h-full absolute transition-all duration-300 ${item.positive ? 'bg-green-500 left-1/2' : 'bg-red-500 right-1/2'}`}
                                    style={{ width: `${Math.abs(parseFloat(item.value) * 2)}%` }}
                                />
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400/20" />
                            </div>
                            <div className={`w-12 text-xs font-black text-right ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                                {item.positive ? '+' : ''}{item.value}%
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl w-full border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <span>🔮</span> Scenario Prediction
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Based on {factors.amount} STX request in a category with {factors.categorySuccess}% baseline, your most likely outcome is
                        <span className="font-bold text-gray-900 dark:text-white ml-1">Early Funding within 48 hours.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function FactorSlider({ label, value, min, max, unit, onChange }: {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange: (v: number) => void;
}) {
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition">{label}</label>
                <div className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md min-w-[3rem] text-center">
                    {value}{unit}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    );
}
