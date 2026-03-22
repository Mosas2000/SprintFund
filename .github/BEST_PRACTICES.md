# GitHub Actions Best Practices

## Workflow Design

### Reusable Actions

Create custom actions for repeated operations:

```yaml
# .github/actions/setup-node/action.yml
name: 'Setup Node'
description: 'Configure Node.js environment'
inputs:
  node-version:
    required: true
    default: '20'
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
```

### Matrix Strategy

Test across multiple configurations:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
    os: [ubuntu-latest, macos-latest, windows-latest]

runs-on: ${{ matrix.os }}

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### Concurrency Control

Prevent duplicate runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Security Practices

### Least Privilege

```yaml
permissions:
  contents: read
  pull-requests: write
  deployments: write
```

### Secret Management

```yaml
# Good: Use secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# Bad: Never hardcode
env:
  API_KEY: sk_live_1234567890
```

### Trusted Actions

```yaml
# Use specific versions
uses: actions/setup-node@v4
# Not: @main (unstable)

# Pin to commit SHA for maximum security
uses: actions/setup-node@83c9f3f6b89e7605394f1cac4ddc2121a130e63c
```

## Performance Optimization

### Caching

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Parallel Jobs

```yaml
jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - run: npm test:frontend

  test-contracts:
    runs-on: ubuntu-latest
    steps:
      - run: npm test:contracts

  # Both run in parallel, not sequentially
```

### Skip Unnecessary Steps

```yaml
- name: Run tests
  if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main'
  run: npm test

- name: Deploy preview
  if: github.event_name == 'pull_request'
  run: npm run deploy:preview
```

## Error Handling

### Conditional Steps

```yaml
- name: Build
  run: npm run build

- name: Upload artifacts
  if: success()
  run: npm run upload

- name: Notify failure
  if: failure()
  run: notify-slack "Build failed"
```

### Continue on Error

```yaml
- name: Run optional check
  continue-on-error: true
  run: npm run optional-check

# Workflow continues even if this fails
```

### Retry Logic

```yaml
- name: Deploy (with retry)
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 5
    command: npm run deploy
```

## Testing

### Linting

```yaml
- name: Lint code
  run: npm run lint
  # Use --max-warnings=0 to treat warnings as errors
```

### Unit Tests

```yaml
- name: Run unit tests
  run: npm test
  env:
    CI: true

- name: Upload coverage
  uses: codecov/codecov-action@v3
  if: always()
```

### Type Checking

```yaml
- name: Check types
  run: npm run type:check
  # Catch TS errors before runtime
```

### Build Validation

```yaml
- name: Build application
  run: npm run build

- name: Check build output
  run: test -d .next && echo "Build successful"
```

## Documentation

### Workflow Comments

```yaml
# Explain non-obvious decisions
- name: Use specific Node version
  # Node 20 required for URL API compatibility
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```

### Job Descriptions

```yaml
jobs:
  lint-and-test:
    name: Lint and test code
    runs-on: ubuntu-latest
    # Clear purpose for workflow overview
```

## Common Patterns

### Conditional Deployment

```yaml
- name: Deploy to staging
  if: github.event_name == 'pull_request'
  run: npm run deploy:staging

- name: Deploy to production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: npm run deploy:production
```

### Dynamic Versioning

```yaml
- name: Generate version
  run: |
    VERSION=$(node -p "require('./package.json').version")
    echo "VERSION=$VERSION" >> $GITHUB_ENV

- name: Tag release
  run: git tag v${{ env.VERSION }}
```

### Artifact Management

```yaml
- name: Upload build artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: build-outputs
    path: |
      dist/
      .next/
    retention-days: 30

- name: Download artifacts
  uses: actions/download-artifact@v3
  with:
    name: build-outputs
```

### Matrix with Conditions

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
    include:
      - node-version: 20
        primary: true

- name: Run full test suite
  if: matrix.primary
  run: npm run test:full
```

## Debugging

### Debug Logging

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  # Shows extra diagnostic logs

- name: Debug environment
  run: |
    echo "GitHub SHA: ${{ github.sha }}"
    echo "GitHub Ref: ${{ github.ref }}"
    echo "GitHub Actor: ${{ github.actor }}"
```

### Step Timing

```bash
# Add to scripts for timing
START=$(date +%s)
# ... do work ...
END=$(date +%s)
echo "Took $((END - START)) seconds"
```

### Conditional Debugging

```yaml
- name: Debug (only on failure)
  if: failure()
  run: |
    npm run debug
    cat debug.log
```

## Standards

### Use Consistent Formatting

```yaml
# Consistent indentation (2 spaces)
# Clear step names
# Environment variables in UPPER_CASE
# Inputs/outputs documented
```

### Semantic Versioning

```yaml
# Use @v3 (major version)
# Not @v3.1.2 (too specific)
# Not @main (unstable)
uses: actions/checkout@v4
```

### Naming Conventions

```
workflows/
  ci.yml              # Continuous integration
  deploy.yml          # Deployments
  security.yml        # Security scanning
  release.yml         # Release process
  scheduled.yml       # Scheduled tasks
```

## Cost Optimization

### Reduce Minute Usage

```yaml
# Skip jobs when not needed
- if: github.event_name == 'pull_request'

# Use path filters
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'

# Skip documentation changes
paths-ignore:
  - '**.md'
```

### Reuse Artifacts

```yaml
# Build once, use multiple times
- uses: actions/download-artifact@v3

# Instead of rebuilding for each job
```

### Efficient Caching

```yaml
# Cache dependencies
- uses: actions/cache@v3
  with:
    key: npm-${{ hashFiles('package-lock.json') }}

# Not unique per run
```

## Maintenance

### Regular Updates

- Review workflows quarterly
- Update action versions
- Remove unused workflows
- Archive old runs

### Monitoring

```bash
# Check workflow usage
gh run list --repo owner/repo --limit 100

# Check for failures
gh run list --repo owner/repo --status failure
```

### Documentation

- Keep workflows documented
- Document why decisions were made
- Share knowledge with team
- Update onboarding materials
