# Codegen Engine - Blueprint to Code Generation

**Status:** Phase 0 MVP (Basic CRUD generation)

## Overview

The Codegen Engine transforms Blueprint specifications (YAML/JSON) into full-stack Next.js + FastAPI applications.

```
Blueprint (YAML/JSON)
    ↓
Parser (validate schema)
    ↓
Generators (database, API, UI)
    ↓
Generated Code (Next.js + FastAPI)
```

## Architecture

### Modules

| Module | Purpose | Generates |
|--------|---------|-----------|
| **BlueprintParser** | Validates and parses Blueprint | - |
| **DatabaseGenerator** | Database schema generation | `schema.prisma`, `models.py` |
| **APIGenerator** | API endpoint generation | `routes.py` (FastAPI) |
| **UIGenerator** | Frontend page generation | `page.tsx` (Next.js) |
| **CodegenEngine** | Main orchestrator | All files |

## Usage

### Python API

```python
from codegen import CodegenEngine

# Load Blueprint
engine = CodegenEngine("blueprint.yaml")

# Validate
valid, errors = engine.validate()
if not valid:
    print("Validation errors:", errors)
    exit(1)

# Generate all code
generated = engine.generate_all("./output")

# Or write directly to disk
engine.write_all("./output")

# Output:
# ✅ Generated: prisma/schema.prisma
# ✅ Generated: api/models.py
# ✅ Generated: api/routes.py
# ✅ Generated: web/app/customers/page.tsx
```

### Generated Code Structure

```
output/
├── prisma/
│   └── schema.prisma          # Prisma schema for Next.js
├── api/
│   ├── models.py              # SQLModel models for FastAPI
│   └── routes.py              # FastAPI routes
└── web/
    └── app/
        ├── customers/
        │   └── page.tsx       # Customer list page
        └── orders/
            └── page.tsx       # Order list page
```

## Example Blueprint → Generated Code

### Input: blueprint.yaml

```yaml
version: "1.0"
name: "Simple CRM"
description: "Customer relationship management"

database:
  tables:
    - name: customers
      fields:
        - {name: id, type: uuid, primary: true}
        - {name: name, type: string, required: true}
        - {name: email, type: email, unique: true}

ui:
  pages:
    - path: /customers
      title: "Customers"
      components:
        - type: table
          source: customers
          columns: [name, email]

api:
  endpoints:
    - path: /api/customers
      method: GET
      table: customers
      paginated: true
```

### Output: prisma/schema.prisma

```prisma
// Auto-generated Prisma schema from Blueprint
model Customer {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  tenantId  String   @map("tenant_id")

  @@index([tenantId])
  @@map("customers")
}
```

### Output: api/models.py

```python
"""Auto-generated SQLModel models from Blueprint"""
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4

class Customer(SQLModel, table=True):
    __tablename__ = "customers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    tenant_id: UUID = Field(index=True)
```

### Output: api/routes.py

```python
"""Auto-generated API routes from Blueprint"""
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

router = APIRouter()

@router.get("/api/customers", response_model=List[Customer])
async def list_customers(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    statement = select(Customer)
    # TODO: Add tenant filtering
    results = session.exec(statement).all()
    return results
```

### Output: web/app/customers/page.tsx

```typescript
// Auto-generated Next.js page from Blueprint
'use client';

import { useEffect, useState } from 'react';
import { Table } from '@/components/ui/table';

export default function CustomersPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/customers');
    const json = await response.json();
    setData(json);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <table className="w-full border rounded-lg">
        <thead>
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="p-4">{row.name}</td>
              <td className="p-4">{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Supported Features (Phase 0)

### Database
- ✅ Table definitions
- ✅ Fields with types (string, number, boolean, datetime, uuid, etc.)
- ✅ Primary keys (auto-increment, uuid)
- ✅ Unique constraints
- ✅ Default values
- ✅ Timestamps (created_at, updated_at)
- ✅ Multi-tenant (tenant_id field + index)
- ⚠️ Relations (basic support, needs expansion)

### API
- ✅ CRUD endpoints (GET, POST, PUT, DELETE)
- ✅ List endpoints (GET /resources)
- ✅ Detail endpoints (GET /resources/{id})
- ✅ Auth requirements (public/required)
- ⚠️ Pagination (TODO in generated code)
- ⚠️ Filtering (TODO in generated code)
- ⚠️ Sorting (TODO in generated code)

### UI
- ✅ Page generation
- ✅ Table components
- ⚠️ Form components (basic stub)
- ⚠️ Button components (basic stub)
- ❌ Complex layouts (containers, grids)
- ❌ Charts, metrics
- ❌ Modals, drawers

## Roadmap

### Phase 1 (Next)
- Relations (foreign keys, joins)
- Advanced UI components (forms, modals)
- Validation rules
- File uploads
- Search/filtering

### Phase 2
- Workflows (Temporal integration)
- Connectors (BankID, Stripe, etc.)
- Custom actions/logic
- Real-time (WebSockets)

### Phase 3
- AI-assisted generation (improve prompts)
- Visual editor (drag-and-drop)
- Blueprint marketplace (templates)

## Testing

```bash
cd packages/api
pytest src/codegen/tests/
```

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## License

UNLICENSED - Proprietary to Appkod Platform
