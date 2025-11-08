/**
 * Blueprint DSL Schema - Core specification for Appkod applications
 *
 * This schema defines the structure of a Blueprint - the declarative YAML/JSON
 * specification that describes an entire application (database, UI, API, workflows, auth).
 *
 * A Blueprint is the single source of truth for code generation.
 */

import { z } from 'zod';

/**
 * Supported field types for database schemas
 */
export const FieldTypeSchema = z.enum([
  // Primitive types
  'string',
  'text',
  'number',
  'integer',
  'float',
  'boolean',
  'date',
  'datetime',
  'timestamp',
  'time',

  // Special types
  'uuid',
  'email',
  'url',
  'phone',
  'json',
  'jsonb',
  'array',

  // Relations
  'relation',
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

/**
 * Field definition in a database table
 */
export const FieldSchema = z.object({
  name: z.string().min(1).regex(/^[a-z_][a-z0-9_]*$/i, 'Must be valid identifier'),
  type: FieldTypeSchema,
  required: z.boolean().optional().default(false),
  unique: z.boolean().optional().default(false),
  primary: z.boolean().optional().default(false),
  default: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
  description: z.string().optional(),

  // Validation rules
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(), // regex pattern

  // For relations
  references: z.object({
    table: z.string(),
    field: z.string(),
    onDelete: z.enum(['cascade', 'set_null', 'restrict']).optional(),
    onUpdate: z.enum(['cascade', 'set_null', 'restrict']).optional(),
  }).optional(),

  // Array element type
  items: FieldTypeSchema.optional(),
});

export type Field = z.infer<typeof FieldSchema>;

/**
 * Database table definition
 */
export const TableSchema = z.object({
  name: z.string().min(1).regex(/^[a-z_][a-z0-9_]*$/i, 'Must be valid identifier'),
  description: z.string().optional(),
  fields: z.array(FieldSchema).min(1),
  indexes: z.array(z.object({
    name: z.string(),
    fields: z.array(z.string()),
    unique: z.boolean().optional(),
  })).optional(),

  // Multi-tenant support
  tenantScoped: z.boolean().optional().default(true),

  // Soft delete
  softDelete: z.boolean().optional().default(false),

  // Timestamps
  timestamps: z.boolean().optional().default(true), // created_at, updated_at
});

export type Table = z.infer<typeof TableSchema>;

/**
 * Database schema definition
 */
export const DatabaseSchema = z.object({
  tables: z.array(TableSchema).min(1),
  migrations: z.object({
    autoGenerate: z.boolean().optional().default(true),
    directory: z.string().optional().default('./migrations'),
  }).optional(),
});

export type Database = z.infer<typeof DatabaseSchema>;

/**
 * UI component types
 */
export const ComponentTypeSchema = z.enum([
  // Layout
  'container',
  'grid',
  'flex',
  'card',

  // Data display
  'table',
  'list',
  'detail',
  'chart',
  'metric',

  // Forms
  'form',
  'input',
  'select',
  'checkbox',
  'radio',
  'textarea',
  'datepicker',
  'file_upload',

  // Actions
  'button',
  'link',
  'modal',
  'drawer',

  // Navigation
  'navbar',
  'sidebar',
  'breadcrumbs',
  'tabs',
]);

export type ComponentType = z.infer<typeof ComponentTypeSchema>;

/**
 * UI component definition
 */
export const ComponentSchema: z.ZodType<any> = z.lazy(() => z.object({
  type: ComponentTypeSchema,
  id: z.string().optional(),

  // Data source (for data components)
  source: z.string().optional(), // table name or API endpoint
  query: z.record(z.any()).optional(), // filters, sorting

  // Layout props
  columns: z.array(z.string()).optional(), // for table/grid
  children: z.array(ComponentSchema).optional(), // nested components

  // Styling
  className: z.string().optional(),
  style: z.record(z.string()).optional(),

  // Events
  onClick: z.string().optional(), // action reference
  onChange: z.string().optional(),
  onSubmit: z.string().optional(),

  // Component-specific props
  props: z.record(z.any()).optional(),
}));

export type Component = z.infer<typeof ComponentSchema>;

/**
 * UI page definition
 */
export const PageSchema = z.object({
  path: z.string().min(1).regex(/^\//, 'Must start with /'),
  title: z.string().min(1),
  description: z.string().optional(),

  // Layout
  layout: z.enum(['default', 'auth', 'dashboard', 'blank']).optional().default('default'),

  // Auth requirements
  auth: z.enum(['public', 'required', 'optional']).optional().default('required'),
  roles: z.array(z.string()).optional(), // required roles

  // Components
  components: z.array(ComponentSchema),

  // SEO
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

export type Page = z.infer<typeof PageSchema>;

/**
 * UI/Frontend definition
 */
export const UISchema = z.object({
  pages: z.array(PageSchema).min(1),
  theme: z.object({
    colors: z.record(z.string()).optional(),
    fonts: z.record(z.string()).optional(),
    spacing: z.record(z.string()).optional(),
  }).optional(),
  components: z.record(ComponentSchema).optional(), // reusable components
});

export type UI = z.infer<typeof UISchema>;

/**
 * HTTP methods for API endpoints
 */
export const HTTPMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export type HTTPMethod = z.infer<typeof HTTPMethodSchema>;

/**
 * API endpoint definition
 */
export const EndpointSchema = z.object({
  path: z.string().min(1).regex(/^\//, 'Must start with /'),
  method: HTTPMethodSchema,
  description: z.string().optional(),

  // Data source
  table: z.string().optional(), // for CRUD endpoints
  action: z.string().optional(), // custom action reference

  // Auth
  auth: z.enum(['public', 'required']).optional().default('required'),
  roles: z.array(z.string()).optional(),

  // Request/response
  request: z.object({
    params: z.record(z.string()).optional(), // path params
    query: z.record(z.string()).optional(), // query params
    body: z.record(z.any()).optional(), // request body schema
  }).optional(),

  response: z.record(z.any()).optional(), // response schema

  // Pagination
  paginated: z.boolean().optional().default(false),
});

export type Endpoint = z.infer<typeof EndpointSchema>;

/**
 * API definition
 */
export const APISchema = z.object({
  endpoints: z.array(EndpointSchema).min(1),
  basePath: z.string().optional().default('/api'),
  version: z.string().optional().default('v1'),

  // Rate limiting
  rateLimit: z.object({
    enabled: z.boolean().optional().default(true),
    requests: z.number().optional().default(100),
    window: z.string().optional().default('1m'), // 1m, 1h, 1d
  }).optional(),
});

export type API = z.infer<typeof APISchema>;

/**
 * Workflow/action definition
 */
export const WorkflowSchema = z.object({
  name: z.string().min(1).regex(/^[a-z_][a-z0-9_]*$/i),
  description: z.string().optional(),
  trigger: z.enum(['manual', 'schedule', 'webhook', 'database']),

  // Steps
  steps: z.array(z.object({
    name: z.string(),
    action: z.enum(['query', 'insert', 'update', 'delete', 'http', 'email', 'script']),
    config: z.record(z.any()),
  })),

  // Schedule (if trigger=schedule)
  schedule: z.string().optional(), // cron expression
});

export type Workflow = z.infer<typeof WorkflowSchema>;

/**
 * Auth configuration
 */
export const AuthSchema = z.object({
  providers: z.array(z.enum(['email', 'google', 'bankid', 'github', 'microsoft'])).min(1),

  // User model
  userFields: z.array(FieldSchema).optional(),

  // Roles
  roles: z.array(z.object({
    name: z.string(),
    permissions: z.array(z.string()),
  })).optional(),

  // Session
  sessionDuration: z.string().optional().default('7d'),
});

export type Auth = z.infer<typeof AuthSchema>;

/**
 * Connector configuration
 */
export const ConnectorSchema = z.object({
  type: z.string(), // 'bankid', 'fortnox', 'stripe', etc.
  config: z.record(z.any()),
  enabled: z.boolean().optional().default(true),
});

export type Connector = z.infer<typeof ConnectorSchema>;

/**
 * Complete Blueprint schema
 */
export const BlueprintSchema = z.object({
  // Metadata
  version: z.string().min(1).default('1.0'),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  author: z.string().optional(),

  // Core building blocks
  database: DatabaseSchema,
  ui: UISchema,
  api: APISchema,

  // Optional features
  workflows: z.array(WorkflowSchema).optional(),
  auth: AuthSchema.optional(),
  connectors: z.array(ConnectorSchema).optional(),

  // Deployment
  deploy: z.object({
    environment: z.enum(['development', 'staging', 'production']).optional().default('development'),
    region: z.enum(['eu-north-1', 'eu-central-1']).optional().default('eu-north-1'),
  }).optional(),

  // Metadata
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;

/**
 * Validation function
 */
export function validateBlueprint(data: unknown): { success: true; data: Blueprint } | { success: false; errors: z.ZodError } {
  const result = BlueprintSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Example Blueprint for reference
 */
export const exampleBlueprint: Blueprint = {
  version: '1.0',
  name: 'Simple CRM',
  description: 'Customer relationship management app',

  database: {
    tables: [
      {
        name: 'customers',
        description: 'Customer records',
        fields: [
          { name: 'id', type: 'uuid', primary: true },
          { name: 'name', type: 'string', required: true, maxLength: 200 },
          { name: 'email', type: 'email', required: true, unique: true },
          { name: 'phone', type: 'phone' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      },
    ],
  },

  ui: {
    pages: [
      {
        path: '/customers',
        title: 'Customers',
        components: [
          {
            type: 'table',
            source: 'customers',
            columns: ['name', 'email', 'phone', 'created_at'],
          },
        ],
      },
    ],
  },

  api: {
    endpoints: [
      {
        path: '/api/customers',
        method: 'GET',
        table: 'customers',
        paginated: true,
      },
      {
        path: '/api/customers',
        method: 'POST',
        table: 'customers',
        request: {
          body: {
            name: 'string',
            email: 'string',
            phone: 'string',
          },
        },
      },
    ],
  },
};
