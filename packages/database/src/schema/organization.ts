import { pgTable, uuid, varchar, text, timestamp, integer, numeric, boolean } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const branches = pgTable('branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  managerName: varchar('manager_name', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const divisions = pgTable('divisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  shortName: varchar('short_name', { length: 100 }),
  leaderName: varchar('leader_name', { length: 255 }),
  description: text('description'),
  color: varchar('color', { length: 50 }).default('#0ea5e9'),
  orderIndex: integer('order_index').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'set null' }),
  divisionId: uuid('division_id').references(() => divisions.id, { onDelete: 'set null' }),
  parentId: uuid('parent_id'),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  managerName: varchar('manager_name', { length: 255 }),
  orderIndex: integer('order_index').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const jobPosts = pgTable('job_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  level: integer('level').default(5).notNull(), // 1: BOD, 2: Branch Dir, 3: Dept Head, 4: Team Leader, 5: Staff
  allowanceRate: numeric('allowance_rate', { precision: 14, scale: 2 }).default('0').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const jobTitles = pgTable('job_titles', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  field: varchar('field', { length: 100 }).notNull(), // e.g. 'Dermatology', 'Laser & Tech', 'Consulting', 'Cashier', 'Pharmacy'
  standardRequirements: text('standard_requirements'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const jobPositions = pgTable('job_positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  postId: uuid('post_id').references(() => jobPosts.id, { onDelete: 'set null' }),
  titleId: uuid('title_id').references(() => jobTitles.id, { onDelete: 'set null' }),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  headcountQuota: integer('headcount_quota').default(1).notNull(),
  currentHeadcount: integer('current_headcount').default(0).notNull(),
  minSalary: numeric('min_salary', { precision: 14, scale: 2 }).default('0').notNull(),
  maxSalary: numeric('max_salary', { precision: 14, scale: 2 }).default('0').notNull(),
  jdDescription: text('jd_description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const employmentTypes = pgTable('employment_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(), // Full-time, Part-time, Probation, Seasonal, Contractor, Intern
  workHoursPerWeek: integer('work_hours_per_week').default(44).notNull(),
  hasInsurance: boolean('has_insurance').default(true).notNull(),
  standardAnnualLeave: integer('standard_annual_leave').default(12).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
