# @appkod/cli - Appkod Command Line Tool

**Aliases:** `appkod`, `gom`

Build VAD SOM HELST from the command line.

## Installation

```bash
# Install globally
npm install -g @appkod/cli

# Or use via npx
npx @appkod/cli --help
```

## Commands

### `appkod generate`

Generate code from Blueprint YAML/JSON.

```bash
# Generate from default blueprint.yaml
appkod generate

# Generate from specific file
appkod generate my-app.yaml

# Specify output directory
appkod generate -i blueprint.yaml -o ./output

# Watch mode (regenerate on changes)
appkod generate --watch
```

**Example:**

```yaml
# blueprint.yaml
version: "1.0"
name: "Simple CRM"

database:
  tables:
    - name: customers
      fields:
        - {name: id, type: uuid, primary: true}
        - {name: name, type: string}

ui:
  pages:
    - path: /customers
      title: "Customers"

api:
  endpoints:
    - path: /api/customers
      method: GET
      table: customers
```

```bash
appkod generate blueprint.yaml -o ./my-crm
cd my-crm
npm install
npx prisma generate
npm run dev
```

### `appkod validate`

Validate Blueprint schema.

```bash
# Validate blueprint.yaml
appkod validate

# Validate specific file
appkod validate my-app.yaml

# Verbose output (show Blueprint summary)
appkod validate -v
```

**Output:**

```
🔍 Blueprint Validator

✅ Blueprint is valid!

Blueprint Summary:
  Name:        Simple CRM
  Version:     1.0
  Tables:      3
  Pages:       5
  Endpoints:   12
```

### `appkod init`

Initialize new Appkod project.

```bash
# Create new project
appkod init my-project

# Use template
appkod init my-crm --template crm
```

**Templates:**
- `blank` - Empty project
- `crm` - Customer relationship management
- `blog` - Blog with posts and comments
- `ecommerce` - E-commerce with products and cart

### `appkod scaffold`

Create new app from template (coming in Phase 1).

```bash
appkod scaffold my-app --template crud
```

### `appkod dev`

Start local development environment (coming in Phase 1).

```bash
appkod dev
```

For now, use:

```bash
make dev-web    # Start Next.js
make dev-api    # Start FastAPI
```

### `appkod deploy`

Deploy to Appkod platform (coming in Phase 1).

```bash
appkod deploy --env production --region eu-north-1
```

### `appkod export`

Export generated code as ZIP/tar.gz (coming in Phase 1).

```bash
appkod export ./export --format zip
```

## Development

```bash
# Install dependencies
npm install

# Build CLI
npm run build

# Link locally
npm link

# Test
appkod --help
```

## Example Workflow

```bash
# 1. Create Blueprint
cat > blueprint.yaml <<EOF
version: "1.0"
name: "Task Manager"
database:
  tables:
    - name: tasks
      fields:
        - {name: id, type: uuid, primary: true}
        - {name: title, type: string}
        - {name: completed, type: boolean, default: false}
ui:
  pages:
    - path: /tasks
      title: "Tasks"
      components:
        - type: table
          source: tasks
          columns: [title, completed]
api:
  endpoints:
    - {path: /api/tasks, method: GET, table: tasks}
    - {path: /api/tasks, method: POST, table: tasks}
EOF

# 2. Validate
appkod validate

# 3. Generate code
appkod generate -o ./task-manager

# 4. Run app
cd task-manager
npm install
npx prisma generate
npm run dev
```

## License

UNLICENSED - Proprietary to Appkod Platform
