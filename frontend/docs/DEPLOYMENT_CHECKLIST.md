# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code review completed
- [ ] Security audit passed

### Configuration
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Contract addresses validated
- [ ] Network configuration correct
- [ ] Build succeeds locally

### Documentation
- [ ] CHANGELOG updated
- [ ] API documentation current
- [ ] Deployment notes written

## Deployment Steps

### Vercel
1. [ ] Run validation script: `./scripts/validate-deploy.sh`
2. [ ] Test build: `npm run build`
3. [ ] Commit and push changes
4. [ ] Verify preview deployment
5. [ ] Promote to production
6. [ ] Verify health endpoint: `/api/health`
7. [ ] Test critical user flows
8. [ ] Monitor logs for errors

### Netlify
1. [ ] Run validation script
2. [ ] Test build locally
3. [ ] Push to deployment branch
4. [ ] Review deploy preview
5. [ ] Approve production deploy
6. [ ] Verify health endpoint
7. [ ] Test application functionality

### Docker
1. [ ] Build image: `./scripts/build-docker.sh`
2. [ ] Test container locally
3. [ ] Push to registry
4. [ ] Update orchestration config
5. [ ] Deploy to cluster
6. [ ] Verify health checks passing
7. [ ] Monitor container metrics

## Post-Deployment

### Verification
- [ ] Homepage loads correctly
- [ ] API endpoints responding
- [ ] Health check returns 200
- [ ] Static assets loading
- [ ] WebSocket connections working
- [ ] No console errors

### Performance
- [ ] Page load time under 3s
- [ ] Time to Interactive under 5s
- [ ] No memory leaks
- [ ] CPU usage normal

### Monitoring
- [ ] Error tracking configured
- [ ] Analytics working
- [ ] Alerts configured
- [ ] Logs accessible

### Security
- [ ] HTTPS working
- [ ] Security headers present
- [ ] CSP not blocking resources
- [ ] No mixed content warnings

## Rollback Plan

If issues occur:

### Vercel
```bash
vercel rollback
```

### Netlify
Use the Netlify dashboard to deploy a previous version

### Docker
```bash
docker-compose down
docker-compose up -d --build <previous-tag>
```

## Post-Incident

- [ ] Root cause identified
- [ ] Incident documented
- [ ] Fix implemented
- [ ] Tests added to prevent recurrence
- [ ] Team notified
