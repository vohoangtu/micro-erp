import { pgTable, uuid, varchar, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  employeeCode: varchar('employee_code', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 30 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  baseSalary: numeric('base_salary', { precision: 14, scale: 2 }).default('0').notNull(),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 4 }).default('0.05').notNull(), // e.g. 0.0500 for 5%
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const payrollEntries = pgTable('payroll_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  monthPeriod: varchar('month_period', { length: 7 }).notNull(), // e.g. '2026-11'
  baseAmount: numeric('base_amount', { precision: 14, scale: 2 }).notNull(),
  commissionAmount: numeric('commission_amount', { precision: 14, scale: 2 }).default('0').notNull(),
  bonusAmount: numeric('bonus_amount', { precision: 14, scale: 2 }).default('0').notNull(),
  deductionAmount: numeric('deduction_amount', { precision: 14, scale: 2 }).default('0').notNull(),
  netAmount: numeric('net_amount', { precision: 14, scale: 2 }).notNull(),
  isPaid: boolean('is_paid').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
