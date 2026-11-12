'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Calculator,
  Users,
  CalendarCheck,
  Percent,
  FileCheck2,
  Plus,
  Search,
  Download,
  AlertCircle
} from 'lucide-react';

interface Employee {
  code: string;
  name: string;
  dept: string;
  phone: string;
  salary: number;
  rate: string;
  comm: number;
  allowance: number;
  insurance: number;
  net: number;
  status: 'ACTIVE' | 'ON_LEAVE';
}

export default function HrAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('payroll');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchEmp, setSearchEmp] = useState('');

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
  const hrSubpages: SubpageItem[] = [
    { id: 'payroll', label: 'Bảng Tính Lương & Thưởng', icon: Calculator },
    { id: 'employees', label: 'Danh Sách Nhân Sự', icon: Users },
    { id: 'attendance', label: 'Chấm Công & Điểm Danh', icon: CalendarCheck },
    { id: 'commissions', label: 'Chính Sách Hoa Hồng', icon: Percent },
    { id: 'contracts', label: 'Hợp Đồng & Phúc Lợi', icon: FileCheck2 }
  ];

  const [employees, setEmployees] = useState<Employee[]>([
    { code: 'EMP-001', name: 'Nguyễn Thị Mai', dept: 'Kỹ Thuật Viên Trị Liệu', phone: '0903 888 111', salary: 10000000, rate: '8.0%', comm: 3420000, allowance: 1000000, insurance: 1050000, net: 13370000, status: 'ACTIVE' },
    { code: 'EMP-002', name: 'Trần Văn Hoàng', dept: 'Tư Vấn Khách Hàng', phone: '0912 777 222', salary: 9000000, rate: '5.0%', comm: 2150000, allowance: 800000, insurance: 945000, net: 11005000, status: 'ACTIVE' },
    { code: 'EMP-003', name: 'Bác sĩ Lê Đình Trọng', dept: 'Chuyên Khoa Da Liễu', phone: '0988 666 333', salary: 25000000, rate: '10.0%', comm: 6800000, allowance: 2000000, insurance: 2625000, net: 31175000, status: 'ACTIVE' },
    { code: 'EMP-004', name: 'Nguyễn Thu Hằng', dept: 'Thu Ngân & Kế Toán Quầy', phone: '0933 555 444', salary: 8500000, rate: '2.0%', comm: 950000, allowance: 800000, insurance: 892500, net: 9357500, status: 'ACTIVE' },
    { code: 'EMP-005', name: 'Lê Hoàng Quân', dept: 'Chuyên Viên Massage Body', phone: '0977 444 555', salary: 9500000, rate: '8.0%', comm: 2850000, allowance: 1000000, insurance: 997500, net: 12352500, status: 'ACTIVE' }
  ]);

  const totalPayroll = employees.reduce((sum, e) => sum + e.net, 0);
  const totalCommission = employees.reduce((sum, e) => sum + e.comm, 0);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchEmp.toLowerCase()) ||
    e.code.toLowerCase().includes(searchEmp.toLowerCase()) ||
    e.dept.toLowerCase().includes(searchEmp.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung */}
      <UniversalTopbar
        currentZoneName="HR & Bảng Lương (Zone 5)"
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
          appName="HR & Bảng Lương"
          appCode="ZONE 5 • PAYROLL"
          appIcon={Briefcase}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          themeColor={themeColor}
          subpages={hrSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: BẢNG TÍNH LƯƠNG & HOA HỒNG */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Bảng Tính Lương & Hoa Hồng Tự Động</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Đồng bộ tự động doanh số đơn hàng từ quầy POS và số lượt phục vụ booking để tính hoa hồng chính xác
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Đang kết xuất bảng lương tháng 11 ra định dạng Excel và phiếu lương PDF...')}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xuất Báo Cáo</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('✅ Đã tính toán lại toàn bộ bảng lương tháng! Khớp 100% doanh thu POS.');
                    }}
                    className={`${primaryBtn} px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Chạy Lại Tính Lương</span>
                  </button>
                </div>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tổng quỹ chi trả lương tháng</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {totalPayroll.toLocaleString('vi-VN')} ₫
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Bao gồm lương cơ bản & phụ cấp</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tổng hoa hồng đơn POS</span>
                  <div className="text-2xl font-bold text-amber-600 mt-1">
                    {totalCommission.toLocaleString('vi-VN')} ₫
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Tăng +14.2% so với tháng trước</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Số nhân sự trong kỳ lương</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{employees.length} nhân sự</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Trạng thái: Đã sẵn sàng phê duyệt</span>
                </div>
              </div>

              {/* Payroll Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Mã NV</th>
                        <th className="py-3 px-4">Họ Và Tên</th>
                        <th className="py-3 px-4">Vị Trí Chuyên Môn</th>
                        <th className="py-3 px-4">Lương Cơ Bản</th>
                        <th className="py-3 px-4">Tỷ Lệ %</th>
                        <th className="py-3 px-4">Hoa Hồng POS</th>
                        <th className="py-3 px-4">Phụ Cấp</th>
                        <th className="py-3 px-4">Trừ BHXH (10.5%)</th>
                        <th className="py-3 px-4">Thực Lĩnh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map(e => (
                        <tr key={e.code} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{e.code}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{e.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">{e.dept}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {e.salary.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-700">{e.rate}</td>
                          <td className={`py-3.5 px-4 font-bold ${brandText}`}>
                            +{e.comm.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            +{e.allowance.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-3.5 px-4 text-rose-600 font-mono">
                            -{e.insurance.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                            {e.net.toLocaleString('vi-VN')} ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DANH SÁCH NHÂN SỰ */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Danh Sách Nhân Sự Đang Làm Việc</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Hồ sơ nhân viên, chức danh chuyên môn và trạng thái hợp đồng lao động
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, mã NV..."
                      value={searchEmp}
                      onChange={e => setSearchEmp(e.target.value)}
                      className="bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <button
                    onClick={() => showToast('Mở form tiếp nhận nhân sự mới...')}
                    className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Nhân Viên</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEmployees.map(e => (
                  <div key={e.code} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-center text-sm">
                          {e.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{e.name}</h3>
                          <span className="text-[11px] text-slate-400 font-mono">{e.code} • {e.phone}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang làm việc
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl flex justify-between">
                      <span>Vị trí: <strong>{e.dept}</strong></span>
                      <span>Lương CB: <strong>{e.salary.toLocaleString('vi-VN')} ₫</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHẤM CÔNG & ĐIỂM DANH */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bảng Chấm Công & Điểm Danh Ca Trực</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đồng bộ dữ liệu máy chấm công vân tay / khuôn mặt tại từng chi nhánh
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Tháng 11/2026 — Công Chuẩn: 24 Ngày</span>
                  <span className="text-slate-500">Tỷ lệ đi làm đúng giờ: 97.4%</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                        <th className="py-2 px-3">Họ và tên</th>
                        <th className="py-2 px-3">Ngày Công Thực</th>
                        <th className="py-2 px-3">Đi Trễ (Lần)</th>
                        <th className="py-2 px-3">Nghỉ Phép Có Lương</th>
                        <th className="py-2 px-3">Tăng Ca (OT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map(e => (
                        <tr key={e.code}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{e.name}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-600">24 / 24 Ngày</td>
                          <td className="py-2.5 px-3 text-slate-500">0</td>
                          <td className="py-2.5 px-3 text-slate-500">1 Ngày</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">4.5 Giờ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHÍNH SÁCH HOA HỒNG */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Chính Sách Hoa Hồng Theo Doanh Số Dịch Vụ</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cơ chế tính thưởng minh bạch kích thích năng suất chuyên môn của kỹ thuật viên và bác sĩ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    8.0% Doanh Thu Gói
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Kỹ Thuật Viên Trị Liệu & Spa</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho các gói chăm sóc da mặt Bio-Cell, Massage body Himalaya, đắp mặt nạ chuyên sâu.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    10.0% Doanh Thu Ca
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Bác Sĩ Chuyên Khoa Da Liễu</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho các ca điều trị công nghệ cao HIFU, laser trẻ hóa, cấy vi điểm và hội chẩn da khó.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    5.0% Giá Trị Mỹ Phẩm
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Tư Vấn Khách Hàng (Telesales & Quầy)</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho các sản phẩm mỹ phẩm bán lẻ mang về như Serum B5, kem chống nắng, toner hoa cúc.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HỢP ĐỒNG & PHÚC LỢI */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quản Lý Hợp Đồng Lao Động & Chế Độ Phúc Lợi</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Theo dõi thời hạn hợp đồng, bảo hiểm xã hội bắt buộc và chế độ đãi ngộ nội bộ
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-800">Tình Trạng Hợp Đồng Toàn Chuỗi</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Hợp đồng không xác định thời hạn</span>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">3 Nhân sự</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Hợp đồng có thời hạn 12 - 36 tháng</span>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">2 Nhân sự</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Sắp hết hạn trong 30 ngày</span>
                    <div className="text-lg font-bold text-emerald-600 mt-0.5">0 Nhân sự</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
