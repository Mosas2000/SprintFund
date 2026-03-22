# Quick Deployment Guide

Get SprintFund frontend deployed in under 10 minutes.

## Option 1: Vercel (Fastest - 5 minutes)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Navigate to frontend**
```bash
cd frontend
```

3. **Login to Vercel**
```bash
vercel login
```

4. **Deploy**
```bash
vercel --prod
```

5. **Set environment variables in Vercel dashboard**
- Go to project settings
- Add environment variables:
  - `NEXT_PUBLIC_NETWORK=mainnet`
  - `NEXT_PUBLIC_CONTRACT_ADDRESS=<your-address>`
  - `NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.mainnet.stacks.co`

6. **Redeploy to apply variables**
```bash
vercel --prod
```

Done! Your app is live.

## Option 2: Docker (Local - 10 minutes)

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Create environment file**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. **Build and run**
```bash
docker-compose up -d
```

4. **Access application**
```
http://localhost:3000
```

## Option 3: Netlify (Alternative - 7 minutes)

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Navigate to frontend**
```bash
cd frontend
```

3. **Login to Netlify**
```bash
netlify login
```

4. **Initialize site**
```bash
netlify init
```

5. **Deploy**
```bash
netlify deploy --prod
```

6. **Set environment variables**
```bash
netlify env:set NEXT_PUBLIC_NETWORK mainnet
netlify env:set NEXT_PUBLIC_CONTRACT_ADDRESS <your-address>
netlify env:set NEXT_PUBLIC_STACKS_API_URL https://stacks-node-api.mainnet.stacks.co
```

## Pre-Deployment Checklist

Run before deploying:

```bash
cd frontend
./scripts/check-ready.sh
./scripts/validate-deploy.sh
npm run build
```

## Verify Deployment

After deployment, verify:

1. Homepage loads: `https://your-domain.com`
2. Health check: `https://your-domain.com/api/health`
3. No console errors
4. Wallet connection works

## Need Help?

See full documentation:
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Environment Variables](./docs/ENVIRONMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
