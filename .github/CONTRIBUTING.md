# Contributing Guide

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git 2.40 or later
- Clarinet 1.7+ (for smart contract development)

### Setup Development Environment

```bash
git clone https://github.com/your-username/sprintfund.git
cd sprintfund
npm install
cd frontend && npm install && cd ..
```

### Development Workflow

1. Create feature branch from main
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test locally
   ```bash
   npm test
   cd frontend && npm run lint && npm run build && cd ..
   ```

3. Commit changes with descriptive messages
   ```bash
   git commit -m "feat: add transaction history tracking"
   ```

4. Push to your fork
   ```bash
   git push origin feature/your-feature
   ```

5. Create Pull Request on GitHub

## Code Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**: feat, fix, docs, style, refactor, perf, test, chore
**Scope**: Feature area (transactions, proposals, voting, etc.)
**Subject**: Present tense, imperative mood, no period

**Example**:
```
feat(transactions): add transaction status polling

- Implement 15-second polling interval
- Add support for pending/confirmed/failed states
- Persist history to localStorage

Fixes #42
```

### Branch Naming

- Feature: `feature/descriptive-name`
- Bugfix: `fix/issue-description`
- Hotfix: `hotfix/urgent-issue`
- Refactor: `refactor/area-name`
- Documentation: `docs/section-name`

**Examples**:
- `feature/transaction-history`
- `fix/async-error-handling`
- `refactor/component-organization`

### Before Submitting PR

1. **Run all local checks**:
   ```bash
   npm test
   npm run lint:check
   npm run type:check
   cd frontend && npm run build
   ```

2. **Update documentation** if needed

3. **Add tests** for new functionality

4. **Rebase on main** if behind
   ```bash
   git fetch origin
   git rebase origin/main
   ```

5. **Force push only if rebased**
   ```bash
   git push -f origin your-branch
   ```

## CI/CD Pipeline

All pull requests automatically run through our CI/CD pipeline. Understanding the process helps you submit faster-approving changes.

### Automated Checks

The pipeline runs the following checks automatically:

#### Contract Checks (5 min)
- Clarinet validation
- Smart contract syntax
- Type checking

#### Frontend Checks (8 min)
- ESLint (strict mode, 0 warnings)
- TypeScript compilation
- Jest tests
- Build verification

#### Security Scans (10 min)
- CodeQL analysis
- Dependency audit
- Secret scanning
- SBOM generation

#### Deployment Preview (3 min)
- Preview build on Vercel
- URL posted to PR
- Live testing available

### Making CI Pass

#### ESLint Failures

```bash
cd frontend
npm run lint:fix
npm run format
git add .
git commit -m "style: format code"
git push
```

#### Type Errors

```bash
cd frontend
npm run type:check

# Review errors and fix
# Then test
npm run build
```

#### Test Failures

```bash
npm test

# Run specific test
npm test -- src/specific.test.ts

# Update snapshots if needed
npm test -- -u
```

#### Build Failures

```bash
cd frontend
npm run clean
npm install
npm run build
```

### Skipping Checks for Documentation

Document-only changes can skip some checks:

```bash
git commit -m "docs: update README

[skip ci]"
```

Use `[skip ci]` only for documentation/non-code changes.

## Pull Request Guidelines

### PR Title Format

Similar to commit messages:
```
feat(scope): Short description
fix(scope): What was broken and how it's fixed
docs(scope): What documentation was added
```

### PR Description Template

```markdown
## Description
Explain what changes you're making and why.

## Related Issues
Fixes #123
Related to #456

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested these changes.

## Screenshots/Videos
For UI changes, include visual proof.

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] No new warnings
- [ ] Works on mobile
```

### Before Merging

1. All CI checks must pass (green checkmarks)
2. At least one approval from team member
3. No unresolved conversations
4. Branch up to date with main
5. No merge conflicts

## Local Development

### Smart Contract Development

```bash
npx clarinet check
npm test

# Run specific contract test
npm test -- tests/units/voting.test.ts
```

### Frontend Development

```bash
cd frontend

npm run dev
# Server runs on http://localhost:3000

npm run build
npm run lint
npm run format
```

### Testing Transactions Locally

1. Start dev server
2. Connect wallet (Testnet)
3. Use script to create test transactions
   ```bash
   ./create-test-proposal.sh
   ```
4. Observe transaction tracking in UI

## Performance Considerations

### Bundle Size

Keep frontend bundle under 500KB:
```bash
cd frontend
npm run build
# Check .next build size
```

### Contract Gas Usage

Keep contract calls under 10,000 cycles:
```bash
npx clarinet test
```

### API Response Times

Keep median response time under 500ms:
- Monitor in .github/workflows logs
- Optimize Stacks API calls
- Add caching where appropriate

## Documentation

### Update README for

- New features
- Configuration changes
- Breaking changes
- New dependencies

### Update Architecture Docs for

- Significant refactors
- New systems/services
- Changed data flows

### Update API Docs for

- New contract functions
- New API endpoints
- Parameter changes

## Accessibility

All UI changes must maintain or improve accessibility:

1. Semantic HTML
   ```html
   <button>, <nav>, <main>, not <div> with onclick
   ```

2. ARIA labels where needed
   ```jsx
   <button aria-label="Close dialog">×</button>
   ```

3. Keyboard navigation
   ```
   Tab through all interactive elements
   ```

4. Color contrast
   ```
   WCAG AA minimum (4.5:1 for text)
   ```

5. Test with screen readers
   ```bash
   Use VoiceOver (Mac) or NVDA (Windows)
   ```

## Security Guidelines

### Never Commit

- API keys or secrets
- Private keys
- Database credentials
- Authentication tokens

### Use Environment Variables

```bash
# .env.local (not committed)
NEXT_PUBLIC_API_URL=...
STACKS_API_KEY=...

# In code
const apiKey = process.env.STACKS_API_KEY;
```

### Run Security Checks

```bash
npm audit
npm security:audit

# Fix vulnerabilities
npm audit fix
```

## Getting Help

### Questions?

1. Check existing documentation
2. Search closed issues
3. Ask in discussion
4. Comment on related issue

### Code Review Feedback

- Ask for clarification
- Request changes using PR review
- Reply to conversations
- Update based on feedback
- Mark resolved when done

### Debugging CI Failures

1. Check workflow logs
2. Review error message
3. Reproduce locally
4. Check GitHub Actions troubleshooting guide
5. Ask in PR comments

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes for significant work
- Given roles/badges for consistent contribution

## Questions About Contributing?

Open an issue with `question` label or ask in discussions.
