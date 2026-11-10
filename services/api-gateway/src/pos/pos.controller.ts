import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PosService } from './pos.service.js';
import { PaymentMethod } from '@erp/shared-types';

@ApiTags('POS & Inventory')
@Controller('api/v1/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('products')
  @ApiOperation({ summary: 'Lấy danh mục sản phẩm & dịch vụ tại quầy POS' })
  async getProducts() {
    return this.posService.getProducts();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Lịch sử đơn hàng bán lẻ' })
  async getOrders() {
    return this.posService.getOrders();
  }

  @Post('orders')
  @ApiOperation({ summary: 'Tạo đơn hàng thanh toán tại điểm bán POS' })
  async createOrder(
    @Body()
    body: {
      customerId?: string;
      customerName?: string;
      cashierId: string;
      items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
      discount?: number;
      paymentMethod?: PaymentMethod;
    }
  ) {
    return this.posService.createOrder(body);
  }
}
