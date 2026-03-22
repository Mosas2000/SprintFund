# Branch Protection Configuration

This file documents the recommended branch protection rules for the SprintFund repository.

## Main Branch Protection Rules

Apply these settings to the `main` branch:

### Required Status Checks
Enable the following required status checks:

- `Contract Checks` - Smart contract validation
- `Contract Tests` - Clarinet contract tests
- `Frontend Lint` - ESLint validation
- `Frontend Build` - Next.js build verification
- `Frontend Tests` - Unit and integration tests
- `TypeScript Type Check` - Type safety verification
- `Code Quality` - Code quality gates
- `Build Status` - Overall build status

### Review Requirements
- ✅ Require pull request reviews before merging
- ✅ Require approvals: 1
- ✅ Require review from code owners
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### Restrictions
- ✅ Include administrators in restrictions
- ✅ Restrict who can push to matching branches
- ✅ Allow forced pushes: Disable
- ✅ Allow deletions: Disable

### Rulesets
- ✅ Bypass list: GitHub Actions deployments only

## Develop Branch Protection Rules

Apply these settings to the `develop` branch:

### Required Status Checks
- `Contract Checks`
- `Contract Tests`
- `Frontend Lint`
- `Frontend Build`
- `Frontend Tests`
- `TypeScript Type Check`

### Review Requirements
- ✅ Require pull request reviews: 1
- ✅ Require code owner review
- ✅ Dismiss stale approvals on new commits

### Restrictions
- ✅ Require status checks to pass
- ✅ Require up to date branches

## GitHub CLI Setup

To apply these rules programmatically:

```bash
# Main branch
gh repo edit --add-topic ci-cd-enabled

# List current rules
gh api repos/{owner}/{repo}/rulesets

# Enable required checks
gh api repos/{owner}/{repo}/branch-protection-rules/main \
  -f required_status_checks='{"strict": true, "contexts": ["ci/github/contract-checks", "ci/github/contract-tests", "ci/github/frontend-lint", "ci/github/frontend-build", "ci/github/frontend-tests", "ci/github/type-check"]}' \
  -f require_code_owner_reviews=true \
  -f required_pull_request_reviews='{"required_approving_review_count": 1}'
```

## Manual Setup Steps

1. Go to repository Settings
2. Navigate to Branches section
3. Add rule for `main` branch
4. Configure status checks as listed above
5. Enable dismissal of stale reviews
6. Enable restrictions for administrators
7. Repeat for `develop` branch

## Enforcement

- All PR checks must pass before merge
- At least 1 approval required
- Code owner approval required
- No force pushes allowed
- Branch must be up to date
- Administrators cannot bypass rules

## Rollout Timeline

1. **Week 1**: Enable on main branch only
2. **Week 2**: Enable on develop branch
3. **Week 3**: Enable on feature/develop branches
4. **Week 4**: Enforce for all developers

## Testing the Rules

After configuration, verify by:

1. Create test PR without passing checks - should be blocked
2. Create test PR with passing checks but no approval - should be blocked
3. Create test PR with approval but failing checks - should be blocked
4. Create valid PR with all checks and approval - should allow merge
5. Try force push to protected branch - should be blocked

## Updates and Maintenance

Review branch protection settings:
- Monthly: Check if requirements still align with project needs
- After major changes: Update required checks if new checks added
- Quarterly: Audit approval requirements and enforce

## Troubleshooting

### PR merge button is grayed out
- All required checks not yet passed
- Approval not yet granted
- Branch not up to date
- Administrator override in progress

### Required check not showing up
- Check Actions workflow is configured correctly
- Verify workflow names match required check names
- Run workflow on current branch to register it

### Cannot push to main branch
- Main is protected
- Use feature branch instead
- Create PR for changes
- Follow normal review process
