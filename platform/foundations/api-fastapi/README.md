# Foundation: API Framework - FastAPI

**Decision:** FastAPI v0.115.6+
**Score:** 0.88 / 1.0
**Category:** Backend Framework
**Status:** Active

## Why FastAPI?

- **Python = AI/ML:** Access to entire Python ecosystem (critical for AI-powered builder)
- **OpenAPI Auto-gen:** Automatic API docs (Swagger UI)
- **Type Safety:** Pydantic for request/response validation
- **Async:** High performance with async/await
- **Standards-based:** ASGI, OpenAPI, JSON Schema

## Hello World

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Blueprint(BaseModel):
    name: str
    spec: dict

@app.post("/blueprints")
async def create_blueprint(blueprint: Blueprint):
    # Pydantic validates input automatically
    return {"id": "uuid", "name": blueprint.name}
```

## Multi-tenant Middleware

```python
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract tenant from JWT or subdomain
        tenant_id = extract_tenant(request)
        if not tenant_id:
            raise HTTPException(401, "Missing tenant")

        # Set in request state
        request.state.tenant_id = tenant_id

        # Set Postgres RLS context
        async with db_session() as session:
            await session.execute(f"SET app.current_tenant_id = '{tenant_id}'")

        response = await call_next(request)
        return response
```

## Dependency Injection

```python
from fastapi import Depends

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Validate token with Keycloak
    return await validate_token(token)

@app.get("/blueprints")
async def list_blueprints(user: User = Depends(get_current_user)):
    # user is automatically injected and validated
    return await fetch_blueprints(user.tenant_id)
```

## OpenAPI Integration

```python
app = FastAPI(
    title="Appkod Platform API",
    version="1.0.0",
    openapi_tags=[
        {"name": "blueprints", "description": "Blueprint CRUD"},
        {"name": "connectors", "description": "Connector management"},
    ],
)

# Auto-generated docs at /docs (Swagger UI)
# Auto-generated schema at /openapi.json
```

## CVE Status

- **CVE-2024-24762:** ReDoS in header parsing - fixed in v0.115.6+

## Performance

- **Throughput:** 10,000+ req/sec (single instance)
- **Latency:** <10ms P50, <50ms P95 (simple endpoints)
- **Scaling:** Horizontal (stateless)

## Resources

- **Docs:** https://fastapi.tiangolo.com/
- **Tutorial:** https://fastapi.tiangolo.com/tutorial/
- **Async Guide:** https://fastapi.tiangolo.com/async/
