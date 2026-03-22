# CI/CD Configuration

## GitHub Actions Workflows

This directory contains automated GitHub Actions workflows for continuous integration and deployment.

## Workflows

### ci.yml - Main CI Pipeline
Runs on every push and pull request to validate code quality.

**Jobs:**
- Contract checks (Clarinet)
- Contract tests
- Frontend linting
- Frontend build
- Frontend tests
- TypeScript type checking
- Code quality checks

**Triggers:**
- Push to main, develop, and feature/fix/refactor branches
- Pull requests to main and develop

### deploy-preview.yml - Preview Deployment
Automatically deploys preview builds for pull requests to Vercel.

**Jobs:**
- Build frontend
- Deploy to Vercel staging
- Comment PR with preview URL

**Triggers:**
- Pull requests to main and develop
- On open, synchronize, and reopen events

### deploy-production.yml - Production Deployment
Deploys to production after all checks pass.

**Jobs:**
- Full test suite
- Build verification
- Production deployment to Vercel
- Deployment tracking

**Triggers:**
- Push to main branch
- Manual workflow dispatch

### release.yml - Release Process
Creates versioned releases with artifacts.

**Jobs:**
- Full test suite
- Create git tag
- Create GitHub release
- Upload build artifacts

**Triggers:**
- Manual workflow dispatch with version input

### security.yml - Security Scanning
Comprehensive security scanning and vulnerability detection.

**Jobs:**
- Dependency security check
- CodeQL analysis
- Trivy vulnerability scan
- Secret scanning
- License compliance check

**Triggers:**
- Push to main and develop
- Pull requests
- Weekly schedule (Sunday 2 AM UTC)

### code-quality.yml - Code Quality Analysis
Analyzes code quality and complexity.

**Jobs:**
- SonarQube analysis
- Prettier format check
- ESLint validation
- Code complexity analysis
- Dependency tree generation

**Triggers:**
- Push to main and develop
- All pull requests

### scheduled-maintenance.yml - Weekly Maintenance
Scheduled tasks for maintenance and monitoring.

**Jobs:**
- Dependency update checks
- Test report generation
- Performance baseline recording
- Artifact cleanup

**Triggers:**
- Weekly schedule (Sunday 00:00 UTC)

## Environment Variables

The following secrets need to be configured in GitHub:

### Vercel Deployment
```
VERCEL_TOKEN - Vercel authentication token
VERCEL_ORG_ID - Vercel organization ID
VERCEL_PROJECT_ID - Vercel project ID
```

### Code Quality
```
SONAR_HOST_URL - SonarQube host URL (optional)
SONAR_TOKEN - SonarQube authentication token (optional)
```

## Pull Request Workflow

1. Create feature branch from main or develop
2. Push commits - CI pipeline runs automatically
3. All checks must pass before merge
4. Preview deployment available for review
5. Once approved, merge to main
6. Production deployment runs automatically

## Merge Requirements

All of the following must pass before merging:
- Contract checks
- Contract tests
- Frontend linting
- Frontend build
- Frontend tests
- TypeScript type checking
- Code quality checks
- Security scans

## Local Verification

Run these commands locally before pushing:

```bash
npm test                    # Contract tests
npm run security:audit      # Security check

cd frontend
npm run lint               # Linting
npm run build              # Build
npm run format:check       # Format check
npx tsc --noEmit          # Type check
```

## Troubleshooting

### CI Pipeline Failures

**ESLint failures:**
```bash
cd frontend
npm run lint:fix
```

**Format failures:**
```bash
cd frontend
npm run format
```

**Type check failures:**
```bash
cd frontend
npx tsc --noEmit
```

**Build failures:**
Check frontend/build logs for errors

**Test failures:**
Run tests locally and debug

### Deployment Issues

**Vercel deployment fails:**
- Check VERCEL_TOKEN is valid
- Verify VERCEL_PROJECT_ID matches project
- Check frontend build succeeds locally

**Preview URL not showing:**
- Wait for deploy-preview workflow to complete
- Check GitHub Actions logs
- Verify Vercel integration is connected

## Monitoring

### GitHub Actions Dashboard
Monitor workflow runs at: GitHub Settings > Actions > All workflows

### Vercel Dashboard
Monitor deployments at: vercel.com dashboard

### Activity
Recent deployments and their status visible in:
- Pull request comments (preview URLs)
- GitHub Deployments tab
- Vercel project dashboard

## Branch Protection Rules

Configure these on main and develop branches:

- Require status checks to pass:
  - Contract Checks
  - Contract Tests
  - Frontend Lint
  - Frontend Build
  - Frontend Tests
  - TypeScript Type Check

- Require pull request reviews before merging
- Require branches to be up to date before merging
- Include administrators in restrictions

## Performance Notes

- CI pipeline typically completes in 5-10 minutes
- Contract tests are the slowest part
- Frontend build usually completes in 2-3 minutes
- Parallel jobs reduce total time significantly

## Cost Optimization

- Pipeline uses GitHub-hosted runners
- Concurrency groups prevent duplicate runs
- Scheduled jobs run only weekly
- Build artifacts auto-clean after 1 day
