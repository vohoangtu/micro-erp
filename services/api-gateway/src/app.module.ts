import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller.js';
import { AuthService } from './auth/auth.service.js';
import { CrmController } from './crm/crm.controller.js';
import { CrmService } from './crm/crm.service.js';
import { BookingController } from './booking/booking.controller.js';
import { BookingService } from './booking/booking.service.js';
import { PosController } from './pos/pos.controller.js';
import { PosService } from './pos/pos.service.js';
import { HrController } from './hr/hr.controller.js';
import { HrService } from './hr/hr.service.js';
import { AiCopilotController } from './ai/ai.controller.js';
import { AiCopilotService } from './ai/ai.service.js';
import { eventBus } from '@erp/event-bus';
import { EventChannels } from '@erp/shared-types';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super_secret_erp_jwt_key_2026_change_in_production',
      signOptions: { expiresIn: '7d' }
    })
  ],
  controllers: [
    AuthController,
    CrmController,
    BookingController,
    PosController,
    HrController,
    AiCopilotController
  ],
  providers: [
    AuthService,
    CrmService,
    BookingService,
    PosService,
    HrService,
    AiCopilotService
  ]
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    // Connect to NATS JetStream
    await eventBus.connect(process.env.NATS_URL);

    // Setup Cross-Domain Event Listeners
    // 1. When an Order is PAID -> Auto calculate loyalty points
    await eventBus.subscribe(EventChannels.ORDER_PAID, async (order: any) => {
      this.logger.log(`[Event: ORDER_PAID] Received order ${order.orderCode}. Customer: ${order.customerId || 'Guest'}`);
    });

    // 2. When a Booking is CREATED -> Notify staff
    await eventBus.subscribe(EventChannels.BOOKING_CREATED, async (booking: any) => {
      this.logger.log(`[Event: BOOKING_CREATED] Received booking ${booking.bookingCode} for service "${booking.serviceName}"`);
    });
  }
}
