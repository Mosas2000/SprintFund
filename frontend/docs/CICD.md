# CI/CD Pipeline Documentation

This document describes the continuous integration and deployment pipelines for SprintFund frontend.

## GitHub Actions Workflows

The project includes the following workflows:

### Production Deployment
**File:** `.github/workflows/deploy-production.yml`

**Triggers:**
- Push to main branch
- Manual workflow dispatch

**Steps:**
1. Run tests and linting
2. Build application
3. Deploy to Vercel
4. Create GitHub deployment record
5. Send notifications

### Preview Deployments
**File:** `.github/workflows/deploy-preview.yml`

**Triggers:**
- Pull requests to main

**Steps:**
1. Run tests
2. Build application
3. Deploy preview to Vercel
4. Comment PR with preview URL

### Code Quality
**File:** `.github/workflows/code-quality.yml`

**Triggers:**
- Push to any branch
- Pull requests

**Steps:**
1. ESLint checks
2. TypeScript type checking
3. Prettier formatting check

## Required Secrets

Configure these in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel authentication token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

### Obtaining Vercel Secrets

```bash
vercel login
vercel link
cat .vercel/project.json
```

## Deployment Environments

### Production
- **URL:** `https://sprintfund.app`
- **Branch:** `main`
- **Auto-deploy:** Yes
- **Environment:** production

### Preview
- **URL:** `https://preview-<hash>.vercel.app`
- **Branch:** Any PR branch
- **Auto-deploy:** Yes
- **Environment:** preview

### Staging
- **URL:** `https://staging.sprintfund.app`
- **Branch:** `staging`
- **Auto-deploy:** Optional
- **Environment:** staging

## Manual Deployment

### Vercel CLI

Deploy to production:
```bash
cd frontend
vercel --prod
```

Deploy preview:
```bash
vercel
```

### Docker Registry

Build and push:
```bash
cd frontend
export DOCKER_IMAGE_TAG=v1.0.0
./scripts/build-docker.sh
docker push sprintfund-frontend:v1.0.0
```

### Kubernetes

Apply manifests:
```bash
kubectl apply -f frontend/k8s/
```

Update deployment:
```bash
kubectl set image deployment/sprintfund-frontend \
  frontend=sprintfund-frontend:v1.0.0
```

## Pipeline Optimization

### Build Caching

The workflows use npm caching to speed up builds:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Conditional Execution

Workflows only run when frontend files change:
```yaml
paths:
  - 'frontend/**'
```

## Monitoring Deployments

View deployment status:
```bash
vercel list
```

Check deployment logs:
```bash
vercel logs <deployment-url>
```

## Rollback Procedures

### Vercel
```bash
vercel rollback
```

### Kubernetes
```bash
kubectl rollout undo deployment/sprintfund-frontend
```

### Manual Revert
```bash
git revert <commit-hash>
git push origin main
```
