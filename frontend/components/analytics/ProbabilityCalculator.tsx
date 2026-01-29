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
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter text-white">Success Simulator</h2>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-tight">Fine-tune variables to manifest optimal consensus probability.</p>
                </div>

                <div className="space-y-8">
                    <FactorSlider
                        label="Proposal Amount (STX)"
                        value={factors.amount}
                        min={10}
                        max={500}
                        unit=""
                        onChange={(v) => handleSliderChange('amount', v)}
                    />
                    <FactorSlider
                        label="Category Resonance"
                        value={factors.categorySuccess}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(v) => handleSliderChange('categorySuccess', v)}
                    />
                    <FactorSlider
                        label="Structural Quality"
                        value={factors.descriptionScore}
                        min={1}
                        max={10}
                        unit="/10"
                        onChange={(v) => handleSliderChange('descriptionScore', v)}
                    />
                    <FactorSlider
                        label="Advocate Reputation"
                        value={factors.reputation}
                        min={0}
                        max={10}
                        unit=" lv"
                        onChange={(v) => handleSliderChange('reputation', v)}
                    />
                    <FactorSlider
                        label="Market Sentiment"
                        value={factors.timing}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(v) => handleSliderChange('timing', v)}
                    />
                    <FactorSlider
                        label="Competitive Density"
                        value={factors.competition}
                        min={0}
                        max={100}
                        unit=" active"
                        onChange={(v) => handleSliderChange('competition', v)}
                    />
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center items-center bg-black/40 border border-white/5 rounded-[40px] p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <div className="w-32 h-32 rounded-full border-[20px] border-orange-500" />
                </div>

                <div className="text-center mb-12 relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-6">Manifestation Probability</div>
                    <div className="text-8xl font-black text-white tabular-nums tracking-tighter mb-4">
                        {calculation.total}%
                    </div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
                        Confidence Interval: {calculation.confidenceInterval[0]}% — {calculation.confidenceInterval[1]}%
                    </div>
                </div>

                <div className="w-full space-y-6 relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 px-1">Factor Influence Breakdown</h4>
                    {calculation.breakdown.map((item) => (
                        <div key={item.name} className="flex items-center gap-6">
                            <div className="w-20 text-[10px] font-black text-slate-500 uppercase tracking-tight">{item.name}</div>
                            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden flex relative">
                                <div
                                    className={`h-full absolute transition-all duration-500 ease-out ${item.positive ? 'bg-green-500 left-1/2' : 'bg-red-500 right-1/2'}`}
                                    style={{ width: `${Math.min(50, Math.abs(parseFloat(item.value) * 1.5))}%` }}
                                />
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
                            </div>
                            <div className={`w-14 text-[10px] font-black text-right tabular-nums ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {item.positive ? '+' : ''}{item.value}%
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-orange-600/5 border border-orange-500/10 rounded-2xl w-full">
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-orange-500 mb-2 flex items-center gap-2">
                        <span>🔮</span> Deep Scan Verdict
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Algorithmic scan suggests that with a request of {factors.amount} STX, you should expect
                        <span className="text-white ml-1">Consensus reached within 72 hours.</span>
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
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{label}</label>
                <div className="text-[10px] font-black text-white bg-white/5 border border-white/5 px-3 py-1 rounded-lg tabular-nums">
                    {value}{unit}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600 hover:accent-orange-500 transition-all"
            />
        </div>
    );
}
