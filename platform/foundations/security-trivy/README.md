# Foundation: Security Scanning - Trivy

**Decision:** Trivy v0.58.2+
**Score:** 0.91 / 1.0 ⭐ **HIGHEST SCORE**
**Category:** Security & Vulnerability Scanning
**Status:** Active

## Overview

Trivy is our all-in-one security scanner for CVEs, SBOM generation, secrets detection, IaC scanning, and license compliance.

## Why Trivy?

- **All-in-one:** CVE + SBOM + Secrets + IaC + Licenses in single tool
- **Fast:** <30 seconds for full container scan
- **Accurate:** Low false-positive rate
- **CI-friendly:** Exit codes, JSON output, easy integration
- **Open Source:** Apache 2.0, Aqua Security-backed
- **SBOM Generation:** Critical for GDPR compliance

## Capabilities

### 1. CVE Scanning (Containers)

```bash
# Scan Docker image
trivy image appkod/api:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL appkod/api:latest

# Output as JSON
trivy image -f json -o report.json appkod/api:latest
```

### 2. SBOM Generation

```bash
# Generate SBOM in CycloneDX format
trivy image --format cyclonedx --output sbom.json appkod/api:latest

# Generate SBOM in SPDX format (GDPR-friendly)
trivy image --format spdx-json --output sbom-spdx.json appkod/api:latest
```

### 3. Filesystem Scanning

```bash
# Scan package.json for vulnerabilities
trivy fs --scanners vuln package.json

# Scan Python dependencies
trivy fs --scanners vuln requirements.txt
```

### 4. Secrets Detection

```bash
# Scan for leaked secrets
trivy fs --scanners secret .

# Common findings:
# - AWS keys, API tokens
# - Private keys, certificates
# - Database passwords in .env files
```

### 5. IaC Scanning

```bash
# Scan Kubernetes manifests
trivy config k8s/

# Scan Terraform/Pulumi code
trivy config infra/

# Common findings:
# - Containers running as root
# - Missing resource limits
# - Insecure network policies
```

### 6. License Scanning

```bash
# Check for non-compliant licenses
trivy fs --scanners license .

# Flag GPL, AGPL (incompatible with our Apache 2.0 stack)
```

## CI Integration (GitHub Actions)

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: trivy-secrets
        name: trivy secrets scanner
        entry: trivy fs --scanners secret --exit-code 1 .
        language: system
        pass_filenames: false
```

## Automated Dependency Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10

  - package-ecosystem: pip
    directory: "/packages/api"
    schedule:
      interval: weekly
```

## Security Policy

1. **Daily Scans:** Automated Trivy scans in CI/CD
2. **SBOM Generation:** Every release includes SBOM
3. **CVE Monitoring:** Dependabot + weekly Trivy scans
4. **Secret Prevention:** Pre-commit hooks block secrets
5. **License Compliance:** Flag GPL/AGPL in CI

## Example Report

```
appkod/api:latest (debian 12.5)

Total: 45 (UNKNOWN: 0, LOW: 20, MEDIUM: 15, HIGH: 8, CRITICAL: 2)

┌────────────────┬──────────────┬──────────┬────────┬───────────────────┐
│    Library     │ Vulnerability│ Severity │ Status │  Installed Version│
├────────────────┼──────────────┼──────────┼────────┼───────────────────┤
│ openssl        │ CVE-2024-123 │ CRITICAL │  fixed │ 3.0.13-1          │
│ postgresql-client │ CVE-2024-456 │ HIGH  │  fixed │ 16.1-2            │
└────────────────┴──────────────┴──────────┴────────┴───────────────────┘
```

## CVE Status

- **Trivy itself:** Use v0.58.2+ (some dependency CVEs in older versions)
- **Update frequency:** Weekly database updates

## Performance

- **Container scan:** <30 seconds
- **Filesystem scan:** <10 seconds
- **Database size:** ~500MB (cached)

## Resources

- **Docs:** https://aquasecurity.github.io/trivy/
- **GitHub:** https://github.com/aquasecurity/trivy
- **Tutorials:** https://trivy.dev/latest/tutorials/
