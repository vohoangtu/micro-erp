import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HrService } from './hr.service.js';

@ApiTags('HR & Payroll')
@Controller('api/v1/hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  @ApiOperation({ summary: 'Lấy danh sách nhân viên & tỉ lệ hoa hồng' })
  async getEmployees() {
    return this.hrService.getEmployees();
  }

  @Post('employees')
  @ApiOperation({ summary: 'Thêm mới nhân viên' })
  async createEmployee(
    @Body()
    body: {
      fullName: string;
      email: string;
      phoneNumber: string;
      department: string;
      baseSalary: number;
      commissionRate?: number;
    }
  ) {
    return this.hrService.createEmployee(body);
  }

  @Post('payroll/calculate/:employeeId')
  @ApiOperation({ summary: 'Tính bảng lương & hoa hồng tháng cho nhân viên' })
  async calculatePayroll(@Param('employeeId') employeeId: string, @Body() body: { monthPeriod: string }) {
    return this.hrService.calculateMonthlyPayroll(employeeId, body.monthPeriod);
  }

  @Get('payroll')
  @ApiOperation({ summary: 'Lịch sử bảng lương' })
  async getPayrollEntries() {
    return this.hrService.getPayrollEntries();
  }
}
