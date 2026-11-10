import { Injectable } from '@nestjs/common';
import { db, schema, sql } from '@erp/database';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

@Injectable()
export class AiCopilotService {
  async askCopilot(query: string) {
    // 1. Gather live operational metrics from PostgreSQL
    const totalOrders = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
    const totalCustomers = await db.select({ count: sql<number>`count(*)` }).from(schema.customers);
    const activeBookings = await db.select({ count: sql<number>`count(*)` }).from(schema.bookings);
    const totalEmployees = await db.select({ count: sql<number>`count(*)` }).from(schema.employees);

    // Sum revenue
    const revenueResult = await db
      .select({ sum: sql<string>`coalesce(sum(total_amount), 0)` })
      .from(schema.orders);
    const totalRevenue = Number(revenueResult[0]?.sum || 0);

    const erpLiveContext = `
Dữ liệu thời gian thực từ BHN CORE ERP:
- Tổng số đơn hàng: ${totalOrders[0]?.count || 0}
- Doanh thu ghi nhận: ${totalRevenue.toLocaleString('vi-VN')} VND
- Khách hàng đã đăng ký (CRM): ${totalCustomers[0]?.count || 0}
- Lịch hẹn đang phục vụ (Booking): ${activeBookings[0]?.count || 0}
- Tổng số nhân sự đang vận hành: ${totalEmployees[0]?.count || 0}
`;

    // 2. Hybrid AI LLM call
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let answer = '';
    let usedProvider = 'Local Business Logic';

    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const google = createGoogleGenerativeAI({ apiKey: geminiKey });
        const { text } = await generateText({
          model: google('gemini-2.5-flash'),
          system: `Bạn là AI Copilot thông minh phục vụ Ban Điều Hành & Quản Trị Doanh Nghiệp (ERP Core).
Trả lời súc tích, chuyên nghiệp bằng tiếng Việt. Đưa ra nhận xét dựa trên dữ liệu ERP được cung cấp và đề xuất 2-3 hành động cụ thể.`,
          prompt: `${erpLiveContext}\n\nCâu hỏi của nhà quản lý: "${query}"`
        });
        answer = text;
        usedProvider = 'Google Gemini 2.5 Flash';
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local reasoning:', err?.message);
      }
    } else if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        const openai = createOpenAI({ apiKey: openaiKey });
        const { text } = await generateText({
          model: openai('gpt-4o'),
          system: `Bạn là AI Copilot thông minh cho hệ sinh thái Microservice ERP.`,
          prompt: `${erpLiveContext}\n\nCâu hỏi: "${query}"`
        });
        answer = text;
        usedProvider = 'OpenAI GPT-4o';
      } catch (err: any) {
        console.warn('OpenAI API call failed, falling back to local reasoning:', err?.message);
      }
    }

    if (!answer) {
      // Intelligent rule-based synthesis when API key is not yet configured
      answer = `[AI Copilot - ${usedProvider}]\n\nDựa trên dữ liệu thời gian thực tại BHN CORE:\n` +
        `• Doanh thu tổng đạt: ${totalRevenue.toLocaleString('vi-VN')} VND với ${totalOrders[0]?.count || 0} đơn hàng.\n` +
        `• Tệp khách hàng CRM hiện có: ${totalCustomers[0]?.count || 0} thành viên.\n` +
        `• Hiện có ${activeBookings[0]?.count || 0} lịch hẹn dịch vụ cần theo dõi và xử lý.\n\n` +
        `Phân tích câu hỏi: "${query}": Tình hình vận hành hiện tại duy trì ổn định. Khuyến nghị tập trung chăm sóc tệp khách hàng thân thiết để gia tăng tần suất quay lại.`;
    }

    return {
      query,
      answer,
      provider: usedProvider,
      metricsSnapshot: {
        totalOrders: Number(totalOrders[0]?.count || 0),
        totalRevenue,
        activeBookings: Number(activeBookings[0]?.count || 0),
        totalCustomers: Number(totalCustomers[0]?.count || 0)
      },
      suggestedActions: [
        'Kích hoạt chiến dịch gửi Zalo ZNS cho khách hàng hạng Gold & Platinum',
        'Điều phối kỹ thuật viên cho các lịch hẹn trong 2 giờ tới',
        'Kiểm tra mức tồn kho sản phẩm bán chạy tại quầy POS'
      ]
    };
  }

  async getAiInsights() {
    return this.askCopilot('Tổng quan sức khỏe tài chính và điều phối vận hành hôm nay');
  }
}
