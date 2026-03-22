# CI/CD Troubleshooting Guide

## Common Issues and Solutions

### GitHub Actions Issues

#### Workflow not triggering

**Problem**: Push to branch but workflow doesn't run

**Solutions**:
1. Check if branch is in workflow `on` conditions
2. Verify workflow YAML syntax is correct
3. Check if paths filter is too restrictive
4. Ensure file changes match path patterns
5. Look for any `if` conditions that might block execution

```bash
# Check workflow validity
gh workflow list --repo {owner}/{repo}
gh workflow view {workflow-name}
```

#### Workflow stuck in progress

**Problem**: Workflow has been running for hours

**Solutions**:
1. Check for infinite loops in scripts
2. Look for network timeouts
3. Review log output for hangs
4. Cancel workflow and check logs
5. Check runner resources

```bash
# Cancel workflow run
gh run cancel {run-id} --repo {owner}/{repo}
```

#### Insufficient permissions

**Problem**: "Resource not accessible by integration" error

**Solutions**:
1. Verify GitHub token has correct scopes
2. Check branch protection rules
3. Verify repository permissions
4. Ensure workflow has necessary permissions section

```yaml
permissions:
  contents: read
  pull-requests: write
  deployments: write
```

### Build Failures

#### ESLint errors

**Problem**: ESLint checks fail in CI but pass locally

**Solutions**:
```bash
# Run ESLint locally first
cd frontend
npm run lint

# Fix issues
npm run lint:fix

# Verify formatting
npm run format:check
```

#### Build timeout

**Problem**: Frontend build exceeds time limit

**Solutions**:
1. Check for large dependencies
2. Optimize imports
3. Review bundle size
4. Check for infinite loops
5. Increase GitHub Actions timeout if necessary

```bash
# Analyze build locally
cd frontend
npm run build

# Check if build completes
echo $?
```

#### Out of memory

**Problem**: "JavaScript heap out of memory" error

**Solutions**:
1. Increase Node.js memory in workflow
2. Reduce build scope
3. Remove large dependencies
4. Split build into smaller chunks

```yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

### Test Failures

#### Tests pass locally but fail in CI

**Problem**: Test results differ between environments

**Solutions**:
1. Check environment variables
2. Verify Node version matches
3. Check for timezone issues
4. Clear npm cache
5. Install dependencies fresh

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

#### Flaky tests

**Problem**: Tests fail intermittently in CI

**Solutions**:
1. Review test for race conditions
2. Check for time-dependent tests
3. Ensure proper async/await handling
4. Add retry logic if necessary
5. Review mocks and stubs

```bash
# Run tests multiple times
for i in {1..5}; do npm test; done
```

### Deployment Issues

#### Vercel deployment fails

**Problem**: Deploy step shows error

**Solutions**:
1. Verify VERCEL_TOKEN is valid
2. Check VERCEL_ORG_ID is correct
3. Ensure VERCEL_PROJECT_ID is set
4. Review build configuration in Vercel
5. Check vercel.json settings

```bash
# Test Vercel setup locally
npx vercel --token $VERCEL_TOKEN
```

#### Preview URL not generated

**Problem**: No comment on PR with preview URL

**Solutions**:
1. Check deploy-preview workflow logs
2. Verify Vercel integration is connected
3. Check GitHub token permissions
4. Ensure workflow is in Actions tab
5. Review workflow output

#### Production deployment blocked

**Problem**: Can't deploy to production

**Solutions**:
1. Check all CI checks passed
2. Review branch protection rules
3. Verify approval requirements met
4. Check push permissions
5. Ensure on main branch

### Contract/Blockchain Issues

#### Clarinet check fails

**Problem**: Smart contract validation fails

**Solutions**:
```bash
# Run Clarinet check locally
npx clarinet check

# Review error messages
npx clarinet check --verbose
```

#### Contract tests timeout

**Problem**: Contract tests exceed time limit

**Solutions**:
1. Review contract complexity
2. Check for infinite loops in smart contract
3. Optimize contract operations
4. Increase test timeout
5. Split tests into smaller suites

```bash
# Run contract tests locally with timeout
npm test -- --testTimeout 30000
```

### Security Scan Issues

#### CodeQL analysis fails

**Problem**: CodeQL step shows errors

**Solutions**:
1. Check if supported language is detected
2. Verify build succeeds before CodeQL
3. Review CodeQL configuration
4. Check for syntax errors in code
5. Try rebuilding from scratch

#### Secret scanning alerts

**Problem**: TruffleHog or secrets detected

**Solutions**:
1. Remove secret from repository
2. Rotate actual secret
3. Force push warning only in CI (not commit history)
4. Add to .gitignore
5. Use proper secret management

### Performance Issues

#### Workflow runs too slow

**Problem**: CI pipeline takes too long

**Solutions**:
1. Review job dependencies
2. Run jobs in parallel where possible
3. Cache npm dependencies
4. Cache build outputs
5. Reduce test scope for PRs

#### High GitHub Actions usage

**Problem**: Approaching monthly minute limit

**Solutions**:
1. Reduce workflow frequency
2. Skip workflows for documentation changes
3. Use path filters to skip unnecessary runs
4. Consolidate jobs
5. Consider self-hosted runners

```yaml
paths-ignore:
  - '**.md'
  - 'docs/**'
```

## Debugging Techniques

### View Workflow Logs

```bash
# List workflow runs
gh run list --repo {owner}/{repo}

# View specific run details
gh run view {run-id} --log

# Download logs as zip
gh run download {run-id}
```

### Enable Debug Logging

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

### SSH into Runner (Self-hosted)

1. Add workflow_run event trigger
2. Enable SSH debugging
3. SSH into runner
4. Inspect environment
5. Run commands manually

### Check Resource Usage

```bash
# View runner resources
cat /proc/cpuinfo
free -m
df -h
```

## Prevention

### Best Practices

1. **Test locally first**
   ```bash
   npm test
   cd frontend && npm run lint && npm run build
   ```

2. **Use proper environment variables**
   - Never commit secrets
   - Use GitHub Secrets
   - Document required variables

3. **Keep dependencies updated**
   - Regular npm update
   - Check for vulnerabilities
   - Pin critical versions

4. **Monitor CI/CD health**
   - Check Actions dashboard regularly
   - Review failed workflows
   - Track metrics over time

5. **Document procedures**
   - Keep this guide updated
   - Document custom scripts
   - Share knowledge with team

## Getting Help

### Information to include in issues

1. Workflow name and run ID
2. Error messages from logs
3. Local reproduction steps
4. Environment details (Node version, npm version)
5. Recent changes that might affect it
6. GitHub Actions logs (sanitized for secrets)

### Useful Commands

```bash
# Show GitHub Actions configuration
gh actions-cache list --repo {owner}/{repo}

# View secrets (names only, not values)
gh secret list --repo {owner}/{repo}

# Get workflow file
gh api repos/{owner}/{repo}/actions/workflows/{workflow-id}

# List recent runs with status
gh run list --repo {owner}/{repo} --limit 10
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Creating and Managing Workflows](https://docs.github.com/en/actions/quickstart)
