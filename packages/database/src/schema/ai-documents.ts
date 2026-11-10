import { customType, pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const pgvector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)'; // 1536-dim embeddings for OpenAI / Gemini
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  }
});

export const aiDocuments = pgTable('ai_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).default('BUSINESS_KNOWLEDGE').notNull(),
  embedding: pgvector('embedding'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
