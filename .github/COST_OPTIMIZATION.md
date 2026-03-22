# CI/CD Cost Optimization and Runner Configuration

## GitHub Actions Pricing

### Minute Allocation

- **Free plan**: 2,000 minutes/month
- **Pro plan**: 3,000 minutes/month  
- **Enterprise**: Unlimited or pay-as-you-go

### Storage Allocation

- **Artifacts**: 5GB free, $0.50/GB after
- **Caches**: 5GB per repository
- **Logs**: Retained 90 days

## Cost Reduction Strategies

### 1. Optimize Job Duration

Current baseline: ~15 minutes total per run

```yaml
# Measure job duration
- name: Record timing
  run: echo "Job started at $(date)"

# Profile slow steps
- name: Build (with timing)
  run: time npm run build
```

Target: Reduce to <10 minutes

### 2. Reduce Run Frequency

```yaml
# Skip on documentation changes
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - '.github/*.md'

# Skip on trivial commits
if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

Potential savings: 30-50% of runs

### 3. Parallelize Jobs

```yaml
# Current: Sequential
# ❌ test (5 min) → lint (3 min) → build (5 min) = 13 min total

# Optimized: Parallel
# ✅ test (5 min) + lint (3 min) + build (5 min) = 5 min max

# Only need test job
# Lint and build only on success
jobs:
  test:
    runs-on: ubuntu-latest
  
  lint:
    runs-on: ubuntu-latest
    needs: [test]
    if: success()
```

Potential savings: 40-60% of minutes

### 4. Smart Caching

```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules/
      .next/cache
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
    restore-keys: ${{ runner.os }}-deps-

# Cache hit reduces job time by 70-80%
```

Potential savings: 20-40% of minutes

### 5. Matrix Optimization

```yaml
# Full matrix: runs N×M times
# ❌ 3 Node versions × 3 OS = 9 runs × 15 min = 135 min/code change

# Selective matrix: 
strategy:
  matrix:
    os: [ubuntu-latest]
    node-version: [20]
    include:
      - os: macos-latest
        node-version: 20  # Only on main
      
# ✅ 1 run normally, occasional multi-platform = 15-30 min/code change

# For PRs only:
if: github.ref == 'refs/heads/main'
```

Potential savings: 75-90% of matrix minutes

### 6. Conditional Deployments

```yaml
# Don't deploy on every change
- name: Deploy preview
  if: github.event_name == 'pull_request'
  run: npm run deploy:preview

# Don't deploy on documentation changes
- name: Deploy production
  if: |
    github.ref == 'refs/heads/main' && 
    !contains(github.event.head_commit.message, '[skip deploy]')
  run: npm run deploy:production
```

Potential savings: 10-30% of deployment minutes

## Cost Calculator

```
Monthly cost estimate:

Baseline (15 min × 20 runs/week × 4 weeks):
= 15 × 80 = 1,200 minutes/month
= Free (within 2,000 limit)

With optimization (5 min × 20 runs/week × 4 weeks):
= 5 × 80 = 400 minutes/month
= Free (within 2,000 limit)
= 83% reduction
```

## Runner Configuration

### GitHub-Hosted Runners

| Runner | Cost | Use Case |
|--------|------|----------|
| ubuntu-latest | 1.0x | Default, most jobs |
| windows-latest | 2.0x | Windows testing |
| macos-latest | 10.0x | macOS testing |

### Specification

- **ubuntu-latest**: 
  - 2 cores, 7 GB RAM
  - Fast npm install
  - Recommended for 95% of jobs

- **macos-latest**:
  - 3 cores, 14 GB RAM
  - Use only for macOS-specific tests
  - High cost, minimize usage

- **windows-latest**:
  - 2 cores, 7 GB RAM
  - Use for Windows-specific tests
  - Slower than Ubuntu

### Self-Hosted Runners (Optional)

For enterprise deployments only:

```bash
# Setup (one-time)
./config.sh --url https://github.com/your-repo \
  --token <registration-token> \
  --name production-runner

# Start runner
./run.sh
```

**Pros**: Unlimited minutes, faster, custom software
**Cons**: Maintenance overhead, security considerations

## Memory Optimization

### Current Node Memory

```yaml
env:
  NODE_OPTIONS: --max-old-space-size=2048
```

### Optimization

```yaml
# For build jobs (heavier)
- name: Build (with more memory)
  env:
    NODE_OPTIONS: --max-old-space-size=4096
  run: npm run build

# For test jobs (lighter)
- name: Test (with standard memory)
  env:
    NODE_OPTIONS: --max-old-space-size=2048
  run: npm test
```

## Artifact Management

### Current Storage Usage

```bash
# Check artifact usage
gh api repos/owner/repo/actions/artifacts --paginate \
  --jq '.artifacts | map(.size_in_bytes) | add'
```

### Optimization

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build-outputs
    path: dist/
    retention-days: 1  # Delete after 1 day instead of 90

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: test-reports-${{ matrix.node-version }}
    path: coverage/
    retention-days: 30  # Keep longer for analysis
```

### Cost Impact

- 10 artifacts × 100 MB = 1 GB
- Reduced to 2 days retention = 80% reduction
- ~$0.40/month savings

## Estimated Monthly Savings

| Optimization | Time/Run | Impact | Monthly |
|-------------|----------|--------|---------|
| Parallelize | -5 min | 60-70 runs | 300-350 min |
| Cache | -2 min | 70% hit rate | 200-250 min |
| Skip docs | -2 min | 20% of runs | 64 min |
| Smart matrix | -10 min | 15% of runs | 150 min |
| Artifact cleanup | N/A | 80% reduction | $0.30-0.50 |
| **Total Savings** | | | 700-850 min/mo |
| | | | ~60% reduction |

## Implementation Roadmap

### Phase 1 (Week 1): Low-effort wins
- [ ] Add path filtering for .md files
- [ ] Reduce artifact retention
- [ ] Adjust matrix for non-main branches

### Phase 2 (Week 2): Caching optimization
- [ ] Improve cache strategy
- [ ] Cache build outputs
- [ ] Cache dependency trees

### Phase 3 (Week 3): Job optimization
- [ ] Profile slow jobs
- [ ] Optimize build process
- [ ] Reduce test scope on PRs

### Phase 4 (Month 2): Long-term improvements
- [ ] Consider self-hosted runners if needed
- [ ] Implement scheduled runs for expensive tests
- [ ] Monitor and iterate

## Monitoring & Reporting

### Weekly Report

```bash
# Get last week's usage
gh run list --repo owner/repo --limit 100 --json durationMinutes \
  --jq 'map(.durationMinutes) | add'
```

### Monthly Dashboard

Create dashboard tracking:
- Total minutes used
- Cost vs budget
- Trend over time
- Most expensive workflows

### Alerts

Set up alerts for:
- Usage >80% of monthly allowance
- Single run >30 minutes
- Unusual spike in runs

## Cost Control Best Practices

1. **Monitor regularly**: Weekly check of usage
2. **Set limits**: Alert at 80% of monthly quota
3. **Communicate**: Share costs with team
4. **Iterate**: Monthly optimization review
5. **Document**: Keep cost decisions recorded

## GitHub Enterprise Features

If budget allows:

- **Enterprise plan**: Unlimited minutes ($231/month)
- **Advanced Security**: CodeQL, secret scanning
- **Deployment environments**: Better approval workflow
- **Self-hosted runners**: Unlimited compute

## Resources

- [GitHub Billing](https://github.com/settings/billing)
- [Actions Pricing](https://github.com/pricing)
- [Usage Reports](https://github.com/settings/billing/summary)
- [Runner Specifications](https://docs.github.com/en/actions/using-github-hosted-runners)
