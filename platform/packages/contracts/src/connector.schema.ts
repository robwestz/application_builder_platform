/**
 * Connector schema - Integration contracts for Swedish/EU connectors
 *
 * Defines the contract for all connectors (BankID, Fortnox, Stripe, etc.)
 */

import { z } from 'zod';

/**
 * Connector type enum
 */
export const ConnectorTypeSchema = z.enum([
  // Swedish/Nordic
  'bankid',
  'fortnox',
  'visma',
  'swish',
  'klarna',

  // International payments
  'stripe',
  'paypal',

  // E-sign
  'scrive',
  'assently',

  // Communication
  'email',
  'sms',
  'slack',

  // Storage/Docs
  'google_drive',
  'google_sheets',
  'notion',
  'dropbox',

  // Other
  'custom',
]);

export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;

/**
 * Connector status
 */
export const ConnectorStatusSchema = z.enum([
  'active',
  'inactive',
  'error',
  'pending_setup',
  'deprecated',
]);

export type ConnectorStatus = z.infer<typeof ConnectorStatusSchema>;

/**
 * Connector category
 */
export const ConnectorCategorySchema = z.enum([
  'authentication',
  'payments',
  'accounting',
  'e_sign',
  'communication',
  'storage',
  'crm',
  'other',
]);

export type ConnectorCategory = z.infer<typeof ConnectorCategorySchema>;

/**
 * Connector authentication method
 */
export const ConnectorAuthMethodSchema = z.enum([
  'api_key',
  'oauth2',
  'basic_auth',
  'bearer_token',
  'custom',
]);

export type ConnectorAuthMethod = z.infer<typeof ConnectorAuthMethodSchema>;

/**
 * Connector credential schema (encrypted in DB)
 */
export const ConnectorCredentialSchema = z.object({
  method: ConnectorAuthMethodSchema,

  // API Key
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),

  // OAuth2
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().datetime().optional(),

  // Basic Auth
  username: z.string().optional(),
  password: z.string().optional(),

  // Custom fields
  customFields: z.record(z.string()).optional(),
});

export type ConnectorCredential = z.infer<typeof ConnectorCredentialSchema>;

/**
 * Connector action schema
 */
export const ConnectorActionSchema = z.object({
  id: z.string(), // e.g., 'bankid.authenticate', 'stripe.create_payment'
  name: z.string(),
  description: z.string(),

  // Input parameters
  input: z.record(z.any()), // JSON Schema for input

  // Output schema
  output: z.record(z.any()), // JSON Schema for output

  // Rate limiting
  rateLimit: z.object({
    requests: z.number(),
    window: z.string(), // e.g., '1m', '1h'
  }).optional(),
});

export type ConnectorAction = z.infer<typeof ConnectorActionSchema>;

/**
 * Connector webhook schema
 */
export const ConnectorWebhookSchema = z.object({
  id: z.string(),
  event: z.string(), // e.g., 'payment.succeeded', 'signature.completed'
  payload: z.record(z.any()),

  // Verification
  signature: z.string().optional(),
  verified: z.boolean(),

  // Metadata
  receivedAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
  retryCount: z.number().default(0),
});

export type ConnectorWebhook = z.infer<typeof ConnectorWebhookSchema>;

/**
 * Connector definition (metadata about a connector type)
 */
export const ConnectorDefinitionSchema = z.object({
  type: ConnectorTypeSchema,
  name: z.string(),
  description: z.string(),
  category: ConnectorCategorySchema,

  // Provider info
  provider: z.object({
    name: z.string(),
    website: z.string().url(),
    supportEmail: z.string().email().optional(),
    documentation: z.string().url().optional(),
  }),

  // Auth
  authMethod: ConnectorAuthMethodSchema,
  setupInstructions: z.string(), // Markdown

  // Capabilities
  actions: z.array(ConnectorActionSchema),
  supportsWebhooks: z.boolean(),
  webhookEvents: z.array(z.string()).optional(),

  // Compliance
  gdprCompliant: z.boolean(),
  tosUrl: z.string().url(),
  privacyUrl: z.string().url(),
  euHosted: z.boolean(),

  // Availability
  regions: z.array(z.string()), // e.g., ['SE', 'NO', 'DK', 'FI', 'EU', 'global']
  status: ConnectorStatusSchema,

  // Pricing
  pricing: z.object({
    model: z.enum(['free', 'usage', 'subscription', 'enterprise']),
    description: z.string().optional(),
  }).optional(),

  // Versioning
  version: z.string(),
  changelog: z.string().optional(),

  // Security
  securityReview: z.object({
    reviewedAt: z.string().datetime(),
    reviewedBy: z.string(),
    findings: z.array(z.string()),
    approved: z.boolean(),
  }).optional(),
});

export type ConnectorDefinition = z.infer<typeof ConnectorDefinitionSchema>;

/**
 * Connector instance (tenant-specific installation)
 */
export const ConnectorInstanceSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: ConnectorTypeSchema,
  name: z.string(), // User-friendly name
  description: z.string().optional(),

  // Configuration
  credentials: ConnectorCredentialSchema, // Encrypted
  config: z.record(z.any()).optional(), // Connector-specific config

  // Status
  status: ConnectorStatusSchema,
  lastUsedAt: z.string().datetime().optional(),
  lastErrorAt: z.string().datetime().optional(),
  lastError: z.string().optional(),

  // Usage tracking
  usageCount: z.number().default(0),
  quotaLimit: z.number().optional(),

  // Audit
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // GDPR
  dataProcessingPurpose: z.string().optional(),
  dpiaRequired: z.boolean().optional(),
});

export type ConnectorInstance = z.infer<typeof ConnectorInstanceSchema>;

/**
 * Connector execution log
 */
export const ConnectorExecutionLogSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  connectorInstanceId: z.string().uuid(),
  actionId: z.string(),

  // Execution
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  duration: z.number().optional(), // milliseconds
  status: z.enum(['pending', 'running', 'success', 'error', 'timeout']),

  // Input/output
  input: z.record(z.any()),
  output: z.record(z.any()).optional(),
  error: z.string().optional(),

  // Audit
  triggeredBy: z.string().uuid(),
  ipAddress: z.string().optional(),

  // Cost tracking
  costEUR: z.number().optional(),
});

export type ConnectorExecutionLog = z.infer<typeof ConnectorExecutionLogSchema>;

/**
 * BankID-specific schemas (Swedish e-ID)
 */
export const BankIDAuthRequestSchema = z.object({
  personalNumber: z.string().regex(/^\d{12}$/, 'Must be 12 digits').optional(), // YYYYMMDDXXXX
  endUserIp: z.string(),
  requirement: z.object({
    allowFingerprint: z.boolean().optional(),
    certificatePolicies: z.array(z.string()).optional(),
  }).optional(),
});

export type BankIDAuthRequest = z.infer<typeof BankIDAuthRequestSchema>;

export const BankIDAuthResponseSchema = z.object({
  orderRef: z.string(),
  autoStartToken: z.string(),
  qrStartToken: z.string(),
  qrStartSecret: z.string(),
});

export type BankIDAuthResponse = z.infer<typeof BankIDAuthResponseSchema>;

/**
 * Stripe payment schemas
 */
export const StripePaymentIntentSchema = z.object({
  amount: z.number().positive(), // Amount in öre/cents
  currency: z.string().default('SEK'),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethod: z.string().optional(),
  customer: z.string().optional(),
});

export type StripePaymentIntent = z.infer<typeof StripePaymentIntentSchema>;

/**
 * Fortnox invoice schemas (Swedish accounting)
 */
export const FortnoxInvoiceSchema = z.object({
  CustomerNumber: z.string(),
  InvoiceDate: z.string(), // YYYY-MM-DD
  DueDate: z.string(),
  InvoiceRows: z.array(z.object({
    ArticleNumber: z.string().optional(),
    Description: z.string(),
    Quantity: z.number(),
    Price: z.number(),
    VAT: z.number().optional().default(25), // Swedish moms
  })),
  Currency: z.string().default('SEK'),
  Language: z.string().default('SV'),
});

export type FortnoxInvoice = z.infer<typeof FortnoxInvoiceSchema>;

/**
 * Example connector definitions
 */
export const exampleConnectorDefinitions: ConnectorDefinition[] = [
  {
    type: 'bankid',
    name: 'BankID',
    description: 'Swedish electronic identification (e-legitimation)',
    category: 'authentication',
    provider: {
      name: 'Finansiell ID-Teknik BID AB',
      website: 'https://www.bankid.com',
      documentation: 'https://www.bankid.com/utvecklare/guider',
    },
    authMethod: 'custom',
    setupInstructions: '# BankID Setup\n\n1. Register at bankid.com\n2. Obtain client certificate\n3. Configure production/test environment',
    actions: [
      {
        id: 'bankid.authenticate',
        name: 'Authenticate User',
        description: 'Authenticate user with BankID',
        input: { personalNumber: 'string?', endUserIp: 'string' },
        output: { orderRef: 'string', autoStartToken: 'string' },
      },
      {
        id: 'bankid.sign',
        name: 'Sign Document',
        description: 'Sign document with BankID',
        input: { userVisibleData: 'string', personalNumber: 'string?' },
        output: { orderRef: 'string', autoStartToken: 'string' },
      },
    ],
    supportsWebhooks: false,
    gdprCompliant: true,
    tosUrl: 'https://www.bankid.com/anvandningsvillkor',
    privacyUrl: 'https://www.bankid.com/integritetspolicy',
    euHosted: true,
    regions: ['SE', 'EU'],
    status: 'active',
    version: '6.0',
  },
  {
    type: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing platform',
    category: 'payments',
    provider: {
      name: 'Stripe, Inc.',
      website: 'https://stripe.com',
      documentation: 'https://stripe.com/docs',
      supportEmail: 'support@stripe.com',
    },
    authMethod: 'api_key',
    setupInstructions: '# Stripe Setup\n\n1. Create account at stripe.com\n2. Get API keys from dashboard\n3. Configure webhooks',
    actions: [
      {
        id: 'stripe.create_payment_intent',
        name: 'Create Payment Intent',
        description: 'Create a new payment intent',
        input: { amount: 'number', currency: 'string', description: 'string?' },
        output: { id: 'string', client_secret: 'string' },
      },
      {
        id: 'stripe.create_customer',
        name: 'Create Customer',
        description: 'Create a new customer',
        input: { email: 'string', name: 'string?' },
        output: { id: 'string' },
      },
    ],
    supportsWebhooks: true,
    webhookEvents: ['payment_intent.succeeded', 'payment_intent.failed', 'customer.created'],
    gdprCompliant: true,
    tosUrl: 'https://stripe.com/terms',
    privacyUrl: 'https://stripe.com/privacy',
    euHosted: false,
    regions: ['global'],
    status: 'active',
    pricing: {
      model: 'usage',
      description: '1.4% + 1.80 SEK per transaction (EU cards)',
    },
    version: '2023-10-16',
  },
];
