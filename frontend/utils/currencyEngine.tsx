'use client';

import React, { useState, useEffect } from 'react';

export const currencies = [
    { code: 'USD', symbol: '$', rate: 2.45 }, // Example rate: 1 STX = 2.45 USD
    { code: 'EUR', symbol: '€', rate: 2.25 },
    { code: 'BTC', symbol: '₿', rate: 0.000042 },
];

export function useCurrencyConverter() {
    const [currency, setCurrency] = useState(currencies[0]);

    const convert = (stxAmount: number) => {
        return {
            value: (stxAmount * currency.rate).toLocaleString(undefined, {
                maximumFractionDigits: currency.code === 'BTC' ? 8 : 2
            }),
            symbol: currency.symbol,
            code: currency.code
        };
    };

    return { currency, setCurrency, convert, currencies };
}

export default function CurrencyToggle() {
    const { currency, setCurrency, currencies } = useCurrencyConverter();

    return (
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {currencies.map((c) => (
                <button
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currency.code === c.code ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40' : 'text-slate-500 hover:text-white'
                        }`}
                >
                    {c.code}
                </button>
            ))}
        </div>
    );
}
