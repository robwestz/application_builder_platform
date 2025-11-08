# Foundation: Testing - Playwright + Vitest + Pact

**Decision:** Multi-layer testing strategy
**Score:** 0.88 / 1.0
**Category:** Testing & Quality Assurance
**Status:** Active

## Stack

- **Playwright:** E2E testing (browser automation)
- **Vitest:** Unit testing for TypeScript (fast, modern)
- **pytest:** Unit testing for Python
- **Pact:** Contract testing (API consumer/provider)

## Why Multi-layer Testing?

```
E2E Tests (Playwright)          ← Few, slow, high confidence
    ↓
Integration Tests (API)         ← Some, medium speed
    ↓
Contract Tests (Pact)           ← Ensure API compatibility
    ↓
Unit Tests (Vitest/pytest)      ← Many, fast, low-level
```

## Playwright E2E Example

```typescript
import { test, expect } from '@playwright/test';

test('user can create blueprint', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('[name=email]', 'test@appkod.se');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');

  // Navigate to blueprints
  await page.click('text=Blueprints');
  await expect(page).toHaveURL(/.*blueprints/);

  // Create new blueprint
  await page.click('text=Create Blueprint');
  await page.fill('[name=name]', 'My CRM');
  await page.click('button:has-text("Create")');

  // Verify created
  await expect(page.locator('text=My CRM')).toBeVisible();
});
```

## Vitest Unit Test

```typescript
import { describe, it, expect } from 'vitest';
import { validateBlueprint } from './blueprint.schema';

describe('Blueprint Validation', () => {
  it('should validate valid blueprint', () => {
    const result = validateBlueprint({
      version: '1.0',
      name: 'Test App',
      database: { tables: [/* ... */] },
      ui: { pages: [/* ... */] },
      api: { endpoints: [/* ... */] },
    });

    expect(result.success).toBe(true);
  });

  it('should reject blueprint without name', () => {
    const result = validateBlueprint({
      version: '1.0',
      database: { tables: [] },
      ui: { pages: [] },
      api: { endpoints: [] },
    });

    expect(result.success).toBe(false);
  });
});
```

## pytest Example

```python
import pytest
from blueprints import create_blueprint

@pytest.mark.asyncio
async def test_create_blueprint():
    blueprint = await create_blueprint(
        name="Test App",
        tenant_id="tenant-123",
    )

    assert blueprint.id is not None
    assert blueprint.name == "Test App"

@pytest.mark.asyncio
async def test_create_blueprint_enforces_tenant():
    with pytest.raises(PermissionError):
        await create_blueprint(
            name="Test App",
            tenant_id="different-tenant",  # Wrong tenant!
        )
```

## Pact Contract Testing

```typescript
// Consumer test (Next.js)
import { PactV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'appkod-web',
  provider: 'appkod-api',
});

it('gets list of blueprints', async () => {
  await provider
    .given('user has 2 blueprints')
    .uponReceiving('a request for blueprints')
    .withRequest({
      method: 'GET',
      path: '/api/blueprints',
      headers: { Authorization: 'Bearer token' },
    })
    .willRespondWith({
      status: 200,
      body: [
        { id: 'uuid-1', name: 'CRM' },
        { id: 'uuid-2', name: 'Blog' },
      ],
    });

  await provider.executeTest(async (mockServer) => {
    const response = await fetch(`${mockServer.url}/api/blueprints`);
    const data = await response.json();
    expect(data).toHaveLength(2);
  });
});
```

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user journeys (signup, create blueprint, deploy)
- **Contract Tests:** All API consumer/provider pairs

## CI Integration

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: npm run test

- name: Run E2E tests
  run: npx playwright test

- name: Upload coverage
  run: npx codecov
```

## Resources

- **Playwright:** https://playwright.dev/
- **Vitest:** https://vitest.dev/
- **Pact:** https://docs.pact.io/
