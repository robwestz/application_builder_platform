# Foundation: Infrastructure - Pulumi + ArgoCD

**Decision:** Pulumi (IaC) + ArgoCD (GitOps)
**Score:** 0.82 / 1.0
**Category:** Infrastructure & Deployment
**Status:** Active

## Stack

- **Pulumi:** Infrastructure as Code using TypeScript/Python (NOT HCL/DSL)
- **ArgoCD:** GitOps continuous deployment for Kubernetes
- **AWS/GCP:** Cloud providers (EU regions for GDPR)

## Why Pulumi over Terraform?

**CRITICAL:** Terraform's BSL 1.1 license is **NOT** OSI-approved and has commercial restrictions.

- **License:** Pulumi = Apache 2.0 (truly open source), Terraform = BSL 1.1 (restricted)
- **No DSL:** Use TypeScript/Python instead of learning HCL
- **Type Safety:** Full IDE autocomplete and type checking
- **Reusability:** Functions, classes, npm packages
- **Testing:** Unit test your infrastructure with Jest/pytest

## Pulumi Example (AWS)

```typescript
import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

// Create VPC
const vpc = new aws.ec2.Vpc('appkod-vpc', {
  cidrBlock: '10.0.0.0/16',
  enableDnsHostnames: true,
  tags: { Name: 'appkod-production' },
});

// Create RDS Postgres (EU region)
const db = new aws.rds.Instance('appkod-db', {
  engine: 'postgres',
  engineVersion: '16.1',
  instanceClass: 'db.t4g.medium',
  allocatedStorage: 100,
  dbSubnetGroupName: subnetGroup.name,
  vpcSecurityGroupIds: [dbSecurityGroup.id],
  multiAz: true, // High availability
  backupRetentionPeriod: 30,
  storageEncrypted: true,
});

// Export connection string
export const dbEndpoint = db.endpoint;
```

## ArgoCD GitOps

```yaml
# argocd/applications/appkod-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: appkod-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/appkod/platform
    targetRevision: main
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: appkod-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Multi-environment Setup

```
environments/
├── dev/          # Pulumi stack for development
├── staging/      # Pulumi stack for staging
└── production/   # Pulumi stack for production (EU-NORTH-1)
```

## Security

- **Secrets:** Use AWS Secrets Manager / GCP Secret Manager
- **Encryption:** All data encrypted at rest (KMS)
- **Network:** Private subnets, VPC peering, security groups
- **IAM:** Least privilege access

## CVE Status

- **Pulumi:** Dependency CVEs fixed - use v3.176.0+
- **ArgoCD:** Use v2.13.3+ (CVE-2024-xxxx patched)

## Resources

- **Pulumi:** https://www.pulumi.com/docs/
- **ArgoCD:** https://argo-cd.readthedocs.io/
- **AWS Best Practices:** https://aws.amazon.com/architecture/well-architected/
