# Deployment Documentation Index

Complete deployment documentation for SprintFund frontend.

## Getting Started

Start here for quick deployments:

- **[Quick Start Guide](./QUICK_START.md)** - Deploy in under 10 minutes
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment validation

## Core Guides

### Platform-Specific

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions for all platforms
- **[CI/CD Pipeline](./CICD.md)** - GitHub Actions workflows and automation
- **[Staging Environment](./STAGING.md)** - Staging setup and testing workflow

### Configuration

- **[Environment Variables](./ENVIRONMENT.md)** - Required and optional configuration
- **[Custom Domain](./CUSTOM_DOMAIN.md)** - DNS and domain setup
- **[SSL/HTTPS](./SSL_HTTPS.md)** - Certificate configuration

### Operations

- **[Monitoring](./MONITORING.md)** - Health checks, analytics, and alerting
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

## Deployment Files

### Vercel
- `/vercel.json` - Vercel platform configuration

### Netlify
- `/netlify.toml` - Netlify platform configuration

### Docker
- `/Dockerfile` - Production image
- `/Dockerfile.dev` - Development image
- `/docker-compose.yml` - Container orchestration
- `/.dockerignore` - Build optimization

### Kubernetes
- `/k8s/deployment.yaml` - Pod deployment
- `/k8s/service.yaml` - Service configuration
- `/k8s/configmap.yaml` - Environment config
- `/k8s/ingress.yaml` - Ingress rules

### Nginx
- `/nginx.conf` - Reverse proxy configuration

## Helper Scripts

All scripts are in `/scripts/`:

| Script | Purpose |
|--------|---------|
| `check-ready.sh` | Verify deployment prerequisites |
| `validate-deploy.sh` | Validate environment configuration |
| `build-docker.sh` | Build Docker production image |
| `start-production.sh` | Start production server |

## Deployment Workflow

1. Run `./scripts/check-ready.sh`
2. Configure environment variables
3. Run `./scripts/validate-deploy.sh`
4. Test build: `npm run build`
5. Deploy using platform of choice
6. Verify health endpoint: `/api/health`
7. Test application functionality

## Support

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- See main [README](../README.md)
