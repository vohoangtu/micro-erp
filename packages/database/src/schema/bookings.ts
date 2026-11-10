import { pgTable, uuid, varchar, timestamp, integer, numeric, text } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { customers } from './customers.js';

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  bookingCode: varchar('booking_code', { length: 50 }).notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 30 }).notNull(),
  employeeId: uuid('employee_id'),
  serviceName: varchar('service_name', { length: 255 }).notNull(),
  appointmentTime: timestamp('appointment_time', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').default(60).notNull(),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).default('0').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
