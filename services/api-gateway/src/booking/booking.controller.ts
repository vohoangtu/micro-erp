import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service.js';
import { BookingStatus } from '@erp/shared-types';

@ApiTags('Booking & Scheduling')
@Controller('api/v1/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch hẹn đặt trước' })
  async getBookings() {
    return this.bookingService.getBookings();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo lịch hẹn mới' })
  async createBooking(
    @Body()
    body: {
      customerId: string;
      customerName: string;
      customerPhone: string;
      serviceName: string;
      appointmentTime: string;
      durationMinutes?: number;
      price?: number;
      notes?: string;
    }
  ) {
    return this.bookingService.createBooking(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch hẹn' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: BookingStatus }) {
    return this.bookingService.updateStatus(id, body.status);
  }
}
