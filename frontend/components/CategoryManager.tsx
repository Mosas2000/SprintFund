'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  parent?: string;
  icon: string;
  color: string;
  count: number;
}

interface Tag {
  name: string;
  count: number;
  trending: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'defi', name: 'DeFi', icon: '💰', color: 'green', count: 45 },
  { id: 'defi-lending', name: 'Lending', parent: 'defi', icon: '🏦', color: 'green', count: 12 },
  { id: 'defi-dex', name: 'DEX', parent: 'defi', icon: '🔄', color: 'green', count: 18 },
  { id: 'nft', name: 'NFTs', icon: '🎨', color: 'purple', count: 32 },
  { id: 'nft-marketplace', name: 'Marketplace', parent: 'nft', icon: '🛒', color: 'purple', count: 15 },
  { id: 'nft-gaming', name: 'Gaming', parent: 'nft', icon: '🎮', color: 'purple', count: 10 },
  { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️', color: 'blue', count: 28 },
  { id: 'infrastructure-tools', name: 'Developer Tools', parent: 'infrastructure', icon: '🔧', color: 'blue', count: 14 },
  { id: 'governance', name: 'Governance', icon: '⚖️', color: 'orange', count: 19 },
  { id: 'community', name: 'Community', icon: '👥', color: 'pink', count: 24 }
];

const POPULAR_TAGS: Tag[] = [
  { name: 'stacks', count: 156, trending: true },
  { name: 'clarity', count: 89, trending: true },
  { name: 'bitcoin', count: 76, trending: false },
  { name: 'defi', count: 67, trending: true },
  { name: 'nft', count: 54, trending: false },
  { name: 'dao', count: 43, trending: true },
  { name: 'web3', count: 38, trending: false },
  { name: 'developer-tools', count: 32, trending: false },
  { name: 'smart-contracts', count: 29, trending: false },
  { name: 'dapp', count: 25, trending: true }
];

interface CategoryManagerProps {
  selectedCategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (categoryId: string) => void;
  onTagsChange?: (tags: string[]) => void;
}

export default function CategoryManager({
  selectedCategory = '',
  selectedTags = [],
  onCategoryChange,
  onTagsChange
}: CategoryManagerProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['defi', 'nft', 'infrastructure']);
  const [searchTag, setSearchTag] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange?.(updated);
  };

  const addCustomTag = () => {
    if (searchTag && !selectedTags.includes(searchTag) && !customTags.includes(searchTag)) {
      setCustomTags([...customTags, searchTag]);
      toggleTag(searchTag);
      setSearchTag('');
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300',
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300',
      pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300'
    };
    return colors[color] || colors.blue;
  };

  const topLevelCategories = CATEGORIES.filter(c => !c.parent);
  const getChildren = (parentId: string) => CATEGORIES.filter(c => c.parent === parentId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6">🗂️ Categories & Tags</h3>

      {/* Hierarchical Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {topLevelCategories.map(category => {
            const children = getChildren(category.id);
            const isExpanded = expandedCategories.includes(category.id);
            const isSelected = selectedCategory === category.id;

            return (
              <div key={category.id}>
                <button
                  onClick={() => {
                    onCategoryChange?.(category.id);
                    if (children.length > 0) toggleCategory(category.id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                    isSelected
                      ? getColorClasses(category.color) + ' ring-2 ring-offset-2 ring-' + category.color + '-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {children.length > 0 && (
                      <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                    )}
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>

                {/* Child Categories */}
                {isExpanded && children.length > 0 && (
                  <div className="ml-10 mt-2 space-y-2">
                    {children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => onCategoryChange?.(child.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
                          selectedCategory === child.id
                            ? getColorClasses(child.color)
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{child.icon}</span>
                          <span className="text-sm">{child.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{child.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Tags</h4>

        {/* Tag Search/Add */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="Search or add custom tag..."
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
          />
          <button
            onClick={addCustomTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Selected Tags:</div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2 hover:bg-blue-700"
                >
                  {tag}
                  <span className="text-xs">✕</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.filter(tag =>
            tag.name.toLowerCase().includes(searchTag.toLowerCase())
          ).map(tag => {
            const isSelected = selectedTags.includes(tag.name);
            return (
              <button
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag.trending && <span className="mr-1">🔥</span>}
                {tag.name}
                <span className="ml-1 text-xs opacity-70">({tag.count})</span>
              </button>
            );
          })}
        </div>

        {/* Custom Tags */}
        {customTags.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Custom Tags:</div>
            <div className="flex flex-wrap gap-2">
              {customTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category-Specific Templates */}
      {selectedCategory && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">💡 Quick Tip:</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Use category-specific templates to quickly create proposals with pre-filled fields relevant to{' '}
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
