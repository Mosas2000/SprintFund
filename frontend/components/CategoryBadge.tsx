interface CategoryBadgeProps {
    category: string;
}

const categoryConfig = {
    defi: {
        label: 'DeFi',
        color: 'bg-blue-500',
        icon: '💰'
    },
    nft: {
        label: 'NFT',
        color: 'bg-purple-500',
        icon: '🎨'
    },
    tooling: {
        label: 'Tooling',
        color: 'bg-green-500',
        icon: '🔧'
    },
    infrastructure: {
        label: 'Infrastructure',
        color: 'bg-orange-500',
        icon: '🏗️'
    },
    community: {
        label: 'Community',
        color: 'bg-pink-500',
        icon: '👥'
    },
    other: {
        label: 'Other',
        color: 'bg-gray-500',
        icon: '📋'
    },
    // Map existing categories to new ones
    development: {
        label: 'Development',
        color: 'bg-blue-500',
        icon: '💻'
    },
    design: {
        label: 'Design',
        color: 'bg-purple-500',
        icon: '🎨'
    },
    marketing: {
        label: 'Marketing',
        color: 'bg-green-500',
        icon: '📢'
    },
    research: {
        label: 'Research',
        color: 'bg-orange-500',
        icon: '🔬'
    },
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
    const config = categoryConfig[category.toLowerCase() as keyof typeof categoryConfig] || categoryConfig.other;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}
