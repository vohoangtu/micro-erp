import { Injectable } from '@nestjs/common';
import { db, schema, eq, desc } from '@erp/database';
import { eventBus } from '@erp/event-bus';
import { EventChannels, BookingStatus } from '@erp/shared-types';

@Injectable()
export class BookingService {
  async getBookings() {
    return db.select().from(schema.bookings).orderBy(desc(schema.bookings.appointmentTime)).limit(100);
  }

  async createBooking(data: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    appointmentTime: string;
    durationMinutes?: number;
    price?: number;
    notes?: string;
  }) {
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
    }

    const bookingCode = `BK-${Date.now().toString(36).toUpperCase()}`;

    const [booking] = await db
      .insert(schema.bookings)
      .values({
        tenantId: tenant.id,
        bookingCode,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        serviceName: data.serviceName,
        appointmentTime: new Date(data.appointmentTime),
        durationMinutes: data.durationMinutes || 60,
        status: BookingStatus.PENDING,
        price: (data.price || 0).toString(),
        notes: data.notes || null
      })
      .returning();

    // Broadcast Booking Event
    await eventBus.publish(EventChannels.BOOKING_CREATED, booking);

    return booking;
  }

  async updateStatus(id: string, status: BookingStatus) {
    const [updated] = await db
      .update(schema.bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.bookings.id, id))
      .returning();

    await eventBus.publish(EventChannels.BOOKING_STATUS_CHANGED, updated);
    return updated;
  }
}
