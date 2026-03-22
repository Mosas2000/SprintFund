# Observability and Monitoring

## Overview

This guide covers monitoring CI/CD pipeline health, performance metrics, and deployment status.

## GitHub Actions Monitoring

### Dashboard Access

1. Repository → Actions tab
2. View all workflow runs
3. Click run for detailed logs
4. Check job status and timing

### Key Metrics

Track these for pipeline health:

| Metric | Target | Alert If |
|--------|--------|----------|
| CI success rate | >95% | <90% |
| Average CI duration | <15 min | >25 min |
| Build failures | <2/week | >5/week |
| Test failures | <1/week | >3/week |
| Deployment frequency | 1-3/week | 0/week or >10/day |

### Workflow Analytics

```bash
# List workflow runs with status
gh run list --repo owner/repo --limit 30

# View specific workflow stats
gh api repos/owner/repo/actions/runs \
  --paginate --jq '.workflow_runs | length'

# Export run times
gh run list --repo owner/repo --limit 100 --json durationMinutes
```

## Performance Monitoring

### Build Performance

Track in each workflow:

```yaml
- name: Record build time
  run: |
    echo "Build completed in $SECONDS seconds"
```

### API Performance

Monitor Stacks API response times:

```bash
# In deploy logs, look for:
# Time to first byte (TTFB)
# Total response time
# Timeouts/retries
```

### Frontend Performance

```bash
# After build, check metrics
cd frontend
npm run build

# Review output for:
# - Bundle size
# - Page speed
# - Core Web Vitals
```

## Security Monitoring

### CodeQL Results

Check GitHub → Code scanning alerts

1. View identified vulnerabilities
2. Assess severity
3. Create fixes
4. Verify resolution

### Dependency Vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# See detailed report
npm audit --json | jq '.vulnerabilities'
```

### Secret Scanning

Monitor GitHub → Security → Secret scanning

1. Review detected secrets
2. Invalidate leaked secrets
3. Remove from history if needed
4. Update CI/CD configuration

## Deployment Monitoring

### Vercel Deployments

1. Visit Vercel dashboard
2. Check deployment status
3. View build logs
4. Monitor runtime metrics

### Production Health

After each deployment:

1. Check uptime monitoring
2. Review error rates
3. Monitor performance metrics
4. Check user feedback channels

## Incident Response

### Workflow Failure Response

1. **Detection**: GitHub notifications or manual check
2. **Investigation**: View workflow logs
3. **Diagnosis**: Identify root cause
4. **Fix**: Apply patch
5. **Verification**: Re-run workflow
6. **Documentation**: Record incident

### Deployment Failure Response

1. **Alert**: Deployment status check
2. **Assess**: Check production impact
3. **Decide**: Rollback or fix forward
4. **Execute**: Apply response
5. **Verify**: Confirm resolution
6. **Monitor**: Watch metrics

### Rollback Procedure

```bash
# If deployment fails:
# 1. Identify last stable commit
git log --oneline | head -20

# 2. Revert to stable
git revert <commit-hash>
git push origin main

# 3. Trigger redeployment
# GitHub Actions will automatically redeploy from new commit
```

## Log Analysis

### Workflow Logs

Location: Repository → Actions → Run → Logs

Key sections to review:

- Job setup (node version, dependency install)
- Build output (errors/warnings)
- Test results (failures/skipped)
- Deployment status (success/error)

### Accessing Logs Programmatically

```bash
# Download logs
gh run download <run-id> --dir ./logs

# View recent failures
gh run list --repo owner/repo --status failure --limit 5

# Get logs for specific job
gh api repos/owner/repo/actions/runs/<run-id>/jobs \
  --jq '.jobs[] | {name, status, conclusion}'
```

## Alerting Setup

### GitHub Notifications

Enable in Personal settings → Notifications:

- Workflow runs: All or Failures only
- Deployments: All or Failures only
- Reviews: All or Mentions only

### Slack Notifications (Optional)

Add to workflows:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Workflow ${{ github.workflow }} failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Workflow Failed*\nBranch: ${{ github.ref }}\nRun: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }
          }
        ]
      }
```

## Metrics Collection

### Weekly Review Checklist

```
☐ Check workflow success rate
☐ Review failed runs
☐ Check average build time
☐ Review security scan results
☐ Check deployment frequency
☐ Verify no unresolved alerts
☐ Review performance metrics
☐ Document any incidents
```

### Monthly Review

```
☐ Trending: success rate improving?
☐ Trending: build times faster?
☐ Security: fewer vulnerabilities?
☐ Dependencies: update status?
☐ Cost: usage within budget?
☐ Team: feedback on process?
☐ Tools: any improvements needed?
```

## Optimization

### Improving Success Rate

1. Review most common failures
2. Add better error handling
3. Improve test coverage
4. Fix flaky tests
5. Update dependencies

### Reducing Build Time

1. Analyze slowest steps
2. Add caching where possible
3. Parallelize independent jobs
4. Optimize dependencies
5. Reduce test scope if appropriate

### Cost Optimization

1. Review GitHub Actions minutes
2. Consolidate workflows
3. Use cache to reduce re-runs
4. Skip unnecessary checks
5. Consider self-hosted runners if volume high

## Useful Dashboards

### GitHub CLI Commands

```bash
# Show workflow files
gh workflow list

# List recent runs
gh run list --limit 50

# Get run details
gh run view <run-id>

# List job artifacts
gh run view <run-id> --json jobs

# Download artifacts
gh run download <run-id>
```

### GitHub Web Interface

- Repository → Insights → Actions
- Repository → Security tab
- Organization → Insights → Usage

## Documentation

Keep updated:

- Incident response runbook
- Performance baselines
- Alert thresholds
- Escalation procedures
- Team contacts

## Troubleshooting Common Issues

### High failure rate

1. Check for environment changes
2. Review recent code commits
3. Check dependency updates
4. Review test flakiness
5. Check resource constraints

### Slow pipelines

1. Analyze slowest jobs
2. Check cache hit rates
3. Review dependency trees
4. Check test coverage scope
5. Verify runner specs

### Failed deployments

1. Review deployment logs
2. Check prerequisite jobs passed
3. Verify secrets are set
4. Check branch protection rules
5. Review deployment environment

## Resources

- [GitHub Actions Status Page](https://www.githubstatus.com)
- [GitHub Actions Insights API](https://docs.github.com/en/rest/actions)
- [GitHub API Documentation](https://docs.github.com/en/rest)
