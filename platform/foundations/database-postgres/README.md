# Foundation: Database - PostgreSQL + Prisma + SQLModel

**Decision:** PostgreSQL 16 + Prisma (TS) + SQLModel (Python)
**Score:** 0.87 / 1.0
**Category:** Database & ORM
**Status:** Active

## Stack

- **PostgreSQL 16:** Primary database (ACID, RLS, JSONB, full-text search)
- **Prisma:** TypeScript ORM for Next.js (type-safe, migrations, codegen)
- **SQLModel:** Python ORM for FastAPI (Pydantic-based, async via SQLAlchemy)

## Why This Stack?

- **Type Safety:** Both ORMs provide full TypeScript/Python type safety
- **RLS Support:** Postgres Row-Level Security for multi-tenant isolation
- **Mature:** Battle-tested at scale (Instagram, Spotify, GitHub)
- **EU-Ready:** AWS RDS Frankfurt, GCP CloudSQL Belgium
- **Performance:** JSONB for flexible schemas, excellent query planner

## Multi-tenant with RLS

```sql
-- Enable RLS on all tables
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their tenant's data
CREATE POLICY tenant_isolation ON blueprints
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Set tenant context per request
SET app.current_tenant_id = 'tenant-uuid-here';
```

## Prisma Example (Next.js)

```typescript
// schema.prisma
model Blueprint {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  name      String
  spec      Json
  createdAt DateTime @default(now())

  @@index([tenantId])
  @@map("blueprints")
}

// Usage
const blueprints = await prisma.blueprint.findMany({
  where: { tenantId },
});
```

## SQLModel Example (FastAPI)

```python
from sqlmodel import Field, SQLModel, select

class Blueprint(SQLModel, table=True):
    __tablename__ = "blueprints"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    tenant_id: uuid.UUID = Field(index=True)
    name: str
    spec: dict = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Query with tenant filter
async with session() as db:
    result = await db.execute(
        select(Blueprint).where(Blueprint.tenant_id == tenant_id)
    )
    blueprints = result.scalars().all()
```

## CVE Status

- **PostgreSQL:** Rock-solid security record
- **Prisma:** CVE-2024-45590 (SDK command injection) - fixed in v6.1.0+

## Performance

- **Read latency:** <5ms (indexed queries)
- **Write latency:** <10ms (single inserts)
- **Connections:** 100 per instance (use pgBouncer for pooling)
- **Storage:** Unlimited (AWS RDS, GCP CloudSQL)

## Resources

- **Postgres:** https://www.postgresql.org/docs/16/
- **Prisma:** https://www.prisma.io/docs
- **SQLModel:** https://sqlmodel.tiangolo.com/
