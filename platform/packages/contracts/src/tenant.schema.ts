/**
 * Tenant schema - Multi-tenant organization management
 *
 * A tenant represents an organization/customer using the platform.
 * All data is scoped to tenants for isolation.
 */

import { z } from 'zod';

/**
 * Tenant status
 */
export const TenantStatusSchema = z.enum([
  'active',
  'trial',
  'suspended',
  'cancelled',
  'deleted',
]);

export type TenantStatus = z.infer<typeof TenantStatusSchema>;

/**
 * Subscription plan
 */
export const SubscriptionPlanSchema = z.enum([
  'free',
  'starter',
  'professional',
  'enterprise',
  'custom',
]);

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

/**
 * Tenant settings
 */
export const TenantSettingsSchema = z.object({
  // Branding
  logo: z.string().url().optional(),
  primaryColor: z.string().optional(),
  customDomain: z.string().optional(),

  // Features
  enabledFeatures: z.array(z.string()).optional(),
  maxUsers: z.number().optional(),
  maxBlueprints: z.number().optional(),
  maxStorageGB: z.number().optional(),

  // Security
  requireMfa: z.boolean().default(false),
  allowedAuthProviders: z.array(z.string()).optional(),
  ipWhitelist: z.array(z.string()).optional(),
  sessionTimeout: z.number().optional().default(3600), // seconds

  // Data residency
  region: z.enum(['eu-north-1', 'eu-central-1']).default('eu-north-1'),
  dataRetentionDays: z.number().optional().default(365),

  // GDPR
  gdprSettings: z.object({
    dpaAccepted: z.boolean().default(false),
    dpaAcceptedAt: z.string().datetime().optional(),
    dpaVersion: z.string().optional(),
    dataProcessingPurpose: z.string().optional(),
    autoDeleteAfterDays: z.number().optional(),
  }).optional(),
});

export type TenantSettings = z.infer<typeof TenantSettingsSchema>;

/**
 * Tenant billing information
 */
export const TenantBillingSchema = z.object({
  plan: SubscriptionPlanSchema,
  billingEmail: z.string().email(),

  // Subscription
  subscriptionStart: z.string().datetime(),
  subscriptionEnd: z.string().datetime().optional(),
  trialEnd: z.string().datetime().optional(),
  cancelAt: z.string().datetime().optional(),

  // Payment
  paymentMethod: z.enum(['card', 'invoice', 'wire']).optional(),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),

  // Swedish/EU specific
  orgNumber: z.string().optional(), // Organisationsnummer
  vatNumber: z.string().optional(), // VAT/moms number
  country: z.string().default('SE'),

  // Billing address
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
});

export type TenantBilling = z.infer<typeof TenantBillingSchema>;

/**
 * Tenant usage metrics
 */
export const TenantUsageSchema = z.object({
  // Current period
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),

  // Usage counters
  apiRequests: z.number().default(0),
  storageUsedGB: z.number().default(0),
  buildMinutes: z.number().default(0),
  activeUsers: z.number().default(0),
  deploymentsCount: z.number().default(0),

  // Costs (EUR)
  estimatedCostEUR: z.number().default(0),

  // Limits
  apiRequestsLimit: z.number().optional(),
  storageGBLimit: z.number().optional(),
  buildMinutesLimit: z.number().optional(),
});

export type TenantUsage = z.infer<typeof TenantUsageSchema>;

/**
 * Complete Tenant schema
 */
export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional(),

  // Owner
  ownerId: z.string().uuid(),

  // Status
  status: TenantStatusSchema,

  // Settings
  settings: TenantSettingsSchema,

  // Billing
  billing: TenantBillingSchema,

  // Usage
  usage: TenantUsageSchema.optional(),

  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Compliance
  lastAuditAt: z.string().datetime().optional(),
  dpiaCompleted: z.boolean().default(false),
  dpiaCompletedAt: z.string().datetime().optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

/**
 * Create tenant request
 */
export const CreateTenantRequestSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  plan: SubscriptionPlanSchema.default('free'),
  billingEmail: z.string().email(),
  orgNumber: z.string().optional(),
  country: z.string().default('SE'),
});

export type CreateTenantRequest = z.infer<typeof CreateTenantRequestSchema>;

/**
 * Update tenant request
 */
export const UpdateTenantRequestSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  settings: TenantSettingsSchema.partial().optional(),
  status: TenantStatusSchema.optional(),
});

export type UpdateTenantRequest = z.infer<typeof UpdateTenantRequestSchema>;

/**
 * Tenant member schema (user-tenant relationship)
 */
export const TenantMemberSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string(), // References UserRoleSchema
  joinedAt: z.string().datetime(),
  invitedBy: z.string().uuid().optional(),
  status: z.enum(['active', 'invited', 'suspended']),
});

export type TenantMember = z.infer<typeof TenantMemberSchema>;

/**
 * Tenant invite schema
 */
export const TenantInviteSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email(),
  role: z.string(),
  invitedBy: z.string().uuid(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  acceptedAt: z.string().datetime().optional(),
  token: z.string(),
});

export type TenantInvite = z.infer<typeof TenantInviteSchema>;

/**
 * Tenant audit log entry
 */
export const TenantAuditLogSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),

  // Who
  userId: z.string().uuid(),
  userEmail: z.string().email(),

  // What
  action: z.string(), // e.g., 'blueprint.created', 'user.invited'
  resource: z.string(), // e.g., 'blueprint', 'user'
  resourceId: z.string().optional(),

  // When
  timestamp: z.string().datetime(),

  // Where
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  location: z.string().optional(), // Geo location

  // Why/How
  metadata: z.record(z.any()).optional(),

  // Compliance
  gdprLawfulBasis: z.string().optional(), // GDPR lawful basis for processing
});

export type TenantAuditLog = z.infer<typeof TenantAuditLogSchema>;

/**
 * DPIA (Data Protection Impact Assessment) schema
 */
export const DPIASchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  blueprintId: z.string().uuid().optional(), // If DPIA is for specific blueprint

  // Assessment
  dataTypes: z.array(z.string()), // e.g., ['personal_data', 'financial_data']
  processingPurpose: z.string(),
  legalBasis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),

  // Risks
  riskLevel: z.enum(['low', 'medium', 'high', 'very_high']),
  risks: z.array(z.object({
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    mitigation: z.string(),
  })),

  // Compliance
  dataMinimizationApplied: z.boolean(),
  purposeLimitationApplied: z.boolean(),
  retentionPeriod: z.string(),
  dataSubjectRights: z.array(z.string()), // e.g., ['access', 'rectification', 'erasure']

  // Approval
  completedBy: z.string().uuid(),
  completedAt: z.string().datetime(),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  status: z.enum(['draft', 'pending_approval', 'approved', 'rejected']),
});

export type DPIA = z.infer<typeof DPIASchema>;

/**
 * Example tenant for testing
 */
export const exampleTenant: Tenant = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Acme Corp',
  slug: 'acme-corp',
  description: 'Enterprise customer building internal tools',
  ownerId: '00000000-0000-0000-0000-000000000002',
  status: 'active',
  settings: {
    region: 'eu-north-1',
    requireMfa: true,
    maxUsers: 50,
    maxBlueprints: 100,
    maxStorageGB: 500,
    dataRetentionDays: 365,
    gdprSettings: {
      dpaAccepted: true,
      dpaAcceptedAt: '2025-11-08T00:00:00Z',
      dpaVersion: '1.0',
      dataProcessingPurpose: 'Internal business operations',
    },
  },
  billing: {
    plan: 'enterprise',
    billingEmail: 'billing@acme.com',
    subscriptionStart: '2025-11-01T00:00:00Z',
    billingCycle: 'yearly',
    orgNumber: '556789-0123',
    country: 'SE',
  },
  createdAt: '2025-11-01T00:00:00Z',
  updatedAt: '2025-11-08T00:00:00Z',
  dpiaCompleted: true,
  dpiaCompletedAt: '2025-11-05T00:00:00Z',
};
