# Foundation: Queues/Scheduling - Temporal

**Decision:** Temporal v1.25.2+
**Score:** 0.83 / 1.0
**Category:** Workflow Orchestration
**Status:** Active

## Overview

Temporal provides durable workflow execution for complex, long-running processes (onboarding, payments, data pipelines).

## Why Temporal?

- **Durable Execution:** Workflows survive crashes, restarts, deployments
- **Built-in Retry:** Automatic retry with exponential backoff
- **Visibility:** Rich UI for monitoring workflow state
- **Multi-language:** TypeScript + Python SDKs
- **Battle-tested:** Used by Netflix, Snap, Stripe

## Use Cases for Appkod

1. **User Onboarding:** Multi-step signup flow (verify email → create tenant → setup billing)
2. **Blueprint Deploy:** Build → Test → Deploy → Health Check
3. **Scheduled Tasks:** Daily reports, cleanup jobs, backups
4. **Payment Processing:** Stripe checkout → update DB → send invoice → notify user
5. **Connector Sync:** Poll external API → transform data → update DB

## Workflow Example (TypeScript)

```typescript
import { proxyActivities } from '@temporalio/workflow';

const { sendEmail, createTenant, setupBilling } = proxyActivities({
  startToCloseTimeout: '1 minute',
});

export async function userOnboardingWorkflow(userId: string, email: string) {
  // Step 1: Send verification email
  await sendEmail(email, 'verification');

  // Step 2: Wait for email verification (can be hours/days!)
  await condition(() => isEmailVerified(userId));

  // Step 3: Create tenant
  const tenantId = await createTenant(userId);

  // Step 4: Setup billing
  await setupBilling(tenantId);

  return { tenantId, status: 'complete' };
}
```

## Workflow Example (Python)

```python
from temporalio import workflow

@workflow.defn
class UserOnboardingWorkflow:
    @workflow.run
    async def run(self, user_id: str, email: str) -> dict:
        # Durable execution - survives crashes!
        await workflow.execute_activity(
            send_email,
            args=[email, 'verification'],
            start_to_close_timeout=timedelta(minutes=1),
        )

        await workflow.wait_condition(lambda: self.email_verified)

        tenant_id = await workflow.execute_activity(create_tenant, args=[user_id])
        await workflow.execute_activity(setup_billing, args=[tenant_id])

        return {'tenant_id': tenant_id, 'status': 'complete'}
```

## When NOT to Use Temporal

- **Simple background jobs:** Use BullMQ/Celery instead (lighter weight)
- **High-frequency tasks:** Use Redis queues (Temporal has overhead)
- **Real-time processing:** Use Kafka/NATS for streaming

## Hybrid Approach

```
Temporal: Long-running workflows (onboarding, deploys)
BullMQ: Simple background jobs (send email, resize image)
Redis: Rate limiting, caching
```

## CVE Status

- **CVE-2023-3485:** Fixed in v1.24.0
- **Recommendation:** Use v1.25.2+

## Performance

- **Workflow start:** ~50ms
- **Activity execution:** Depends on activity (ms to hours)
- **Max concurrent:** 10,000+ workflows per cluster

## Resources

- **Docs:** https://docs.temporal.io/
- **Samples:** https://github.com/temporalio/samples-typescript
- **UI:** http://localhost:8082 (dev)
