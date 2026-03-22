# Deployment Guide

This document covers all deployment options for the SprintFund frontend application.

## Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- Git

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-contract-address>
NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.mainnet.stacks.co
```

## Deployment Options

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in the Vercel dashboard
4. Deploy

```bash
npx vercel --prod
```

### Netlify

1. Connect your repository to Netlify
2. Set the base directory to `frontend`
3. Configure environment variables in the Netlify dashboard
4. Deploy

### Docker

Build and run the production image:

```bash
cd frontend
./scripts/build-docker.sh
docker run -p 3000:3000 sprintfund-frontend:latest
```

Or use docker-compose:

```bash
cd frontend
docker-compose up -d
```

### Manual Deployment

```bash
cd frontend
npm ci
npm run build
npm run start
```

## Build Validation

Before deploying, validate your environment:

```bash
./scripts/validate-deploy.sh
```

## Health Check

The application exposes a health check endpoint at `/api/health` for use with load balancers and container orchestration.

## Production Optimizations

The Next.js configuration includes:

- Standalone output for minimal Docker images
- Security headers (CSP, X-Frame-Options, etc.)
- Static asset caching
- API route caching disabled for fresh data
