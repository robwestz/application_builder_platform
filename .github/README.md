# CI/CD Configuration

**Status:** Phase 0 - Basic CI/CD pipeline active

## Overview

This directory contains CI/CD configuration for the Appkod Platform.

## GitHub Actions Workflows

### `.github/workflows/ci.yml`

Main CI pipeline that runs on every push and pull request.

**Jobs:**
- **lint** - Lint TypeScript (ESLint) and Python (Ruff)
- **typecheck** - TypeScript type checking
- **test** - Unit tests (Vitest + pytest)
- **build** - Build check for all packages
- **security** - Trivy security scanning (CVE + secrets)
- **dependency-review** - Review dependency changes (PRs only)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**Status Badge:**

```markdown
![CI](https://github.com/appkod/platform/workflows/CI/badge.svg)
```

## Dependabot

### `.github/dependabot.yml`

Automated dependency updates for:
- **npm** (platform monorepo) - Weekly on Mondays
- **pip** (API + Runner) - Weekly on Mondays
- **GitHub Actions** - Weekly on Mondays
- **Docker** - Weekly on Mondays

**Configuration:**
- Max 10 PRs for npm, 5 for pip
- Groups dev dependencies together
- Groups minor/patch updates

## Pre-commit Hooks

### `.pre-commit-config.yaml`

Local git hooks that run before commits:

**Hooks:**
- **trivy-secrets** - Scan for leaked secrets (API keys, passwords)
- **ruff** - Python linting + formatting
- **prettier** - TypeScript/JSON/YAML formatting
- **trailing-whitespace** - Remove trailing whitespace
- **check-yaml** - Validate YAML syntax
- **check-json** - Validate JSON syntax
- **detect-private-key** - Detect private keys
- **markdownlint** - Lint Markdown files

**Setup:**

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

## Security Scanning

### Trivy (Aqua Security)

**Scans:**
- Filesystem vulnerabilities (dependencies)
- Secret detection (API keys, tokens, passwords)
- License compliance
- IaC misconfigurations

**Integration:**
- GitHub Actions (ci.yml)
- Pre-commit hooks
- SARIF upload to GitHub Security tab

**View results:**
- GitHub → Security → Code scanning alerts

### Dependabot Security Advisories

Automatically creates PRs for security vulnerabilities in dependencies.

**View:**
- GitHub → Security → Dependabot alerts

## Branch Protection

**Recommended settings for `main` branch:**

- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass:
  - `lint`
  - `typecheck`
  - `test`
  - `build`
  - `security`
- ✅ Require conversation resolution
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes (dangerous!)

## Local Development

### Run CI checks locally

```bash
# Lint
make lint

# Type check
make typecheck

# Test
make test

# Security scan
docker run --rm -v "$(pwd):/src" aquasec/trivy fs /src

# All checks
make validate
```

### Pre-commit hooks

```bash
# Install
pre-commit install

# Run on all files
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

## Troubleshooting

### CI fails with "No tests yet"

This is expected in Phase 0. Add `|| echo "No tests yet"` to test commands.

### Trivy secret scan fails

Check for leaked secrets:

```bash
# Scan locally
docker run --rm -v "$(pwd):/src" aquasec/trivy fs --scanners secret /src
```

Common false positives:
- Example API keys in documentation (use `# trivy:ignore` comment)
- Test fixtures with fake credentials

### Dependabot PRs overwhelming

Adjust limits in `dependabot.yml`:

```yaml
open-pull-requests-limit: 5  # Reduce from 10
```

Or group updates:

```yaml
groups:
  all-dependencies:
    patterns: ["*"]
```

## Roadmap

### Phase 1
- E2E tests (Playwright in CI)
- Contract tests (Pact)
- Performance benchmarks
- Code coverage reporting (Codecov)
- Deploy preview environments

### Phase 2
- Multi-environment pipelines (dev, staging, prod)
- Canary deployments
- Automated rollbacks
- Integration tests with real services

### Phase 3
- Load testing (k6)
- Chaos engineering (Litmus)
- Advanced security scanning (SAST, DAST)
- Compliance scanning (GDPR, SOC 2)

## Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Trivy Docs:** https://aquasecurity.github.io/trivy/
- **Pre-commit Docs:** https://pre-commit.com/
- **Dependabot Docs:** https://docs.github.com/en/code-security/dependabot
