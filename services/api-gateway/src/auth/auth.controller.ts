import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống (Lấy JWT Access Token)' })
  async login(@Body() body: { email: string; pass: string }) {
    return this.authService.login(body.email, body.pass);
  }

  @Post('seed-demo')
  @ApiOperation({ summary: 'Khởi tạo tài khoản Quản trị Demo ban đầu' })
  async seedDemo() {
    return this.authService.seedDemoAdmin();
  }
}
