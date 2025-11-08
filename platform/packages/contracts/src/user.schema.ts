/**
 * User schema - User accounts and authentication
 */

import { z } from 'zod';

/**
 * User role enum
 */
export const UserRoleSchema = z.enum([
  'owner',       // Tenant owner (full control)
  'admin',       // Tenant admin
  'developer',   // Can create/edit blueprints
  'editor',      // Can edit data
  'viewer',      // Read-only access
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * User status
 */
export const UserStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending_verification',
]);

export type UserStatus = z.infer<typeof UserStatusSchema>;

/**
 * Auth provider
 */
export const AuthProviderSchema = z.enum([
  'email',
  'google',
  'github',
  'microsoft',
  'bankid',
]);

export type AuthProvider = z.infer<typeof AuthProviderSchema>;

/**
 * User profile schema
 */
export const UserProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  displayName: z.string().min(1).max(200).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  timezone: z.string().optional().default('Europe/Stockholm'),
  locale: z.string().optional().default('sv-SE'),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * User preferences
 */
export const UserPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional().default(true),
  smsNotifications: z.boolean().optional().default(false),
  marketingEmails: z.boolean().optional().default(false),
  theme: z.enum(['light', 'dark', 'auto']).optional().default('auto'),
  language: z.enum(['sv', 'en']).optional().default('sv'),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

/**
 * Complete User schema
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),

  // Auth
  authProvider: AuthProviderSchema,
  authProviderId: z.string().optional(), // External provider ID

  // Profile
  profile: UserProfileSchema,
  preferences: UserPreferencesSchema.optional(),

  // Status
  status: UserStatusSchema.default('pending_verification'),
  role: UserRoleSchema.default('viewer'),

  // Multi-tenant
  tenantId: z.string().uuid(), // Primary tenant
  tenants: z.array(z.object({
    tenantId: z.string().uuid(),
    role: UserRoleSchema,
    joinedAt: z.string().datetime(),
  })).optional(), // All tenants user belongs to

  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),

  // Security
  mfaEnabled: z.boolean().default(false),
  mfaMethod: z.enum(['totp', 'sms', 'email']).optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Create user request
 */
export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100).optional(), // Optional if using OAuth
  authProvider: AuthProviderSchema.default('email'),
  profile: UserProfileSchema,
  tenantId: z.string().uuid().optional(), // If joining existing tenant
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

/**
 * Update user request
 */
export const UpdateUserRequestSchema = z.object({
  profile: UserProfileSchema.partial().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
  status: UserStatusSchema.optional(),
  role: UserRoleSchema.optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

/**
 * Login request
 */
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mfaCode: z.string().optional(), // If MFA enabled
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * Login response
 */
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(), // seconds
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Session schema
 */
export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

/**
 * Permission schema
 */
export const PermissionSchema = z.object({
  resource: z.string(), // e.g., 'blueprint', 'connector', 'user'
  action: z.enum(['create', 'read', 'update', 'delete', 'execute']),
  conditions: z.record(z.any()).optional(), // ABAC conditions
});

export type Permission = z.infer<typeof PermissionSchema>;

/**
 * Role definition (for RBAC)
 */
export const RoleDefinitionSchema = z.object({
  name: UserRoleSchema,
  description: z.string(),
  permissions: z.array(PermissionSchema),
  isSystem: z.boolean().default(false), // System roles can't be deleted
});

export type RoleDefinition = z.infer<typeof RoleDefinitionSchema>;

/**
 * Example role definitions
 */
export const defaultRoles: RoleDefinition[] = [
  {
    name: 'owner',
    description: 'Tenant owner with full control',
    permissions: [
      { resource: '*', action: 'create' },
      { resource: '*', action: 'read' },
      { resource: '*', action: 'update' },
      { resource: '*', action: 'delete' },
      { resource: '*', action: 'execute' },
    ],
    isSystem: true,
  },
  {
    name: 'admin',
    description: 'Tenant administrator',
    permissions: [
      { resource: 'blueprint', action: 'create' },
      { resource: 'blueprint', action: 'read' },
      { resource: 'blueprint', action: 'update' },
      { resource: 'blueprint', action: 'delete' },
      { resource: 'connector', action: 'create' },
      { resource: 'connector', action: 'read' },
      { resource: 'user', action: 'read' },
      { resource: 'user', action: 'update' },
    ],
    isSystem: true,
  },
  {
    name: 'developer',
    description: 'Can create and edit blueprints',
    permissions: [
      { resource: 'blueprint', action: 'create' },
      { resource: 'blueprint', action: 'read' },
      { resource: 'blueprint', action: 'update' },
      { resource: 'connector', action: 'read' },
    ],
    isSystem: true,
  },
  {
    name: 'editor',
    description: 'Can edit data but not blueprints',
    permissions: [
      { resource: 'data', action: 'create' },
      { resource: 'data', action: 'read' },
      { resource: 'data', action: 'update' },
      { resource: 'blueprint', action: 'read' },
    ],
    isSystem: true,
  },
  {
    name: 'viewer',
    description: 'Read-only access',
    permissions: [
      { resource: 'blueprint', action: 'read' },
      { resource: 'data', action: 'read' },
    ],
    isSystem: true,
  },
];
