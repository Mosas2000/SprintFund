export const CATEGORIES = [
    { id: 'development', label: 'Development', color: 'from-blue-500 to-cyan-500' },
    { id: 'design', label: 'Design', color: 'from-purple-500 to-pink-500' },
    { id: 'marketing', label: 'Marketing', color: 'from-green-500 to-emerald-500' },
    { id: 'community', label: 'Community', color: 'from-orange-500 to-red-500' },
    { id: 'research', label: 'Research', color: 'from-indigo-500 to-purple-500' },
    { id: 'other', label: 'Other', color: 'from-gray-500 to-slate-500' },
];

interface CategoryTagsProps {
    selected?: string;
    onSelect?: (category: string) => void;
    displayOnly?: boolean;
}

export default function CategoryTags({ selected, onSelect, displayOnly = false }: CategoryTagsProps) {
    if (displayOnly && selected) {
        const category = CATEGORIES.find(c => c.id === selected);
        if (!category) return null;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}>
                {category.label}
            </span>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelect?.(category.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selected === category.id
                            ? `bg-gradient-to-r ${category.color} text-white`
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}
