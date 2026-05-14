---
title: "Implement Proposal Templates System"
labels: feature, contract, enhancement
assignees: 
milestone: V4 Migration
---

## Description

Add a proposal templates system to standardize common proposal types and improve proposal quality. Templates will guide users through creating well-structured proposals with appropriate funding ranges and milestone requirements.

## Requirements

### Contract Changes

Add the following to `sprintfund-core-v4.clar`:

```clarity
;; Template storage
(define-map templates
  { template-id: uint }
  {
    name: (string-utf8 50),
    description: (string-utf8 200),
    suggested-amount-min: uint,
    suggested-amount-max: uint,
    required-milestones: uint,
    active: bool,
    created-by: principal
  }
)

;; Template counter
(define-data-var template-count uint u0)

;; Functions
(define-public (create-template ...) ...)
(define-public (toggle-template ...) ...)
(define-read-only (get-template ...) ...)
(define-read-only (get-template-count) ...)
```

### Default Templates to Create

1. **Development Grant**
   - Amount: 50-200 STX
   - Milestones: 2-3
   - Description: For software development projects

2. **Marketing Campaign**
   - Amount: 30-150 STX
   - Milestones: 1-2
   - Description: For promotional activities

3. **Community Event**
   - Amount: 20-100 STX
   - Milestones: 1
   - Description: For meetups and events

4. **Infrastructure**
   - Amount: 100-500 STX
   - Milestones: 3-5
   - Description: For infrastructure improvements

5. **Research Project**
   - Amount: 50-300 STX
   - Milestones: 2-4
   - Description: For research and analysis

## Frontend Implementation

### New Components

Create the following components:

1. **`TemplateSelector.tsx`**
   - Grid layout of available templates
   - Template cards with icons
   - Filter by category
   - Search functionality

2. **`TemplateCard.tsx`**
   - Template name and description
   - Suggested amount range
   - Required milestones indicator
   - "Use Template" button

3. **`TemplatePreview.tsx`**
   - Detailed template information
   - Example proposals using template
   - Success rate statistics
   - Usage count

### Updates to Existing Components

**`CreateProposalForm.tsx`:**
- Add template selection step at the beginning
- Pre-fill form fields based on selected template
- Show suggested amount range with validation
- Enforce milestone requirements
- Display template description as guidance
- Allow customization after template selection

**UI/UX Flow:**
```
1. User clicks "Create Proposal"
2. Template selection screen appears (optional, can skip)
3. User selects template or clicks "Start from scratch"
4. Form pre-fills with template suggestions
5. User customizes and submits
```

## API Integration

### New Functions

Add to `frontend/src/lib/stacks.ts`:

```typescript
export async function getTemplate(templateId: number): Promise<Template | null>
export async function getAllTemplates(): Promise<Template[]>
export async function getTemplateCount(): Promise<number>
export async function callCreateTemplate(...): Promise<void>
export async function callToggleTemplate(...): Promise<void>
```

### Caching Strategy

- Cache templates in localStorage
- Refresh on page load
- Invalidate on admin updates
- Cache duration: 1 hour

## Testing

### Contract Tests

```typescript
describe("Template System", () => {
  it("should create template (admin only)")
  it("should prevent non-admin from creating templates")
  it("should toggle template active status")
  it("should fetch template by ID")
  it("should list all active templates")
  it("should validate template constraints")
})
```

### Frontend Tests

```typescript
describe("TemplateSelector", () => {
  it("should display all active templates")
  it("should filter templates by category")
  it("should search templates by name")
  it("should select template and pre-fill form")
  it("should allow skipping template selection")
})
```

### Integration Tests

```typescript
describe("Template-based Proposal Creation", () => {
  it("should create proposal using template")
  it("should enforce template milestone requirements")
  it("should validate amount within template range")
  it("should track template usage statistics")
})
```

## Documentation

- [ ] Add template guide to README.md
- [ ] Document template structure in ARCHITECTURE.md
- [ ] Create template creation guide for admins
- [ ] Add examples to CONTRIBUTING.md
- [ ] Create video tutorial for using templates

## Acceptance Criteria

- [ ] Contract functions implemented and tested
- [ ] 5 default templates created on deployment
- [ ] Frontend components created and integrated
- [ ] Template selection works in proposal creation flow
- [ ] Admin can create/toggle templates
- [ ] Templates cached efficiently
- [ ] Documentation complete
- [ ] Tests passing with >90% coverage

## Design Mockups

### Template Selection Screen
```
┌─────────────────────────────────────────────┐
│  Choose a Template (Optional)               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Dev    │ │Marketing│ │Community│       │
│  │ Grant   │ │Campaign │ │  Event  │       │
│  │ 50-200  │ │ 30-150  │ │ 20-100  │       │
│  │  STX    │ │  STX    │ │  STX    │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│  [Start from Scratch]                       │
└─────────────────────────────────────────────┘
```

## Related Issues

- #3 Implement Milestone Tracking System
- #6 Frontend Contract Integration Updates
- #10 Documentation and Migration Guide

## References

- Contract: `contracts/sprintfund-core-v4.clar`
- Component: `frontend/components/TemplateSelector.tsx`
- API: `frontend/src/lib/stacks.ts`
