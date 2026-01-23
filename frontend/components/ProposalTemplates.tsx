'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  category: 'Funding' | 'Governance' | 'Technical' | 'Community';
  description: string;
  fields: {
    title: string;
    description: string;
    amount?: number;
    duration?: number;
    milestones?: string[];
  };
  icon: string;
}

const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'funding-dev',
    name: 'Development Funding',
    category: 'Funding',
    description: 'Request funding for development work',
    icon: '💻',
    fields: {
      title: 'Development Proposal: [Project Name]',
      description: `## Project Overview
[Describe the project and its goals]

## Technical Details
[Technical approach and stack]

## Timeline
[Development milestones and timeline]

## Budget Breakdown
[Detailed cost breakdown]

## Team
[Team members and their roles]`,
      amount: 50000,
      duration: 90,
      milestones: ['Planning & Design', 'Core Development', 'Testing & QA', 'Deployment']
    }
  },
  {
    id: 'funding-marketing',
    name: 'Marketing Campaign',
    category: 'Funding',
    description: 'Request funding for marketing initiatives',
    icon: '📢',
    fields: {
      title: 'Marketing Campaign: [Campaign Name]',
      description: `## Campaign Objectives
[What you want to achieve]

## Target Audience
[Who you're targeting]

## Strategy
[Marketing channels and tactics]

## Expected Outcomes
[Measurable goals and KPIs]

## Budget Allocation
[How funds will be spent]`,
      amount: 20000,
      duration: 60,
      milestones: ['Strategy Development', 'Content Creation', 'Campaign Launch', 'Analysis & Reporting']
    }
  },
  {
    id: 'governance-parameter',
    name: 'Parameter Change',
    category: 'Governance',
    description: 'Propose changes to DAO parameters',
    icon: '⚙️',
    fields: {
      title: 'Governance: Change [Parameter Name]',
      description: `## Current State
[Current parameter values]

## Proposed Changes
[New parameter values]

## Rationale
[Why this change is needed]

## Impact Analysis
[How this affects the DAO]

## Implementation
[Technical details of the change]`,
      duration: 14
    }
  },
  {
    id: 'governance-upgrade',
    name: 'Protocol Upgrade',
    category: 'Governance',
    description: 'Propose protocol or contract upgrades',
    icon: '🔄',
    fields: {
      title: 'Protocol Upgrade: [Upgrade Name]',
      description: `## Upgrade Overview
[What's being upgraded]

## New Features
[List of new features/improvements]

## Security Audit
[Audit details and findings]

## Migration Plan
[How the upgrade will be executed]

## Rollback Plan
[Emergency procedures if issues arise]`,
      duration: 30
    }
  },
  {
    id: 'technical-integration',
    name: 'Integration Proposal',
    category: 'Technical',
    description: 'Propose integration with other protocols',
    icon: '🔗',
    fields: {
      title: 'Integration: [Protocol Name]',
      description: `## Integration Overview
[What protocol and why]

## Technical Approach
[How the integration will work]

## Benefits
[What this brings to the DAO]

## Risks & Mitigation
[Potential risks and how to address them]

## Timeline
[Implementation schedule]`,
      duration: 45,
      milestones: ['Research & Planning', 'Development', 'Testing', 'Deployment']
    }
  },
  {
    id: 'community-event',
    name: 'Community Event',
    category: 'Community',
    description: 'Organize community events or initiatives',
    icon: '🎉',
    fields: {
      title: 'Community Event: [Event Name]',
      description: `## Event Overview
[Event type and purpose]

## Target Participation
[Expected number of participants]

## Logistics
[Location, date, format]

## Activities
[What will happen at the event]

## Budget
[Event costs breakdown]`,
      amount: 10000,
      duration: 30
    }
  }
];

interface ProposalTemplatesProps {
  onTemplateSelect: (template: Template) => void;
}

export default function ProposalTemplates({ onTemplateSelect }: ProposalTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);

  const categories = ['all', 'Funding', 'Governance', 'Technical', 'Community'];

  const filteredTemplates = [
    ...PREDEFINED_TEMPLATES,
    ...customTemplates
  ].filter(t => selectedCategory === 'all' || t.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Funding': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'Governance': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Technical': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Community': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">📝 Proposal Templates</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Create Custom Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat === 'all' ? 'All Templates' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 
                     dark:hover:border-blue-500 transition cursor-pointer"
            onClick={() => setPreviewTemplate(template)}
          >
            <div className="text-3xl mb-3">{template.icon}</div>
            <h4 className="font-semibold mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateSelect(template);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Template →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{previewTemplate.icon}</div>
                  <h3 className="text-xl font-bold mb-1">{previewTemplate.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(previewTemplate.category)}`}>
                    {previewTemplate.category}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Title Template</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                    {previewTemplate.fields.title}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description Template</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm whitespace-pre-wrap">
                    {previewTemplate.fields.description}
                  </div>
                </div>

                {previewTemplate.fields.amount && (
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Amount</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                      {previewTemplate.fields.amount.toLocaleString()} STX
                    </div>
                  </div>
                )}

                {previewTemplate.fields.duration && (
                  <div>
                    <h4 className="font-semibold mb-2">Duration</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                      {previewTemplate.fields.duration} days
                    </div>
                  </div>
                )}

                {previewTemplate.fields.milestones && (
                  <div>
                    <h4 className="font-semibold mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {previewTemplate.fields.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 
                                       text-blue-600 flex items-center justify-center font-medium">
                            {idx + 1}
                          </span>
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
