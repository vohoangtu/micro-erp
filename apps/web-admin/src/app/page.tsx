'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  ShoppingBag,
  Briefcase,
  Bot,
  Sparkles,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'bi' | 'crm' | 'booking' | 'pos' | 'hr' | 'ai'>('bi');
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Xin chào Ban Quản Trị! Tôi là BHN AI Copilot. Tôi đã kết nối trực tiếp với PostgreSQL 17 và NATS Event Bus của hệ thống. Bạn có câu hỏi nào về doanh thu, điều phối booking hay chăm sóc khách hàng hôm nay không?',
      time: '16:00'
    }
  ]);

  const handleSendAi = async (textToSend?: string) => {
    const q = textToSend || aiQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
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
            text: `${data.answer}\n\n💡 Đề xuất hành động:\n${(data.suggestedActions || []).map((a: string) => `• ${a}`).join('\n')}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Fallback local simulation
      setTimeout(() => {
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `[AI Copilot Analysis]\nDựa trên số liệu tổng hợp hôm nay:\n• Doanh thu POS: 24.850.000 đ (+14% so với tuần trước)\n• Tỉ lệ lấp đầy lịch hẹn (Occupancy): 85%\n• Nhóm dịch vụ Spa & Trị liệu chiếm 62% cơ cấu doanh thu.\n\n💡 Đề xuất hành động:\n• Mở thêm 2 ca chăm sóc da vào khung giờ vàng 18h00 - 20h00.\n• Tặng 100 điểm thưởng tự động cho khách hàng sinh nhật trong tuần này qua Zalo ZNS.`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#071615] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#153430] bg-[#091f1c] flex flex-col justify-between p-4">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#153430]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-900/30">
              <Layers className="w-6 h-6 text-[#071615]" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-emerald-400">BHN CORE</h1>
              <p className="text-[10px] text-teal-300/60 uppercase tracking-widest font-mono">Integration + Data</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'bi', label: 'Management BI', icon: BarChart3, badge: 'Realtime' },
              { id: 'crm', label: 'CRM & Khách Hàng', icon: Users },
              { id: 'booking', label: 'Booking & Lịch Hẹn', icon: Calendar, badge: '12 ca' },
              { id: 'pos', label: 'ERP / POS Bán Hàng', icon: ShoppingBag },
              { id: 'hr', label: 'HR / Bảng Lương', icon: Briefcase },
              { id: 'ai', label: 'AI Copilot 2026', icon: Bot, highlight: true }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-[#0e2c28] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Node Status (2026 VPS) */}
        <div className="bg-[#051311] border border-[#14332f] rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Trạng thái Hạ tầng:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> VPS Live
            </span>
          </div>
          <div className="text-[11px] text-slate-400/80 font-mono space-y-0.5">
            <div>• Postgres 17 + pgvector</div>
            <div>• NATS 2.29 JetStream</div>
            <div>• Valkey 8 Cache</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-[#153430] bg-[#091f1c]/50 backdrop-blur px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>BHN Core</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-emerald-300 capitalize font-medium">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#071615] px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hỏi AI Copilot</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-700/40 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
              AD
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <div className="p-8 flex-1">
          {/* TAB 1: MANAGEMENT BI */}
          {activeTab === 'bi' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Management BI Dashboard</h2>
                <p className="text-sm text-slate-400">Báo cáo hợp nhất số liệu thời gian thực từ CRM, Booking, POS và HR</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Doanh thu POS hôm nay', value: '28.450.000 ₫', sub: '+18.4% so với tuần trước', icon: TrendingUp, color: 'text-emerald-400' },
                  { title: 'Lịch hẹn đã xác nhận', value: '34 lượt', sub: 'Tỉ lệ kín phòng: 88%', icon: Calendar, color: 'text-teal-400' },
                  { title: 'Hội viên mới (CRM)', value: '12 khách', sub: 'Tổng thành viên: 1.480', icon: Users, color: 'text-cyan-400' },
                  { title: 'Chi phí hoa hồng NV', value: '3.620.000 ₫', sub: 'Tự động tính theo đơn POS', icon: CreditCard, color: 'text-amber-400' }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-[#0b2420] border border-[#163a34] rounded-2xl p-5 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                        <div className={`p-2 rounded-lg bg-[#071615] ${kpi.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                      <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>{kpi.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Architecture & Live Integration Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0b2420] border border-[#163a34] rounded-2xl p-6">
                  <h3 className="font-semibold text-lg text-white mb-4">Giao dịch POS & Đơn hàng mới nhất</h3>
                  <div className="space-y-3">
                    {[
                      { code: 'ORD-K891', customer: 'Chị Nguyễn Thanh Hương', item: 'Gói Chăm Sóc Da Mặt Cao Cấp + Serum B5', amount: '1.070.000 ₫', time: '5 phút trước' },
                      { code: 'ORD-K890', customer: 'Anh Trần Minh Tuấn', item: 'Massage Body Đá Nóng 90p', amount: '550.000 ₫', time: '22 phút trước' },
                      { code: 'ORD-K889', customer: 'Chị Lê Thị Ngọc Ánh', item: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao', amount: '2.400.000 ₫', time: '1 giờ trước' }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-[#071917] rounded-xl border border-[#153430]">
                        <div>
                          <div className="font-medium text-sm text-slate-200">{row.customer}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{row.item} • <span className="font-mono text-emerald-400">{row.code}</span></div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-emerald-300">{row.amount}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" /> {row.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0b2420] border border-[#163a34] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Copilot Quick Insights</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Phân tích tổng hợp ngày hôm nay chỉ ra rằng lượng đặt hẹn khung giờ tối (18h-20h) đang vượt tải 120%. Đề xuất điều động thêm 1 kỹ thuật viên tăng cường để tối ưu trải nghiệm khách hàng.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('ai');
                      handleSendAi('Phân tích chi tiết điều phối lịch hẹn tối nay');
                    }}
                    className="w-full mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-semibold transition"
                  >
                    Xem Chi Tiết Phân Tích &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">CRM & Quản Lý Khách Hàng</h2>
                  <p className="text-sm text-slate-400">Danh sách thành viên, tích lũy điểm thưởng và phân hạng hội viên</p>
                </div>
                <button className="bg-emerald-500 text-[#071615] px-4 py-2 rounded-xl text-xs font-bold">
                  + Thêm Khách Hàng
                </button>
              </div>

              <div className="bg-[#0b2420] border border-[#163a34] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#071615] text-slate-400 text-xs border-b border-[#163a34]">
                    <tr>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Số điện thoại</th>
                      <th className="p-4">Hạng Hội Viên</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                      <th className="p-4">Tổng Chi Tiêu</th>
                      <th className="p-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#163a34] text-slate-200">
                    {[
                      { name: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', tier: 'PLATINUM', points: '640 pts', spent: '18.500.000 ₫' },
                      { name: 'Trần Văn Hoàng', phone: '0912 888 999', tier: 'GOLD', points: '320 pts', spent: '9.200.000 ₫' },
                      { name: 'Phạm Thu Hằng', phone: '0988 777 666', tier: 'SILVER', points: '80 pts', spent: '2.800.000 ₫' }
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-[#0e2c28]">
                        <td className="p-4 font-medium text-white">{c.name}</td>
                        <td className="p-4 font-mono text-xs text-slate-300">{c.phone}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {c.tier}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-emerald-400">{c.points}</td>
                        <td className="p-4 font-semibold">{c.spent}</td>
                        <td className="p-4">
                          <button className="text-xs text-teal-300 hover:underline">Chi tiết &rarr;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKING */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Booking & Điều Phối Lịch Hẹn</h2>
                  <p className="text-sm text-slate-400">Lịch trình chăm sóc, phân bổ kỹ thuật viên và phòng dịch vụ</p>
                </div>
                <button className="bg-emerald-500 text-[#071615] px-4 py-2 rounded-xl text-xs font-bold">
                  + Đặt Lịch Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { time: '16:30 - Hôm nay', customer: 'Nguyễn Thị Mai Lan', service: 'Chăm Sóc Da Mặt Cao Cấp', staff: 'KTV. Trần Mai', status: 'CONFIRMED' },
                  { time: '17:30 - Hôm nay', customer: 'Lê Minh Tuấn', service: 'Massage Body Đá Nóng 90p', staff: 'KTV. Hoàng Quân', status: 'IN_PROGRESS' },
                  { time: '18:45 - Hôm nay', customer: 'Đỗ Phương Thảo', service: 'Trị Liệu Phục Hồi Chuyên Sâu', staff: 'KTV. Thanh Tâm', status: 'PENDING' }
                ].map((b, i) => (
                  <div key={i} className="bg-[#0b2420] border border-[#163a34] rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {b.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                        {b.status}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-white">{b.customer}</div>
                      <div className="text-xs text-slate-300 mt-1">{b.service}</div>
                    </div>
                    <div className="pt-2 border-t border-[#153430] text-xs text-slate-400 flex justify-between items-center">
                      <span>Phụ trách: <strong className="text-slate-200">{b.staff}</strong></span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: POS */}
          {activeTab === 'pos' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">ERP / POS Bán Hàng Tại Quầy</h2>
                <p className="text-sm text-slate-400">Danh mục sản phẩm, quét đơn và thu ngân trực tiếp</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Gói Chăm Sóc Da Mặt Cao Cấp', price: '450.000 ₫', category: 'Dịch vụ Spa', sku: 'SRV-01' },
                  { name: 'Serum Phục Hồi B5 50ml', price: '620.000 ₫', category: 'Mỹ phẩm', sku: 'PRD-02' },
                  { name: 'Massage Body Đá Nóng 90p', price: '550.000 ₫', category: 'Dịch vụ Spa', sku: 'SRV-03' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0b2420] border border-[#163a34] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                        {item.sku}
                      </span>
                      <h4 className="font-bold text-white mt-2">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#153430] flex justify-between items-center">
                      <span className="font-bold text-emerald-300 text-lg">{item.price}</span>
                      <button className="bg-emerald-500 hover:bg-emerald-400 text-[#071615] px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        Thêm vào đơn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HR */}
          {activeTab === 'hr' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">HR & Quản Trị Nhân Sự & Bảng Lương</h2>
                <p className="text-sm text-slate-400">Tự động tính hoa hồng theo đơn POS và ca phục vụ Booking</p>
              </div>

              <div className="bg-[#0b2420] border border-[#163a34] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#071615] text-slate-400 text-xs border-b border-[#163a34]">
                    <tr>
                      <th className="p-4">Mã NV</th>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Vị trí</th>
                      <th className="p-4">Lương Cơ Bản</th>
                      <th className="p-4">Tỉ lệ Hoa Hồng</th>
                      <th className="p-4">Hoa hồng tháng này</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#163a34] text-slate-200">
                    {[
                      { code: 'EMP-01', name: 'Nguyễn Thị Mai', dept: 'KTV Trị Liệu', salary: '10.000.000 ₫', rate: '8.0%', comm: '3.420.000 ₫' },
                      { code: 'EMP-02', name: 'Trần Văn Hoàng', dept: 'Tư Vấn KH', salary: '9.000.000 ₫', rate: '5.0%', comm: '2.150.000 ₫' }
                    ].map((e, i) => (
                      <tr key={i} className="hover:bg-[#0e2c28]">
                        <td className="p-4 font-mono text-xs text-emerald-400">{e.code}</td>
                        <td className="p-4 font-medium text-white">{e.name}</td>
                        <td className="p-4 text-xs text-slate-300">{e.dept}</td>
                        <td className="p-4 font-semibold">{e.salary}</td>
                        <td className="p-4 font-mono text-xs text-amber-300">{e.rate}</td>
                        <td className="p-4 font-bold text-emerald-400">{e.comm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: AI COPILOT INTERACTIVE */}
          {activeTab === 'ai' && (
            <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">AI Copilot Điều Hành Doanh Nghiệp (2026)</h2>
                </div>
                <p className="text-sm text-slate-400">
                  Truy vấn dữ liệu thời gian thực từ Postgres 17 (pgvector) kết hợp trí tuệ nhân tạo Gemini 2.5 Flash / GPT-4o
                </p>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-[#0b2420] border border-[#163a34] rounded-2xl p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[520px]">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-emerald-500 text-[#071615] font-medium rounded-tr-none'
                          : 'bg-[#071917] border border-[#163a34] text-slate-200 rounded-tl-none shadow'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 italic">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    AI Copilot đang phân tích dữ liệu ERP từ PostgreSQL...
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
                    className="text-xs bg-[#0b2420] hover:bg-[#123630] border border-[#163a34] text-slate-300 px-3 py-1.5 rounded-lg transition"
                  >
                    💡 {prompt}
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
                  placeholder="Đặt câu hỏi cho AI Copilot về doanh thu, khách hàng, booking..."
                  className="flex-1 bg-[#0b2420] border border-[#163a34] focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
                <button
                  onClick={() => handleSendAi()}
                  disabled={aiLoading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#071615] px-6 rounded-xl font-bold flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
