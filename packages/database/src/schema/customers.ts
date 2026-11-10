import { pgTable, uuid, varchar, timestamp, integer, numeric, text } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  phoneNumber: varchar('phone_number', { length: 30 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  tier: varchar('tier', { length: 50 }).default('STANDARD').notNull(),
  loyaltyPoints: integer('loyalty_points').default(0).notNull(),
  totalSpent: numeric('total_spent', { precision: 14, scale: 2 }).default('0').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
