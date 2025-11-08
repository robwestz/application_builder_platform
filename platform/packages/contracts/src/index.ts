/**
 * @appkod/contracts - Shared contracts, types, and schemas
 *
 * This package contains all shared TypeScript types and Zod schemas
 * used across the Appkod platform (web, api, cli, runner, connectors).
 *
 * Key exports:
 * - Blueprint schemas (DSL for app definitions)
 * - User/Tenant schemas
 * - Connector contract interfaces
 * - API request/response types
 */

export const VERSION = '0.0.1';

// Blueprint DSL (T0.4 complete)
export * from './blueprint.schema';

// Core domain schemas (T0.6 complete)
export * from './user.schema';
export * from './tenant.schema';
export * from './connector.schema';
