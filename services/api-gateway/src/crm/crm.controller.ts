import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrmService } from './crm.service.js';

@ApiTags('CRM & Customers')
@Controller('api/v1/customers')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách khách hàng' })
  async getCustomers() {
    return this.crmService.getCustomers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khách hàng theo ID' })
  async getCustomerById(@Param('id') id: string) {
    return this.crmService.getCustomerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm mới khách hàng' })
  async createCustomer(
    @Body()
    body: {
      fullName: string;
      phoneNumber: string;
      email?: string;
      notes?: string;
    }
  ) {
    return this.crmService.createCustomer(body);
  }

  @Post(':id/points')
  @ApiOperation({ summary: 'Cộng điểm tích lũy & Nâng hạng thành viên' })
  async addPoints(@Param('id') id: string, @Body() body: { points: number }) {
    return this.crmService.addPoints(id, body.points);
  }
}
