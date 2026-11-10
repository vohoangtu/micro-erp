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
  CreditCard,
  Building2,
  Search,
  Bell,
  Filter
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

    const userMsg = {
      sender: 'user' as const,
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
            text: `[AI Copilot Analysis]\nDựa trên số liệu tổng hợp hôm nay:\n• Doanh thu POS: 28.450.000 ₫ (+18.4% so với cùng kỳ tuần trước)\n• Tỉ lệ lấp đầy lịch hẹn (Occupancy): 88%\n• Dịch vụ Chăm Sóc Da Cao Cấp chiếm 58% cơ cấu doanh thu.\n\n💡 Đề xuất hành động:\n• Mở thêm 2 ca chăm sóc da vào khung giờ vàng 18h00 - 20h00.\n• Tự động gửi tin nhắn Zalo ZNS ưu đãi cho khách hàng hạng Platinum.`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation (Crisp Light Theme) */}
      <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between p-4 shadow-xs">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wider text-slate-900">BHN CORE</h1>
              <p className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">Integration + Data</p>
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Node Status */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Hạ Tầng VPS:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Docker Live
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
            <div>• Postgres 17 (pgvector)</div>
            <div>• NATS 2.29 JetStream</div>
            <div>• Valkey 8 Cache</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">BHN Core</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-emerald-700 font-semibold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hỏi AI Copilot</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800">
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
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Management BI Dashboard</h2>
                <p className="text-sm text-slate-500">Báo cáo hợp nhất số liệu thời gian thực từ CRM, Booking, POS và HR</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Doanh thu POS hôm nay', value: '28.450.000 ₫', sub: '+18.4% so với tuần trước', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                  { title: 'Lịch hẹn đã xác nhận', value: '34 lượt', sub: 'Tỉ lệ kín phòng: 88%', icon: Calendar, color: 'bg-teal-50 text-teal-600' },
                  { title: 'Hội viên mới (CRM)', value: '12 khách', sub: 'Tổng thành viên: 1.480', icon: Users, color: 'bg-blue-50 text-blue-600' },
                  { title: 'Chi phí hoa hồng NV', value: '3.620.000 ₫', sub: 'Tự động tính theo đơn POS', icon: CreditCard, color: 'bg-amber-50 text-amber-600' }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                        <div className={`p-2 rounded-xl ${kpi.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                      <div className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{kpi.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Transactions & Quick Insight */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base text-slate-900">Giao dịch POS & Đơn hàng mới nhất</h3>
                    <button className="text-xs text-emerald-700 font-semibold hover:underline">Xem tất cả &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'ORD-K891', customer: 'Chị Nguyễn Thanh Hương', item: 'Gói Chăm Sóc Da Mặt Cao Cấp + Serum B5', amount: '1.070.000 ₫', time: '5 phút trước' },
                      { code: 'ORD-K890', customer: 'Anh Trần Minh Tuấn', item: 'Massage Body Đá Nóng 90p', amount: '550.000 ₫', time: '22 phút trước' },
                      { code: 'ORD-K889', customer: 'Chị Lê Thị Ngọc Ánh', item: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao', amount: '2.400.000 ₫', time: '1 giờ trước' }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition">
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{row.customer}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{row.item} • <span className="font-mono text-emerald-700 font-medium">{row.code}</span></div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-slate-900">{row.amount}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                            <Clock className="w-3 h-3" /> {row.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>AI Copilot Quick Insights</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Phân tích tổng hợp ngày hôm nay chỉ ra rằng lượng đặt hẹn khung giờ tối (18h-20h) đang vượt tải 120%. Đề xuất điều động thêm 1 kỹ thuật viên tăng cường để tối ưu trải nghiệm khách hàng.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('ai');
                      handleSendAi('Phân tích chi tiết điều phối lịch hẹn tối nay');
                    }}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-xs"
                  >
                    Mở Trợ Lý AI Phân Tích &rarr;
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
                  <h2 className="text-2xl font-bold text-slate-900">CRM & Quản Lý Khách Hàng</h2>
                  <p className="text-sm text-slate-500">Danh sách thành viên, tích lũy điểm thưởng và phân hạng hội viên</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition">
                  + Thêm Khách Hàng
                </button>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Số điện thoại</th>
                      <th className="p-4">Hạng Hội Viên</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                      <th className="p-4">Tổng Chi Tiêu</th>
                      <th className="p-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { name: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', tier: 'PLATINUM', points: '640 pts', spent: '18.500.000 ₫' },
                      { name: 'Trần Văn Hoàng', phone: '0912 888 999', tier: 'GOLD', points: '320 pts', spent: '9.200.000 ₫' },
                      { name: 'Phạm Thu Hằng', phone: '0988 777 666', tier: 'SILVER', points: '80 pts', spent: '2.800.000 ₫' }
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="p-4 font-mono text-xs text-slate-600">{c.phone}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {c.tier}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-700">{c.points}</td>
                        <td className="p-4 font-semibold text-slate-900">{c.spent}</td>
                        <td className="p-4">
                          <button className="text-xs text-emerald-700 font-semibold hover:underline">Chi tiết &rarr;</button>
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
                  <h2 className="text-2xl font-bold text-slate-900">Booking & Điều Phối Lịch Hẹn</h2>
                  <p className="text-sm text-slate-500">Lịch trình chăm sóc, phân bổ kỹ thuật viên và phòng dịch vụ</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition">
                  + Đặt Lịch Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { time: '16:30 - Hôm nay', customer: 'Nguyễn Thị Mai Lan', service: 'Chăm Sóc Da Mặt Cao Cấp', staff: 'KTV. Trần Mai', status: 'CONFIRMED' },
                  { time: '17:30 - Hôm nay', customer: 'Lê Minh Tuấn', service: 'Massage Body Đá Nóng 90p', staff: 'KTV. Hoàng Quân', status: 'IN_PROGRESS' },
                  { time: '18:45 - Hôm nay', customer: 'Đỗ Phương Thảo', service: 'Trị Liệu Phục Hồi Chuyên Sâu', staff: 'KTV. Thanh Tâm', status: 'PENDING' }
                ].map((b, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {b.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{b.customer}</div>
                      <div className="text-xs text-slate-600 mt-1">{b.service}</div>
                    </div>
                    <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                      <span>Phụ trách: <strong className="text-slate-800">{b.staff}</strong></span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
                <h2 className="text-2xl font-bold text-slate-900">ERP / POS Bán Hàng Tại Quầy</h2>
                <p className="text-sm text-slate-500">Danh mục sản phẩm, quét đơn và thu ngân trực tiếp</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Gói Chăm Sóc Da Mặt Cao Cấp', price: '450.000 ₫', category: 'Dịch vụ Spa', sku: 'SRV-01' },
                  { name: 'Serum Phục Hồi B5 50ml', price: '620.000 ₫', category: 'Mỹ phẩm', sku: 'PRD-02' },
                  { name: 'Massage Body Đá Nóng 90p', price: '550.000 ₫', category: 'Dịch vụ Spa', sku: 'SRV-03' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                        {item.sku}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-2.5">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-lg">{item.price}</span>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition">
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
                <h2 className="text-2xl font-bold text-slate-900">HR & Quản Trị Nhân Sự & Bảng Lương</h2>
                <p className="text-sm text-slate-500">Tự động tính hoa hồng theo đơn POS và ca phục vụ Booking</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Mã NV</th>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Vị trí</th>
                      <th className="p-4">Lương Cơ Bản</th>
                      <th className="p-4">Tỉ lệ Hoa Hồng</th>
                      <th className="p-4">Hoa hồng tháng này</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { code: 'EMP-01', name: 'Nguyễn Thị Mai', dept: 'KTV Trị Liệu', salary: '10.000.000 ₫', rate: '8.0%', comm: '3.420.000 ₫' },
                      { code: 'EMP-02', name: 'Trần Văn Hoàng', dept: 'Tư Vấn KH', salary: '9.000.000 ₫', rate: '5.0%', comm: '2.150.000 ₫' }
                    ].map((e, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-mono text-xs text-emerald-700 font-semibold">{e.code}</td>
                        <td className="p-4 font-semibold text-slate-900">{e.name}</td>
                        <td className="p-4 text-xs text-slate-500">{e.dept}</td>
                        <td className="p-4 font-semibold text-slate-800">{e.salary}</td>
                        <td className="p-4 font-mono text-xs text-amber-700 font-bold">{e.rate}</td>
                        <td className="p-4 font-bold text-emerald-700">{e.comm}</td>
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
                  <Bot className="w-6 h-6 text-emerald-700" />
                  <h2 className="text-2xl font-bold text-slate-900">AI Copilot Điều Hành Doanh Nghiệp (2026)</h2>
                </div>
                <p className="text-sm text-slate-500">
                  Truy vấn dữ liệu thời gian thực từ Postgres 17 (pgvector) kết hợp trí tuệ nhân tạo Gemini 2.5 Flash / GPT-4o
                </p>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[520px] shadow-xs">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 italic">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
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
                    className="text-xs bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg shadow-2xs transition"
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
                  className="flex-1 bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs"
                />
                <button
                  onClick={() => handleSendAi()}
                  disabled={aiLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition shadow-xs"
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
