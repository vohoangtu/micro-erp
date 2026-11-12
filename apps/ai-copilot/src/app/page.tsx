'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  Bot,
  Sparkles,
  Send,
  Lightbulb,
  BookOpen,
  Zap,
  Cpu,
  CheckCircle2,
  FileText,
  Clock,
  Sliders,
  Database,
  ArrowUpRight
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AiCopilotAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Xin chào Ban Quản Trị! Tôi là BHN AI Copilot. Tôi đã kết nối trực tiếp với PostgreSQL 17 (pgvector) và NATS Event Bus của hệ thống. Bạn có câu hỏi nào về doanh thu, điều phối booking hay chăm sóc khách hàng hôm nay không?',
      time: '16:00'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';
  const chatBubbleUser = isBlue ? 'bg-blue-600 text-white' : 'bg-[#dc0037] text-white';

  // Subpages without badges (clean SaaS style)
  const aiSubpages: SubpageItem[] = [
    { id: 'chat', label: 'Hội Thoại AI Copilot', icon: Bot },
    { id: 'quick-prompts', label: 'Thư Viện Prompt Quản Trị', icon: Lightbulb },
    { id: 'knowledge', label: 'Cơ Sở Tri Thức Vector RAG', icon: BookOpen },
    { id: 'automations', label: 'Tác Vụ Tự Động Định Kỳ', icon: Zap },
    { id: 'model-config', label: 'Cấu Hình LLM & Quota', icon: Cpu }
  ];

  const handleSendAi = async (textToSend?: string) => {
    const q = textToSend || aiQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, userMsg]);
    setAiQuery('');
    setAiLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `${data.answer}\n\n💡 Đề xuất hành động theo quy trình:\n${(data.suggestedActions || []).map((a: string) => `• ${a}`).join('\n')}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Fallback offline simulation');
      }
    } catch {
      setTimeout(() => {
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `[AI Copilot Analysis - RAG on Postgres 17]\nDựa trên số liệu tổng hợp hôm nay:\n• Doanh thu POS: 28.450.000 ₫ (+18.4% so với cùng kỳ tuần trước)\n• Tỉ lệ lấp đầy lịch hẹn (Occupancy): 88%\n• Dịch vụ Chăm Sóc Da Cao Cấp chiếm 58% cơ cấu doanh thu.\n\n💡 Đề xuất hành động theo quy trình:\n• Mở thêm 2 ca chăm sóc da vào khung giờ vàng 18h00 - 20h00.\n• Tự động gửi tin nhắn Zalo ZNS ưu đãi tặng 100 điểm thưởng cho khách hàng hạng Platinum.`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung */}
      <UniversalTopbar
        currentZoneName="AI Copilot 2026 (Zone 6)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main SaaS Layout: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 w-full relative">
        <Sidebar
          appName="AI Copilot 2026"
          appCode="ZONE 6 • COPILOT"
          appIcon={Bot}
          gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
          themeColor={themeColor}
          subpages={aiSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: HỘI THOẠI AI COPILOT */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Trợ Lý AI Copilot Điều Hành Doanh Nghiệp (2026)</h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Khai thác Vector RAG trên PostgreSQL 17 kết hợp mô hình Google Gemini 2.5 Flash / Pro
                </p>
              </div>

              {/* Chat Box Container */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto space-y-4 min-h-[440px] max-h-[560px] shadow-xs">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                        msg.sender === 'user'
                          ? `${chatBubbleUser} font-medium rounded-tr-none`
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {aiLoading && (
                  <div className={`flex items-center gap-2 text-xs italic ${brandText}`}>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    AI Copilot đang truy vấn dữ liệu thời gian thực từ PostgreSQL 17...
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Báo cáo doanh thu và occupancy hôm nay',
                  'Khách hàng nào sắp hết hạn liệu trình cần chăm sóc?',
                  'Đề xuất tối ưu ca trực kỹ thuật viên tối nay',
                  'Top 3 sản phẩm bán chạy nhất tuần qua'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAi(prompt)}
                    className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl shadow-2xs transition flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendAi()}
                  placeholder="Đặt câu hỏi cho AI Copilot về doanh thu, khách hàng, booking, tồn kho..."
                  className="flex-1 bg-white border border-slate-300 focus:border-slate-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden transition shadow-2xs"
                />
                <button
                  onClick={() => handleSendAi()}
                  disabled={aiLoading}
                  className={`${primaryBtn} disabled:opacity-50 px-6 rounded-2xl font-bold flex items-center gap-2 transition shadow-xs text-xs sm:text-sm`}
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: THƯ VIỆN PROMPT QUẢN TRỊ */}
          {activeTab === 'quick-prompts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Thư Viện Prompt Quản Trị Chuỗi Spa & Clinic</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Bộ câu lệnh tối ưu hóa sẵn cho ban điều hành, trưởng cơ sở và bộ phận CSKH
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Phân Tích Doanh Số & Dịch Vụ Mũi Nhọn', role: 'Dành cho Giám Đốc Điều Hành', desc: 'So sánh doanh thu chi nhánh hôm nay so với cùng kỳ tuần trước, chỉ ra 3 dịch vụ có biên lợi nhuận cao nhất.' },
                  { title: 'Tối Ưu Phân Bổ Ca Trực Kỹ Thuật Viên', role: 'Dành cho Quản Lý Cơ Sở', desc: 'Kiểm tra công suất phòng VIP và lịch hẹn ca chiều, đề xuất điều phối KTV rảnh tay sang hỗ trợ.' },
                  { title: 'Soạn Kịch Bản Chăm Sóc Khách Hàng VIP', role: 'Dành cho Chăm Sóc Khách Hàng', desc: 'Tạo mẫu tin nhắn Zalo ZNS cá nhân hóa cho khách hàng Platinum chưa ghé spa trên 30 ngày.' },
                  { title: 'Cảnh Báo Dự Báo Tồn Kho Mỹ Phẩm', role: 'Dành cho Quản Lý Kho Quầy', desc: 'Liệt kê các mặt hàng có tồn kho dưới 15 ngày dựa trên tốc độ tiêu thụ bán lẻ tuần qua.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-pink-50 text-pink-700">
                      {item.role}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendAi(item.title);
                      }}
                      className="mt-2 text-xs font-semibold text-[#dc0037] hover:underline flex items-center gap-1"
                    >
                      Áp Dụng Chạy Ngay Trong Chat <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CƠ SỞ TRI THỨC VECTOR RAG */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Cơ Sở Tri Thức & Tài Liệu pgvector</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Các tài liệu quy trình chuẩn (SOP), phác đồ y khoa và bảng giá nạp vào vector database
                  </p>
                </div>
                <button
                  onClick={() => showToast('Mở hộp thoại tải lên tài liệu PDF/Markdown vào Vector DB...')}
                  className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5`}
                >
                  <Database className="w-4 h-4" />
                  <span>Nạp Tài Liệu Mới</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px]">
                      <th className="py-3 px-4">Mã Tài Liệu</th>
                      <th className="py-3 px-4">Tên Tài Liệu Tri Thức</th>
                      <th className="py-3 px-4">Số Vector Chunks</th>
                      <th className="py-3 px-4">Trạng Thái HNSW</th>
                      <th className="py-3 px-4">Cập Nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'KB-01', name: 'Quy Chuẩn Đón Tiếp Khách Hàng VIP (SOP-01)', chunks: '124 chunks', status: 'INDEXED', date: '10/11/2026' },
                      { id: 'KB-02', name: 'Bảng Giá & Danh Mục Dịch Vụ Niêm Yết 2026', chunks: '85 chunks', status: 'INDEXED', date: '08/11/2026' },
                      { id: 'KB-03', name: 'Phác Đồ Điều Trị Mụn & Nám Y Khoa Chuẩn', chunks: '210 chunks', status: 'INDEXED', date: '05/11/2026' },
                      { id: 'KB-04', name: 'Chính Sách Hoàn Tiền & Bảo Hành Liệu Trình', chunks: '42 chunks', status: 'INDEXED', date: '01/11/2026' }
                    ].map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{doc.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{doc.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{doc.chunks}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đã Đánh Chỉ Mục
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{doc.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TÁC VỤ TỰ ĐỘNG ĐỊNH KỲ */}
          {activeTab === 'automations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tác Vụ Tự Động Định Kỳ (AI Cronjobs)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Các tiến trình ngầm tự động phân tích và thông báo cho ban điều hành
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">22:00 Hàng Ngày</span>
                    <span className="text-[10px] font-bold text-emerald-600">Đang chạy</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Báo Cáo Doanh Thu Qua Telegram</h3>
                  <p className="text-xs text-slate-500">Tự động tổng kết doanh thu POS, số lượt khách và gửi về kênh nội bộ Ban Giám Đốc.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">08:30 Hàng Ngày</span>
                    <span className="text-[10px] font-bold text-emerald-600">Đang chạy</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Nhắc Lịch Hẹn & Sinh Nhật Zalo ZNS</h3>
                  <p className="text-xs text-slate-500">Quét cơ sở dữ liệu CRM và Booking, gửi tin nhắn tự động nhắc khách lịch đến trong ngày.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Mỗi 6 Tiếng</span>
                    <span className="text-[10px] font-bold text-emerald-600">Đang chạy</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Cảnh Báo Tồn Kho Dưới Định Mức</h3>
                  <p className="text-xs text-slate-500">Phát hiện mỹ phẩm sắp hết tại quầy và gửi thông báo cho thủ kho chuẩn bị xuất kho.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CẤU HÌNH LLM & QUOTA */}
          {activeTab === 'model-config' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Cấu Hình Mô Hình Ngôn Ngữ & Hạn Ngạch Token</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Quản lý kết nối Google Gemini 2.5 Pro / Flash và chi phí inference
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mô hình AI chủ đạo</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium">
                      <option>Google Gemini 2.5 Flash (Tốc độ cao & Chi phí thấp)</option>
                      <option>Google Gemini 2.5 Pro (Suy luận sâu & Lập luận phức tạp)</option>
                      <option>OpenAI GPT-4o (Dự phòng Failover)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Vector Search Top-K</label>
                    <input type="number" defaultValue={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nhiệt độ (Temperature)</label>
                    <input type="text" defaultValue="0.2 (Chính xác cao)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Hạn ngạch Token tháng</label>
                    <input type="text" defaultValue="2.000.000 / 10.000.000 Tokens (20%)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-mono" />
                  </div>
                </div>
                <button
                  onClick={() => showToast('✅ Đã lưu cấu hình LLM Copilot thành công!')}
                  className={`${primaryBtn} px-5 py-2.5 rounded-xl text-xs font-bold transition`}
                >
                  Lưu Cấu Hình AI
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
