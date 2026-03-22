# Environment Variables Template

This document outlines all environment variables needed for local development and production deployment.

## Required Secrets (GitHub Settings → Secrets and variables)

### Deployment Secrets

| Variable | Purpose | How to Get |
|----------|---------|-----------|
| `VERCEL_TOKEN` | Vercel API authentication | Vercel Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel dashboard project settings |

### Security Scanning

| Variable | Purpose | How to Get |
|----------|---------|-----------|
| `SONARQUBE_TOKEN` | SonarQube analysis token | SonarQube → Administration → Security |
| `SONARQUBE_HOST_URL` | SonarQube server URL | Your SonarQube instance URL |

### Notifications

| Variable | Purpose | How to Get |
|----------|---------|-----------|
| `SLACK_WEBHOOK_URL` | Slack notification webhook | Slack Workspace → Apps → Incoming Webhooks |
| `DISCORD_WEBHOOK_URL` | Discord notification webhook | Discord Server → Webhook URL |

## Setup Instructions

### 1. GitHub Secrets

Navigate to: Settings → Secrets and variables → Actions

```bash
# Add each secret
gh secret set VERCEL_TOKEN --body "your-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
```

### 2. Local Development (.env.local)

Create `frontend/.env.local`:

```bash
# Stacks API
NEXT_PUBLIC_STACKS_API_URL=https://mainnet.stacks.co

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=SP1234567890ABCDEF...
NEXT_PUBLIC_CONTRACT_NAME=sprintfund

# Feature flags
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_TRANSACTION_HISTORY=true

# Local development
NEXT_PUBLIC_DEBUG=false
```

### 3. Vercel Deployment

Set in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_STACKS_API_URL=https://mainnet.stacks.co
NEXT_PUBLIC_CONTRACT_ADDRESS=SP1234567890ABCDEF...
NEXT_PUBLIC_CONTRACT_NAME=sprintfund
```

## Variable Reference

### Stacks Network

```
Mainnet:  https://mainnet.stacks.co
Testnet:  https://testnet-api.stacks.co
```

### Feature Flags

Enable/disable features at build time:

```bash
NEXT_PUBLIC_FEATURE_ANALYTICS=true        # Analytics dashboard
NEXT_PUBLIC_FEATURE_TRANSACTION_HISTORY=true  # Transaction tracking
NEXT_PUBLIC_FEATURE_PROPOSALS_DETAIL=true     # Detail pages
```

### Debug Mode

```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG=true

# Verbose API logging
NEXT_PUBLIC_DEBUG_API=true

# Contract call logging
NEXT_PUBLIC_DEBUG_CONTRACT=true
```

## CI/CD Variables

Automatically available in GitHub Actions:

| Variable | Value | Source |
|----------|-------|--------|
| `GITHUB_SHA` | Commit hash | GitHub Actions |
| `GITHUB_REF` | Branch/tag reference | GitHub Actions |
| `GITHUB_RUN_ID` | Workflow run ID | GitHub Actions |
| `RUNNER_OS` | ubuntu-latest | GitHub Actions |

## Setup for Contributors

### Getting Secrets

1. Ask project owner for secret values
2. Add to local `.env.local`
3. For Vercel: secrets managed automatically in project settings

### Local Testing

```bash
# Test with Testnet
NEXT_PUBLIC_STACKS_API_URL=https://testnet-api.stacks.co npm run dev

# Test with analytics enabled
NEXT_PUBLIC_FEATURE_ANALYTICS=true npm run dev
```

### Production Build

```bash
# Build with production values
NEXT_PUBLIC_STACKS_API_URL=https://mainnet.stacks.co npm run build
```

## Troubleshooting

### Variables not loading

```bash
# Check they're in .env.local or .env
cat frontend/.env.local

# Restart dev server
npm run dev
```

### Wrong environment in production

1. Verify Vercel environment variables are set
2. Check GitHub Actions logs for values
3. Rebuild from Vercel dashboard

### Secrets not available in workflow

1. Verify secret is added to repository
2. Check secret name in workflow matches exactly
3. Ensure workflow has permission to access secrets

```yaml
permissions:
  contents: read
```

## Security Notes

- Never commit `.env.local` (included in .gitignore)
- Never log environment variables
- Rotate secrets regularly
- Use separate secrets for staging and production
- Review secret access in GitHub audit logs

## Related

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Stacks API Documentation](https://docs.stacks.co/understand-stacks/architecture)
