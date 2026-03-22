# Deployment Troubleshooting Guide

Common deployment issues and their solutions.

## Build Failures

### Module Not Found

**Problem:** Build fails with "Module not found" error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Out of Memory

**Problem:** Build crashes with heap out of memory

**Solution:**
Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### TypeScript Errors

**Problem:** Type checking fails during build

**Solution:**
```bash
npm run type-check
```
Fix reported errors before building.

## Runtime Issues

### 500 Internal Server Error

**Problem:** Application returns 500 errors

**Diagnosis:**
Check logs:
```bash
vercel logs
# or
docker logs sprintfund-frontend
```

**Common Causes:**
- Missing environment variables
- Database connection issues
- API endpoint misconfiguration

### Blank Page / White Screen

**Problem:** Application loads but shows blank page

**Diagnosis:**
1. Check browser console for errors
2. Verify static assets loading
3. Check Content Security Policy headers

**Solution:**
Update CSP in `vercel.json` to allow required resources.

### API Routes Not Working

**Problem:** API endpoints return 404

**Solution:**
Verify API routes are in `src/app/api/` directory and named `route.ts`.

## Docker Issues

### Container Won't Start

**Problem:** Docker container exits immediately

**Diagnosis:**
Check logs:
```bash
docker logs sprintfund-frontend
```

**Common Causes:**
- Missing environment variables
- Port already in use
- Build artifacts not copied

### Health Check Failing

**Problem:** Container health check returns unhealthy

**Diagnosis:**
```bash
docker exec sprintfund-frontend wget --spider http://localhost:3000/api/health
```

**Solution:**
Ensure health endpoint is accessible and container is fully started.

## Vercel Issues

### Deployment Stuck

**Problem:** Deployment hangs at build step

**Solution:**
1. Cancel deployment
2. Clear build cache in project settings
3. Redeploy

### Environment Variables Not Loading

**Problem:** Runtime shows undefined for environment variables

**Solution:**
Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access.

### Function Timeout

**Problem:** API routes timeout after 10 seconds

**Solution:**
Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Netlify Issues

### Build Command Failed

**Problem:** Netlify build fails with npm error

**Solution:**
Check Node.js version in `netlify.toml` matches your development environment.

### Redirects Not Working

**Problem:** Client-side routing returns 404

**Solution:**
Verify `_redirects` file or netlify.toml contains:
```
/*  /index.html  200
```

## Performance Issues

### Slow Page Load

**Problem:** Pages take too long to load

**Diagnosis:**
1. Check Lighthouse score
2. Analyze bundle size
3. Review network waterfall

**Solutions:**
- Enable Next.js Image Optimization
- Lazy load components
- Implement code splitting
- Enable caching headers

### High Memory Usage

**Problem:** Container uses too much memory

**Solution:**
Monitor with:
```bash
docker stats sprintfund-frontend
```

Optimize by reducing build artifacts and dependencies.

## SSL/HTTPS Issues

### Mixed Content Warning

**Problem:** Browser blocks resources over HTTP

**Solution:**
Ensure all external resources use HTTPS URLs.

### Certificate Not Valid

**Problem:** SSL certificate shows as invalid

**Solution:**
- Wait for certificate provisioning to complete
- Verify DNS records are correct
- Check certificate renewal status

## Network Issues

### Cannot Connect to Stacks API

**Problem:** Application can't reach Stacks blockchain endpoints

**Diagnosis:**
Test connection:
```bash
curl https://stacks-node-api.mainnet.stacks.co/v2/info
```

**Solution:**
- Verify API URL is correct
- Check firewall rules
- Ensure endpoint is in CSP allowed list

## Getting Help

If issues persist:

1. Check deployment logs
2. Review configuration files
3. Test locally with production build
4. Check GitHub Issues for similar problems
5. Contact support with:
   - Error messages
   - Deployment logs
   - Configuration details
   - Steps to reproduce
