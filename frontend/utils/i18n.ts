'use client';

import { create } from 'zustand';

type Language = 'en' | 'es' | 'zh';

const translations = {
    en: {
        welcome: 'Welcome to SprintFund',
        fundIdeas: 'Fund ideas in 24 hours',
        createProposal: 'Create Proposal',
        connectWallet: 'Connect Wallet',
        activeProposals: 'Active Proposals',
    },
    es: {
        welcome: 'Bienvenido a SprintFund',
        fundIdeas: 'Financia ideas en 24 horas',
        createProposal: 'Crear Propuesta',
        connectWallet: 'Conectar Billetera',
        activeProposals: 'Propuestas Activas',
    },
    zh: {
        welcome: '欢迎来到 SprintFund',
        fundIdeas: '在 24 小时内资助创意',
        createProposal: '创建提案',
        connectWallet: '连接钱包',
        activeProposals: '活跃提案',
    }
};

interface I18nState {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
    lang: 'en',
    setLang: (lang) => set({ lang }),
    t: (key) => translations[get().lang][key] || translations['en'][key],
}));
