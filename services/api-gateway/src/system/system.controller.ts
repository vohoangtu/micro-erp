import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SystemService } from './system.service.js';

@ApiTags('System & Organization Control Tower')
@Controller('api/v1/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  // --- Organization Endpoints ---
  @Get('branches')
  @ApiOperation({ summary: 'Danh sách chi nhánh / cơ sở' })
  async getBranches() {
    return this.systemService.getBranches();
  }

  @Post('branches')
  @ApiOperation({ summary: 'Thêm mới chi nhánh' })
  async createBranch(@Body() body: any) {
    return this.systemService.createBranch(body);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Danh sách phòng ban đa cấp' })
  async getDepartments() {
    return this.systemService.getDepartments();
  }

  @Post('departments')
  @ApiOperation({ summary: 'Thêm mới phòng ban' })
  async createDepartment(@Body() body: any) {
    return this.systemService.createDepartment(body);
  }

  @Get('job-posts')
  @ApiOperation({ summary: 'Danh mục chức vụ hành chính (Cấp 1-5)' })
  async getJobPosts() {
    return this.systemService.getJobPosts();
  }

  @Post('job-posts')
  @ApiOperation({ summary: 'Thêm mới chức vụ' })
  async createJobPost(@Body() body: any) {
    return this.systemService.createJobPost(body);
  }

  @Get('job-titles')
  @ApiOperation({ summary: 'Danh mục chức danh chuyên môn kỹ thuật' })
  async getJobTitles() {
    return this.systemService.getJobTitles();
  }

  @Post('job-titles')
  @ApiOperation({ summary: 'Thêm mới chức danh chuyên môn' })
  async createJobTitle(@Body() body: any) {
    return this.systemService.createJobTitle(body);
  }

  @Get('job-positions')
  @ApiOperation({ summary: 'Danh mục vị trí công việc kèm định biên' })
  async getJobPositions() {
    return this.systemService.getJobPositions();
  }

  @Post('job-positions')
  @ApiOperation({ summary: 'Thêm mới vị trí công việc' })
  async createJobPosition(@Body() body: any) {
    return this.systemService.createJobPosition(body);
  }

  @Get('employment-types')
  @ApiOperation({ summary: 'Danh mục tính chất công việc & phúc lợi' })
  async getEmploymentTypes() {
    return this.systemService.getEmploymentTypes();
  }

  @Post('employment-types')
  @ApiOperation({ summary: 'Thêm mới tính chất công việc' })
  async createEmploymentType(@Body() body: any) {
    return this.systemService.createEmploymentType(body);
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Cây sơ đồ cơ cấu tổ chức doanh nghiệp' })
  async getOrgChart() {
    return this.systemService.getOrgChart();
  }

  // --- Users & Roles ---
  @Get('users')
  @ApiOperation({ summary: 'Danh sách tài khoản người dùng nội bộ' })
  async getUsers() {
    return this.systemService.getUsers();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Danh mục vai trò & ma trận phân quyền RBAC' })
  async getRoles() {
    return this.systemService.getRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'Tạo mới vai trò phân quyền' })
  async createRole(@Body() body: any) {
    return this.systemService.createRole(body);
  }

  // --- Settings & Integrations ---
  @Get('settings/:category')
  @ApiOperation({ summary: 'Lấy cấu hình theo danh mục (vietqr, zalo_zns, einvoice, ai_copilot, branding)' })
  async getSettings(@Param('category') category: string) {
    return this.systemService.getSettings(category);
  }

  @Post('settings/:category')
  @ApiOperation({ summary: 'Cập nhật cấu hình hệ thống' })
  async updateSettings(@Param('category') category: string, @Body() body: { key: string; value: any }) {
    return this.systemService.updateSettings(category, body.key, body.value);
  }

  // --- DevOps VPS Health & Backup ---
  @Get('health/matrix')
  @ApiOperation({ summary: 'Bảng đo sức khỏe hệ thống & thông số VPS thời gian thực' })
  async getHealthMatrix() {
    return this.systemService.getHealthMatrix();
  }

  @Post('backup')
  @ApiOperation({ summary: 'Kích hoạt sao lưu Database Snapshot tức thì 1-click' })
  async triggerBackup() {
    return this.systemService.triggerDatabaseBackup();
  }

  // --- Audit Logs ---
  @Get('audit-logs')
  @ApiOperation({ summary: 'Nhật ký truy vết thao tác & bảo mật' })
  async getAuditLogs() {
    return this.systemService.getAuditLogs();
  }
}
