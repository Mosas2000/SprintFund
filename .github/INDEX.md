# GitHub Actions Complete Documentation Index

## Overview

This directory contains SprintFund's complete CI/CD infrastructure, including workflows, configuration, and operational guides.

## Quick Start

**New to this project?** Start here:
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
2. Read [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Setup environment
3. Read [workflows/README.md](./workflows/README.md) - Understand workflows

**Something broken?** Go to:
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
2. [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) - Emergency procedures

## Documentation Map

### Getting Started
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guidelines and workflow
  - Commit message format
  - PR guidelines
  - Local development setup
  - CI/CD requirements for contributors

### Setup & Configuration
- **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** - Environment variables reference
  - Required secrets
  - Local development setup
  - Vercel configuration
  - How to get credentials

- **[BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md)** - Branch protection rules
  - Required status checks
  - Review requirements
  - Enforcement levels

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures
  - Prerequisites
  - Manual procedures
  - Deployment flow
  - Verification steps

- **[dependabot.yml](./dependabot.yml)** - Automated dependency updates
  - npm configuration
  - GitHub Actions updates
  - Update schedule

- **[CODEOWNERS](./CODEOWNERS)** - Code ownership and review routing
  - Automatic PR assignments
  - Required reviewers

### Workflows & Operations
- **[workflows/README.md](./workflows/README.md)** - Workflow documentation
  - Workflow descriptions
  - Trigger conditions
  - Job specifications
  - Status checks
  - PR workflow

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Problem diagnosis and solutions
  - Common GitHub Actions issues
  - Build failure diagnosis
  - Deployment troubleshooting
  - Test failure debugging
  - Debugging techniques

- **[INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)** - Incident management
  - Incident types and responses
  - Quick reference commands
  - Escalation procedures
  - Emergency procedures
  - Post-incident review process

- **[OBSERVABILITY.md](./OBSERVABILITY.md)** - Monitoring and metrics
  - Pipeline health metrics
  - Performance monitoring
  - Security monitoring
  - Deployment monitoring
  - Log analysis
  - Alerting setup

### Best Practices & Optimization
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - GitHub Actions standards
  - Workflow design patterns
  - Security practices
  - Performance optimization
  - Error handling
  - Testing strategies
  - Documentation standards
  - Common patterns
  - Debugging techniques

- **[COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)** - Cost reduction
  - GitHub Actions pricing
  - Cost reduction strategies
  - Cost calculator
  - Runner configuration
  - Artifact management
  - Implementation roadmap
  - Monitoring & reporting

## Workflow Files

| File | Purpose | Frequency |
|------|---------|-----------|
| **ci.yml** | Main CI pipeline (contract + frontend checks) | Every push/PR |
| **deploy-preview.yml** | Vercel preview deployments | Every PR |
| **deploy-production.yml** | Production deployment | Main branch push |
| **release.yml** | Release versioning and tagging | Manual or main push |
| **security.yml** | Security scanning (CodeQL, Trivy, secrets) | Weekly schedule |
| **code-quality.yml** | Code quality analysis (SonarQube, complexity) | Every push |
| **scheduled-maintenance.yml** | Weekly maintenance and dependency checks | Weekly schedule |

## Directory Structure

```
.github/
├── workflows/
│   ├── README.md                 ← Workflow reference
│   ├── ci.yml                    ← Main CI pipeline
│   ├── deploy-preview.yml        ← PR preview deployments
│   ├── deploy-production.yml     ← Production deployment
│   ├── release.yml               ← Release process
│   ├── security.yml              ← Security scanning
│   ├── code-quality.yml          ← Code quality checks
│   └── scheduled-maintenance.yml ← Weekly maintenance
├── CONTRIBUTING.md               ← Contributing guidelines
├── ENV_VARIABLES.md              ← Environment setup
├── BRANCH_PROTECTION.md          ← Branch rules
├── DEPLOYMENT.md                 ← Deployment guide
├── TROUBLESHOOTING.md            ← Problem solving
├── INCIDENT_RESPONSE.md          ← Incident handling
├── OBSERVABILITY.md              ← Monitoring guide
├── BEST_PRACTICES.md             ← Standards & patterns
├── COST_OPTIMIZATION.md          ← Cost reduction
├── dependabot.yml                ← Dependency updates
├── CODEOWNERS                    ← Code ownership
└── INDEX.md                      ← This file
```

## Common Tasks

### I want to...

**Set up my development environment**
→ [CONTRIBUTING.md](./CONTRIBUTING.md) + [ENV_VARIABLES.md](./ENV_VARIABLES.md)

**Submit a pull request**
→ [CONTRIBUTING.md](./CONTRIBUTING.md)

**Deploy to production**
→ [DEPLOYMENT.md](./DEPLOYMENT.md)

**Fix a CI failure**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Handle an urgent incident**
→ [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)

**Optimize CI costs**
→ [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)

**Understand workflows**
→ [workflows/README.md](./workflows/README.md)

**Monitor pipeline health**
→ [OBSERVABILITY.md](./OBSERVABILITY.md)

**Follow best practices**
→ [BEST_PRACTICES.md](./BEST_PRACTICES.md)

## Key Concepts

### GitHub Actions Terms

- **Workflow**: Automated process defined in YAML file
- **Job**: Set of steps that run in a workflow
- **Step**: Individual task (run command, use action, etc.)
- **Action**: Reusable unit of code
- **Artifact**: Output files from workflow
- **Runner**: Machine that executes workflow

### SprintFund Pipeline Strategy

- **Parallel execution**: Jobs run concurrently when possible
- **Fail fast**: Stop on first error to save time
- **Staged deployment**: Preview → Production
- **Comprehensive testing**: Contract + Frontend + Security
- **Cost conscious**: Optimize for GitHub Actions free tier

## Status Checks

All branches require passing status checks before merge:

- ✅ **ci/contract-check** - Smart contract validation
- ✅ **ci/contract-tests** - Contract test suite
- ✅ **ci/frontend-lint** - ESLint validation
- ✅ **ci/frontend-build** - Build verification
- ✅ **ci/frontend-tests** - Unit tests
- ✅ **ci/type-check** - TypeScript validation
- ✅ **ci/code-quality** - Code quality analysis

## Secrets Configuration

Required GitHub Secrets (Settings → Secrets):

```
VERCEL_TOKEN          - Vercel API authentication
VERCEL_ORG_ID         - Vercel organization identifier
VERCEL_PROJECT_ID     - Vercel project identifier
SONARQUBE_TOKEN       - SonarQube access token (optional)
SONARQUBE_HOST_URL    - SonarQube server URL (optional)
```

Setup instructions: [ENV_VARIABLES.md](./ENV_VARIABLES.md#setup-instructions)

## Performance Targets

| Metric | Target | Alert If |
|--------|--------|----------|
| CI duration | <15 min | >25 min |
| Build time | <5 min | >10 min |
| Test time | <3 min | >5 min |
| Deployment time | <3 min | >5 min |
| Success rate | >95% | <90% |

## Getting Help

### Questions About...

- **Contributing** → Ask in Issues or Discussions
- **Workflows** → See [workflows/README.md](./workflows/README.md)
- **Deployment** → See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Incidents** → See [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)
- **Costs** → See [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)

### Reporting Issues

When reporting CI/CD issues, include:
- Workflow name and run ID
- Error messages from logs
- Steps to reproduce
- Environment details
- Recent changes

### Support Channels

- **Issues**: GitHub Issues with `ci/cd` label
- **Discussions**: GitHub Discussions
- **Urgent**: Contact @Mosas2000

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Vercel Documentation](https://vercel.com/docs)
- [Stacks Documentation](https://docs.stacks.co)

## Last Updated

This documentation is maintained alongside the CI/CD infrastructure. Check git history for recent updates.

```bash
# See recent CI/CD changes
git log --oneline -- .github/
```

## Contributing to This Documentation

Found an error or missing information? Improvements welcome:

1. Fork the repository
2. Create a branch: `docs/cicd-improvement`
3. Make changes
4. Submit PR with clear description
5. Mention what was added/improved

---

**Need to get started quickly?**
→ Read [CONTRIBUTING.md](./CONTRIBUTING.md) first
