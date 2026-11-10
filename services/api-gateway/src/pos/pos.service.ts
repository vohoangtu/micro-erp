import { Injectable } from '@nestjs/common';
import { db, schema, eq, desc } from '@erp/database';
import { eventBus } from '@erp/event-bus';
import { EventChannels, OrderStatus, PaymentMethod } from '@erp/shared-types';

@Injectable()
export class PosService {
  async getProducts() {
    let prods = await db.select().from(schema.products).limit(100);
    if (prods.length === 0) {
      // Seed sample products
      let [tenant] = await db.select().from(schema.tenants).limit(1);
      if (!tenant) {
        [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
      }
      prods = await db
        .insert(schema.products)
        .values([
          {
            tenantId: tenant.id,
            sku: 'SRV-FACIAL-01',
            name: 'Gói Chăm Sóc Da Mặt Cao Cấp',
            category: 'Dịch vụ Spa',
            unitPrice: '450000',
            stockQuantity: 999
          },
          {
            tenantId: tenant.id,
            sku: 'PRD-SERUM-02',
            name: 'Serum Phục Hồi Dưỡng Ẩm B5',
            category: 'Mỹ phẩm',
            unitPrice: '620000',
            stockQuantity: 50
          },
          {
            tenantId: tenant.id,
            sku: 'SRV-MASSAGE-03',
            name: 'Massage Body Đá Nóng 90 phút',
            category: 'Dịch vụ Trị Liệu',
            unitPrice: '550000',
            stockQuantity: 999
          }
        ])
        .returning();
    }
    return prods;
  }

  async getOrders() {
    return db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(100);
  }

  async createOrder(data: {
    customerId?: string;
    customerName?: string;
    cashierId: string;
    items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
    discount?: number;
    paymentMethod?: PaymentMethod;
  }) {
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
    }

    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const discount = data.discount || 0;
    const totalAmount = Math.max(0, subtotal - discount);
    const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const [order] = await db
      .insert(schema.orders)
      .values({
        tenantId: tenant.id,
        orderCode,
        customerId: data.customerId || null,
        customerName: data.customerName || null,
        cashierId: data.cashierId,
        subtotal: subtotal.toString(),
        discount: discount.toString(),
        totalAmount: totalAmount.toString(),
        status: OrderStatus.PAID,
        paymentMethod: data.paymentMethod || PaymentMethod.CASH,
        items: data.items
      })
      .returning();

    // Broadcast ORDER_PAID event
    // Event listener will automatically:
    // 1. Add loyalty points to customer (1 point per 100,000 VND)
    // 2. Trigger employee commission calculation
    await eventBus.publish(EventChannels.ORDER_PAID, {
      ...order,
      calculatedPoints: Math.floor(totalAmount / 100000)
    });

    return order;
  }
}
