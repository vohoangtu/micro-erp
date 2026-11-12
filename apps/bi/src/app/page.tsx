'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  CreditCard,
  ArrowUpRight,
  Clock,
  PieChart,
  Award,
  Building2,
  DollarSign,
  Download,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function BiAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

  // Subpages without badges (clean SaaS style)
  const biSubpages: SubpageItem[] = [
    { id: 'overview', label: 'Tổng Quan Doanh Nghiệp', icon: BarChart3 },
    { id: 'revenue', label: 'Doanh Thu Chuỗi Chi Nhánh', icon: Building2 },
    { id: 'services', label: 'Dịch Vụ & Mỹ Phẩm Top', icon: Award },
    { id: 'customer-insights', label: 'Chỉ Số Khách Hàng LTV', icon: Users },
    { id: 'staff-productivity', label: 'Năng Suất Kỹ Thuật Viên', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung */}
      <UniversalTopbar
        currentZoneName="Management BI & Báo Cáo (Zone 1)"
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
          appName="Quản Trị BI"
          appCode="ZONE 1 • EXECUTIVE"
          appIcon={BarChart3}
          gradient="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
          themeColor={themeColor}
          subpages={biSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: TỔNG QUAN DOANH NGHIỆP */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Báo Cáo Quản Trị & Thông Minh Doanh Nghiệp (BI)</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Tổng hợp dữ liệu hợp nhất thời gian thực từ POS, Booking, CRM và HR phục vụ ban điều hành
                  </p>
                </div>
                <button
                  onClick={() => showToast('Đang tạo báo cáo tổng giám đốc định dạng PDF...')}
                  className={`${primaryBtn} px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất Báo Cáo Điều Hành</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Doanh thu POS hôm nay', value: '28.450.000 ₫', sub: '+18.4% so với tuần trước', icon: TrendingUp, color: isBlue ? 'bg-blue-50 text-blue-600' : 'bg-[#fef1f3] text-[#dc0037]' },
                  { title: 'Lịch hẹn đã xác nhận', value: '34 lượt', sub: 'Tỉ lệ kín phòng: 88%', icon: Calendar, color: isBlue ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600' },
                  { title: 'Hội viên mới CRM', value: '12 khách', sub: 'Tổng thành viên: 1.480', icon: Users, color: isBlue ? 'bg-sky-50 text-sky-600' : 'bg-orange-50 text-orange-600' },
                  { title: 'Chi phí hoa hồng NV', value: '3.620.000 ₫', sub: 'Tự động tính theo đơn POS', icon: CreditCard, color: 'bg-amber-50 text-amber-600' }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                        <div className={`p-2 rounded-xl ${kpi.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                      <div className={`text-[11px] font-medium mt-1.5 flex items-center gap-1 ${brandText}`}>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{kpi.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Real-time Transactions Feed */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-slate-900">Giao Dịch Gần Nhất Đồng Bộ Từ POS Hub</h3>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Thời gian thực (Real-time NATS)
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { code: 'ORD-K891', customer: 'Chị Nguyễn Thanh Hương', item: 'Gói Chăm Sóc Da Mặt Cao Cấp + Serum B5', amount: '1.070.000 ₫', time: '5 phút trước' },
                    { code: 'ORD-K890', customer: 'Anh Trần Minh Tuấn', item: 'Massage Body Đá Nóng 90p', amount: '550.000 ₫', time: '22 phút trước' },
                    { code: 'ORD-K889', customer: 'Chị Lê Thị Ngọc Ánh', item: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao', amount: '2.400.000 ₫', time: '1 giờ trước' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{row.customer}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {row.item} • <span className={`font-mono font-medium ${brandText}`}>{row.code}</span>
                        </div>
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
            </div>
          )}

          {/* TAB 2: DOANH THU CHUỖI CHI NHÁNH */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Doanh Thu Theo Chuỗi Chi Nhánh</h2>
                <p className="text-xs text-slate-500 mt-1">
                  So sánh tỷ trọng đóng góp và tăng trưởng giữa các cơ sở trong hệ thống
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: 'Cơ Sở 1 — Quận 1 (Flagship)', revenue: '14.800.000 ₫', share: '52%', guests: '22 Khách', color: 'border-blue-200' },
                  { name: 'Cơ Sở 2 — Quận 7 (Phú Mỹ Hưng)', revenue: '8.450.000 ₫', share: '30%', guests: '14 Khách', color: 'border-emerald-200' },
                  { name: 'Cơ Sở 3 — Hoàn Kiếm (Hà Nội)', revenue: '5.200.000 ₫', share: '18%', guests: '8 Khách', color: 'border-purple-200' }
                ].map((b, idx) => (
                  <div key={idx} className={`bg-white border ${b.color} rounded-2xl p-5 shadow-xs space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{b.name}</span>
                      <span className="text-xs font-bold text-emerald-600">{b.share}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{b.revenue}</div>
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                      <span>Lượng khách phục vụ:</span>
                      <strong className="text-slate-800">{b.guests}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DỊCH VỤ & MỸ PHẨM TOP */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Xếp Hạng Sản Phẩm & Dịch Vụ Doanh Thu Cao Nhất</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Phân tích danh mục mũi nhọn mang lại lợi nhuận cao nhất trong tháng
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px]">
                      <th className="py-3 px-4">Xếp Hạng</th>
                      <th className="py-3 px-4">Tên Sản Phẩm / Dịch Vụ</th>
                      <th className="py-3 px-4">Phân Loại</th>
                      <th className="py-3 px-4">Số Lượng Đã Bán</th>
                      <th className="py-3 px-4">Doanh Thu Thu Được</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { rank: '#1', name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', cat: 'Dịch Vụ Spa', qty: '48 Lượt', total: '21.600.000 ₫' },
                      { rank: '#2', name: 'Combo HIFU Nâng Cơ Trẻ Hóa 2026', cat: 'Trị Liệu Y Khoa', qty: '8 Ca', total: '19.200.000 ₫' },
                      { rank: '#3', name: 'Massage Body Đá Nóng Himalaya 90p', cat: 'Dịch Vụ Spa', qty: '32 Lượt', total: '17.600.000 ₫' },
                      { rank: '#4', name: 'Serum Dưỡng Ẩm Phục Hồi B5 50ml', cat: 'Mỹ Phẩm Bán Lẻ', qty: '26 Hộp', total: '16.120.000 ₫' }
                    ].map(row => (
                      <tr key={row.rank} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-amber-600">{row.rank}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-4 text-slate-500">{row.cat}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{row.qty}</td>
                        <td className={`py-3 px-4 font-extrabold ${brandText}`}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CHỈ SỐ KHÁCH HÀNG LTV */}
          {activeTab === 'customer-insights' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Chỉ Số Giá Trị Khách Hàng (LTV) & Chi Phí Tiếp Cận (CAC)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đo lường sức khỏe tăng trưởng hội viên và hiệu quả giữ chân khách hàng
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs text-slate-500 font-medium">Giá trị vòng đời trung bình (LTV)</span>
                  <div className="text-2xl font-bold text-purple-600">12.800.000 ₫</div>
                  <p className="text-xs text-slate-500">Mỗi hội viên chi tiêu trung bình 12.8 triệu trong 12 tháng.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs text-slate-500 font-medium">Chi phí tiếp cận khách mới (CAC)</span>
                  <div className="text-2xl font-bold text-emerald-600">320.000 ₫</div>
                  <p className="text-xs text-slate-500">Tỷ lệ LTV / CAC đạt 40x (Mức sinh lời đặc biệt xuất sắc).</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs text-slate-500 font-medium">Tỷ lệ khách hàng quay lại</span>
                  <div className="text-2xl font-bold text-[#dc0037]">84.6%</div>
                  <p className="text-xs text-slate-500">Nhờ hệ thống nhắc hẹn tự động Zalo ZNS và chính sách loyalty.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NĂNG SUẤT KỸ THUẬT VIÊN */}
          {activeTab === 'staff-productivity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bảng Xếp Hạng Năng Suất Kỹ Thuật Viên</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đánh giá số giờ phục vụ, doanh số mang về và điểm hài lòng của khách hàng
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="space-y-3">
                  {[
                    { name: 'KTV. Trần Mai', turns: '48 Ca', rev: '42.800.000 ₫', rating: '5.0 / 5.0' },
                    { name: 'Bác sĩ Lê Đình Trọng', turns: '24 Ca', rev: '68.000.000 ₫', rating: '4.9 / 5.0' },
                    { name: 'KTV. Lê Hoàng Quân', turns: '42 Ca', rev: '35.600.000 ₫', rating: '4.8 / 5.0' }
                  ].map((staff, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{staff.name}</h4>
                        <span className="text-xs text-slate-400">Đã phục vụ: {staff.turns} • Đánh giá: {staff.rating}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Doanh số đóng góp:</span>
                        <span className={`font-bold text-sm ${brandText}`}>{staff.rev}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
