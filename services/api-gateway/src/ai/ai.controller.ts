import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiCopilotService } from './ai.service.js';

@ApiTags('AI Copilot & BI Insights')
@Controller('api/v1/ai')
export class AiCopilotController {
  constructor(private readonly aiService: AiCopilotService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Trợ lý AI Copilot trả lời câu hỏi điều hành ERP dựa trên dữ liệu thời gian thực' })
  async ask(@Body() body: { query: string }) {
    return this.aiService.askCopilot(body.query || 'Báo cáo tổng quan kinh doanh');
  }

  @Get('insights')
  @ApiOperation({ summary: 'Tự động sinh Insight phân tích kinh doanh định kỳ' })
  async getInsights() {
    return this.aiService.getAiInsights();
  }
}
