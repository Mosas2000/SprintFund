# Incident Response Runbook

## Quick Reference

| Issue | Command | Time |
|-------|---------|------|
| View failed run | `gh run view <run-id> --log` | 1 min |
| Cancel stuck run | `gh run cancel <run-id>` | 30 sec |
| Re-run workflow | `gh run rerun <run-id>` | 30 sec |
| Rollback deployment | `git revert <commit> && git push` | 5 min |
| Check status page | https://www.githubstatus.com | 1 min |

## Incident Types and Responses

### Type 1: Build Failure (10-15 min resolution)

**Symptoms**: ❌ Red X on CI/CD

**Steps**:

1. Check failure type
   ```bash
   gh run view <run-id> --log | grep ERROR
   ```

2. Categorize:
   - **Compilation error**: Fix code, push, re-run
   - **Test failure**: Investigate test, fix or update
   - **Lint error**: Run locally, fix with `npm run lint:fix`
   - **Build timeout**: Check logs for hang, optimize

3. Fix based on category
   ```bash
   # For lint errors
   cd frontend && npm run lint:fix && npm run format

   # Commit and push
   git add .
   git commit -m "fix: resolve lint errors"
   git push
   ```

4. Monitor re-run
   - Check GitHub Actions tab
   - Wait for completion
   - Verify all checks pass

### Type 2: Test Failure (15-30 min resolution)

**Symptoms**: ❌ Tests failed in CI

**Steps**:

1. Identify failing test
   ```bash
   gh run view <run-id> --log | grep "FAIL"
   ```

2. Run locally to reproduce
   ```bash
   npm test -- failing-test.spec.ts
   ```

3. Fix based on root cause:
   - **Logic error**: Fix code
   - **Environment issue**: Check env variables
   - **Flaky test**: Add retry logic
   - **Mock issue**: Update mock data

4. Re-run workflow
   ```bash
   gh run rerun <run-id>
   ```

### Type 3: Deployment Failure (20-40 min resolution)

**Symptoms**: ❌ Deployment step failed

**Steps**:

1. Check deployment logs
   ```bash
   gh run view <run-id> --log | tail -50
   ```

2. Identify issue:
   - **Build failed**: Fix and rebuild
   - **Secrets missing**: Check GitHub Secrets
   - **Permission denied**: Check branch protection rules
   - **Vercel error**: Check Vercel project settings

3. For Vercel issues:
   - Visit Vercel dashboard
   - Check project settings
   - Verify environment variables
   - Check build logs

4. Fix and re-deploy:
   - Merge fix to main (if code issue)
   - Workflow triggers automatically
   - Monitor new deployment

### Type 4: Performance Issue (Ongoing optimization)

**Symptoms**: ⚠️ Pipeline takes 20+ minutes

**Steps**:

1. Identify slow job
   ```bash
   gh run view <run-id> --json jobs --jq '.jobs[] | {name, durationMinutes}'
   ```

2. Investigate:
   - Check GitHub Actions status
   - Review job logs
   - Check resource constraints

3. Optimize:
   - Add caching
   - Parallelize jobs
   - Reduce test scope
   - Optimize dependencies

### Type 5: Security Alert (Immediate)

**Symptoms**: 🔴 Secret detected, vulnerability found

**Steps**:

1. **If secret exposed**:
   ```bash
   # Immediately in order:
   # 1. Rotate the secret
   # 2. Remove from repository
   # 3. Check git history
   git log --all --pretty=format: --name-only | sort -u | grep secret
   # 4. Force push if needed
   ```

2. **If vulnerability detected**:
   ```bash
   npm audit
   npm audit fix
   npm install
   git add package*.json
   git commit -m "chore: fix security vulnerabilities"
   git push
   ```

3. **Follow up**:
   - Document incident
   - Review security practices
   - Update secrets rotation policy

## Escalation Procedures

### Level 1: Self-Service (30 minutes)

- Re-run failed workflow
- Fix obvious code errors
- Update failing tests
- Restart stuck jobs

### Level 2: Investigation (1 hour)

- Deep dive into logs
- Check GitHub status page
- Investigate dependencies
- Review recent commits

### Level 3: Team Assistance

- Notify team in Slack
- Share error logs
- Discuss solution
- Implement fix together

### Level 4: External Support

- Contact GitHub Support (Business plan)
- Contact Vercel Support
- Contact Stacks Foundation
- Report to open source community

## Emergency Procedures

### Complete CI/CD Failure

```bash
# Check if GitHub is down
curl -s https://www.githubstatus.com | grep status

# If GitHub is up, restart workflows
gh run list --repo owner/repo --status failure --limit 5 \
  | awk '{print $1}' | xargs -I {} gh run rerun {}
```

### Production Deployment Emergency

```bash
# If deployment failed and main is broken:
# 1. Identify last good commit
git log --oneline | grep "✓"

# 2. Revert to last known good
git revert <good-commit-hash>
git push origin main

# 3. Verify new deployment
gh run list --repo owner/repo --branch main --limit 1
```

### Data Loss Scenario

```bash
# If accidentally deleted important file:
# 1. Check git history
git log --follow -- path/to/file

# 2. Recover file
git show <commit-hash>:path/to/file > path/to/file

# 3. Commit recovery
git add path/to/file
git commit -m "fix: restore accidentally deleted file"
git push
```

## Debugging Commands

### Get detailed error information

```bash
# Full log output
gh run view <run-id> --log

# Just errors
gh run view <run-id> --log | grep -i error

# Specific job logs
gh run view <run-id> --log | grep -A 20 "test-frontend"
```

### Investigate recent failures

```bash
# List failed runs
gh run list --repo owner/repo --status failure --limit 10

# Filter by workflow
gh run list --repo owner/repo --workflow ci.yml --status failure

# Get failure summary
gh run list --repo owner/repo --limit 20 --json conclusion \
  --jq '.[] | select(.conclusion=="failure")'
```

### Check job dependencies

```bash
# View job status
gh run view <run-id> --json jobs

# View with timing
gh run view <run-id> --json jobs \
  --jq '.[] | {name, status, startedAt, completedAt}'
```

## Communication Template

### When reporting incidents

**To team** (Slack):
```
⚠️ CI/CD Alert
Workflow: [name]
Status: Failed
Branch: [branch]
Commit: [hash]
Logs: [link to run]
Investigating...
```

**After resolution** (Slack):
```
✅ Incident Resolved
Issue: [brief description]
Root cause: [what happened]
Fix: [what was done]
Actions: [prevention steps]
```

## Post-Incident Review

After resolving any incident >15 minutes:

1. **Document**:
   - What went wrong
   - Root cause
   - How it was fixed
   - Prevention measures

2. **Share**:
   - Post summary in team channel
   - Link to relevant changes
   - Discuss lessons learned

3. **Prevent**:
   - Add checks to catch issue early
   - Update documentation
   - Improve monitoring
   - Train team if needed

## Prevention Checklist

- [ ] Tests pass locally before pushing
- [ ] Branch is up to date with main
- [ ] Lint/format run locally
- [ ] No console errors/warnings
- [ ] Environment variables documented
- [ ] Security practices followed
- [ ] Changes tested in staging if available

## Resources

- [GitHub Actions Troubleshooting](https://docs.github.com/en/actions/guides)
- [GitHub Status Page](https://www.githubstatus.com)
- [GitHub Support](https://support.github.com)
- [Vercel Status](https://vercel.statuspage.io)
- [Stacks Foundation](https://stacks.org)

## On-Call Rotation

| Week | Lead | Backup |
|------|------|--------|
| Rotate weekly or as needed | | |

## Contact Information

- **Team Lead**: Mosas2000
- **Security**: [contact]
- **Infrastructure**: [contact]
- **Escalation**: [contact]
