# Foundation: Policy/ABAC - Open Policy Agent (OPA)

**Decision:** Open Policy Agent (OPA) v0.70.0+
**Score:** 0.86 / 1.0
**Category:** Authorization & Policy Engine
**Status:** Active

## Overview

OPA is our chosen policy engine for fine-grained authorization (RBAC/ABAC). It decouples policy from code, enabling dynamic, context-aware access control.

## Why OPA?

- **CNCF Graduated:** Battle-tested, production-ready
- **Rego Language:** Declarative policy language (like SQL for permissions)
- **Real-time Decisions:** Sub-millisecond policy evaluation
- **Cloud-native:** Stateless, horizontally scalable
- **Universal:** Works with any service (API, DB, UI)
- **Audit Trail:** All decisions logged

## Scorecard

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Security | 0.95 | 30% | 0.29 |
| Stability | 0.90 | 25% | 0.23 |
| Performance | 0.85 | 15% | 0.13 |
| Integration Fit | 0.80 | 15% | 0.12 |
| License | 1.00 | 10% | 0.10 |
| Community | 0.90 | 5% | 0.05 |
| **TOTAL** | **0.86** | 100% | **0.92** |

## Alternatives

- **OpenFGA:** Faster for pure relationship-based auth, but had CVE-2025-25196 (auth bypass)
- **Cedar (AWS):** New, promising, but immature ecosystem
- **Casbin:** Good for simple RBAC, lacks ABAC sophistication

## Integration (FastAPI)

```python
from fastapi import Depends, HTTPException
import httpx

async def check_permission(user_id: str, action: str, resource: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://opa:8181/v1/data/appkod/allow",
            json={
                "input": {
                    "user": {"id": user_id},
                    "action": action,
                    "resource": resource,
                }
            },
        )
        result = response.json()
        return result.get("result", False)

@app.delete("/blueprints/{blueprint_id}")
async def delete_blueprint(
    blueprint_id: str,
    user: User = Depends(get_current_user),
):
    allowed = await check_permission(user.id, "delete", f"blueprint:{blueprint_id}")
    if not allowed:
        raise HTTPException(status_code=403, detail="Forbidden")
    # ... delete logic
```

## Policy Example (Rego)

```rego
package appkod

# Owner can do anything
allow {
    input.user.role == "owner"
}

# Admin can create/read/update blueprints
allow {
    input.user.role == "admin"
    input.action in ["create", "read", "update"]
    startswith(input.resource, "blueprint:")
}

# Developer can read blueprints
allow {
    input.user.role == "developer"
    input.action == "read"
    startswith(input.resource, "blueprint:")
}

# Same tenant check
allow {
    input.user.tenant_id == input.resource.tenant_id
    input.action == "read"
}
```

## Multi-tenant Isolation

```rego
# Enforce tenant boundary
deny {
    input.user.tenant_id != input.resource.tenant_id
    not input.user.role == "super_admin"
}
```

## Performance

- **Latency:** <10ms P95 (local), <50ms P95 (network)
- **Throughput:** 10,000+ decisions/sec per instance
- **Caching:** Built-in decision cache

## CVE Status

- **CVE-2024-8260:** Windows SMB path traversal (fixed v0.68.0)
- **Recommendation:** Use v0.70.0+

## Resources

- **Docs:** https://www.openpolicyagent.org/docs/
- **Playground:** https://play.openpolicyagent.org/
- **Best Practices:** https://www.styra.com/opa-best-practices/
