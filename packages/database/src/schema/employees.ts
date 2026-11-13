import { pgTable, uuid, varchar, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { branches, divisions, departments, jobPositions } from './organization.js';

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'set null' }),
  divisionId: uuid('division_id').references(() => divisions.id, { onDelete: 'set null' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  jobPositionId: uuid('job_position_id').references(() => jobPositions.id, { onDelete: 'set null' }),
  employeeCode: varchar('employee_code', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  workEmail: varchar('work_email', { length: 255 }),
  personalEmail: varchar('personal_email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 30 }).notNull(),
  citizenId: varchar('citizen_id', { length: 50 }),
  department: varchar('department', { length: 100 }).notNull(),
  baseSalary: numeric('base_salary', { precision: 14, scale: 2 }).default('0').notNull(),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 4 }).default('0.05').notNull(), // e.g. 0.0500 for 5%
  status: varchar('status', { length: 50 }).default('ACTIVE').notNull(), // ACTIVE, PROBATION, ON_LEAVE, TERMINATED
  joinDate: timestamp('join_date', { withTimezone: true }),
  avatarUrl: text('avatar_url'),
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
