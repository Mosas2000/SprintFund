# Staging Environment Configuration

This document describes the staging environment setup for SprintFund frontend.

## Overview

The staging environment mirrors production but connects to the Stacks testnet for safe testing before production releases.

## Environment Configuration

Staging uses `.env.staging` with testnet configuration:

```bash
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.testnet.stacks.co
```

## Vercel Staging Setup

1. Create a preview branch:
```bash
git checkout -b staging
```

2. Configure Vercel to deploy previews from the staging branch
3. Set staging environment variables in Vercel dashboard
4. Access at `staging-sprintfund.vercel.app`

## Netlify Staging Setup

1. Create a deploy context in `netlify.toml`:

```toml
[context.staging]
  environment = { NEXT_PUBLIC_NETWORK = "testnet" }
```

2. Deploy from staging branch

## Docker Staging

Use the development profile in docker-compose:

```bash
docker-compose --profile dev up -d frontend-dev
```

Or set environment to staging:

```bash
docker run -e NEXT_PUBLIC_NETWORK=testnet \
           -e NEXT_PUBLIC_CONTRACT_ADDRESS=ST1... \
           -p 3000:3000 sprintfund-frontend
```

## Testing Workflow

1. Merge feature branches to staging
2. Run automated tests in staging environment
3. Perform manual QA testing
4. If tests pass, merge staging to main for production deployment

## Access Control

Staging should be protected with basic authentication or IP whitelisting to prevent public access.

### Vercel Password Protection

1. Go to Project Settings > Deployment Protection
2. Enable Password Protection for Preview Deployments

### Nginx Basic Auth

```nginx
location / {
    auth_basic "Staging Environment";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://localhost:3000;
}
```
