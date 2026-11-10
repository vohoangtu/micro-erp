import { Injectable } from '@nestjs/common';
import { db, schema, eq, desc } from '@erp/database';
import { eventBus } from '@erp/event-bus';
import { EventChannels, CustomerTier } from '@erp/shared-types';

@Injectable()
export class CrmService {
  async getCustomers() {
    return db.select().from(schema.customers).orderBy(desc(schema.customers.createdAt)).limit(100);
  }

  async getCustomerById(id: string) {
    const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.id, id)).limit(1);
    return customer || null;
  }

  async createCustomer(data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    notes?: string;
  }) {
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
    }

    const [newCustomer] = await db
      .insert(schema.customers)
      .values({
        tenantId: tenant.id,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        tier: CustomerTier.STANDARD,
        loyaltyPoints: 0,
        notes: data.notes || null
      })
      .returning();

    // Broadcast Event via NATS JetStream
    await eventBus.publish(EventChannels.CUSTOMER_REGISTERED, newCustomer);

    return newCustomer;
  }

  async addPoints(customerId: string, points: number) {
    const customer = await this.getCustomerById(customerId);
    if (!customer) return null;

    const newPoints = customer.loyaltyPoints + points;
    let newTier = customer.tier;
    if (newPoints >= 1000) newTier = CustomerTier.DIAMOND;
    else if (newPoints >= 500) newTier = CustomerTier.PLATINUM;
    else if (newPoints >= 200) newTier = CustomerTier.GOLD;
    else if (newPoints >= 50) newTier = CustomerTier.SILVER;

    const [updated] = await db
      .update(schema.customers)
      .set({ loyaltyPoints: newPoints, tier: newTier, updatedAt: new Date() })
      .where(eq(schema.customers.id, customerId))
      .returning();

    await eventBus.publish(EventChannels.CUSTOMER_POINTS_UPDATED, updated);
    return updated;
  }
}
