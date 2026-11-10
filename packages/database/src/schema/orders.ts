import { pgTable, uuid, varchar, timestamp, integer, numeric, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { customers } from './customers.js';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  orderCode: varchar('order_code', { length: 50 }).notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id),
  customerName: varchar('customer_name', { length: 255 }),
  cashierId: uuid('cashier_id').notNull(),
  subtotal: numeric('subtotal', { precision: 14, scale: 2 }).notNull(),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0').notNull(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('PAID').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).default('CASH').notNull(),
  items: jsonb('items').notNull(), // list of purchased items
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
