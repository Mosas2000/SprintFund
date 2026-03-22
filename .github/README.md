# SprintFund CI/CD Pipeline - Quick Reference

## What This Is

Complete automated CI/CD infrastructure for SprintFund, a DAO governance platform on Stacks blockchain.

## What Happens Automatically

When you push code:

1. **Smart Contracts**: Validated and tested (2 min)
2. **Frontend**: Linted, type-checked, tested, built (8 min)
3. **Security**: CodeQL scanned, secrets checked (5 min)
4. **Deploy**: Preview deployed to Vercel if PR (3 min)

**Total**: ~15 minutes, all automatic

## Getting Started

### 1. Configure Secrets (One-time setup)

Go to GitHub Settings → Secrets → Actions

Add these:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

Get from: https://vercel.com/settings/tokens

### 2. Make a Change

```bash
git checkout -b feature/my-feature
# ... make changes ...
git commit -m "feat: add transaction tracking"
git push origin feature/my-feature
```

### 3. Create PR

Go to GitHub → Create Pull Request

Automatic checks will run and post results.

### 4. Deploy

PR approved? Merge to main.

Production deployment runs automatically.

## Documentation

Start here:
- **[Contributing](./CONTRIBUTING.md)** - How to contribute
- **[Environment Setup](./ENV_VARIABLES.md)** - Setup variables
- **[Workflows](./workflows/README.md)** - What each workflow does
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Fix issues
- **[Index](./INDEX.md)** - Full documentation map

## Common Commands

```bash
# View workflow status
gh workflow list

# View recent runs
gh run list --limit 10

# View specific run details
gh run view <run-id> --log

# Re-run failed workflow
gh run rerun <run-id>

# Check workflow file syntax
gh workflow view ci.yml
```

## Status Checks

Must pass before merge:

- ✅ **ci/contract-check** - Smart contract syntax
- ✅ **ci/contract-tests** - Smart contract tests
- ✅ **ci/frontend-lint** - Code quality
- ✅ **ci/frontend-build** - Build succeeds
- ✅ **ci/frontend-tests** - Unit tests pass
- ✅ **ci/type-check** - TypeScript errors
- ✅ **ci/code-quality** - Code analysis

## Performance

| Task | Time | Status |
|------|------|--------|
| Smart contracts | 2 min | ✅ |
| Frontend | 8 min | ✅ |
| Security | 5 min | ✅ |
| Deploy | 3 min | ✅ |
| **Total** | **~15 min** | ✅ |

## Workflows

### On Every Push

- **ci.yml** - Main pipeline
  - Runs on all branches
  - Validates code quality
  - Runs tests

### On Pull Requests

- **ci.yml** - Validation (above)
- **deploy-preview.yml** - Preview deployment
  - Posts URL on PR
  - Test live environment

### On Main Branch Push

- **deploy-production.yml** - Production
  - Deploys to Vercel
  - Goes live immediately

### Scheduled

- **security.yml** - Weekly security scan
- **scheduled-maintenance.yml** - Weekly maintenance
- **code-quality.yml** - Quality checks

## Deployment Flow

```
PR Created
    ↓
ci.yml runs (validation)
    ↓
deploy-preview.yml runs (preview URL posted)
    ↓
Approved & Merged
    ↓
deploy-production.yml runs (goes live)
```

## Troubleshooting

### CI fails

1. Check error message in GitHub Actions
2. Run locally: `npm test && npm run lint && npm run build`
3. Fix issue
4. Push again

### Preview doesn't deploy

1. Check deploy-preview.yml logs
2. Verify VERCEL_* secrets are set
3. Check Vercel project settings

### Production deployment fails

1. Verify all status checks passed
2. Check deploy-production.yml logs
3. Verify branch protection rules
4. Try manual re-run

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

## Important Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Main CI pipeline |
| `.github/workflows/deploy-preview.yml` | PR previews |
| `.github/workflows/deploy-production.yml` | Production |
| `.github/CONTRIBUTING.md` | How to contribute |
| `.github/ENV_VARIABLES.md` | Setup guide |
| `.github/TROUBLESHOOTING.md` | Fixes |
| `.github/INCIDENT_RESPONSE.md` | Emergencies |

## Environment Variables

Required in GitHub Secrets:

```
VERCEL_TOKEN          - Vercel API key
VERCEL_ORG_ID         - Vercel org ID
VERCEL_PROJECT_ID     - Vercel project ID
```

Optional for local development (.env.local):

```
NEXT_PUBLIC_STACKS_API_URL=https://mainnet.stacks.co
NEXT_PUBLIC_CONTRACT_ADDRESS=...
```

## Need Help?

1. **General questions** → Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. **Setup issues** → Read [ENV_VARIABLES.md](./ENV_VARIABLES.md)
3. **Failures** → Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. **Emergencies** → Read [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)
5. **Everything** → Read [INDEX.md](./INDEX.md)

---

**Ready to contribute?** → Start with [CONTRIBUTING.md](./CONTRIBUTING.md)
