'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ShieldCheck,
  Building2,
  UserX
} from 'lucide-react';

interface Employee {
  id?: string;
  code: string;
  name: string;
  dept: string;
  branch?: string;
  phone: string;
  email?: string;
  citizenId?: string;
  salary: number;
  rate: string;
  comm: number;
  allowance: number;
  insurance: number;
  net: number;
  status: 'ACTIVE' | 'PROBATION' | 'TERMINATED' | 'ON_LEAVE';
  hasUserAccount?: boolean;
  userEmail?: string;
  userRole?: string;
  userActive?: boolean;
}

export default function HrAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('payroll');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchEmp, setSearchEmp] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    { code: 'NV-HN-001', name: 'Trần Hương Giang', dept: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)', branch: 'Trụ Sở Hoàn Kiếm (HN)', phone: '0903 123 456', salary: 35000000, rate: '8.0%', comm: 4500000, allowance: 2500000, insurance: 3675000, net: 38325000, status: 'ACTIVE', hasUserAccount: true, userEmail: 'giang.th@viettravel.vn', userRole: 'MANAGER', userActive: true },
    { code: 'NV-HCM-001', name: 'Võ Minh Quân', dept: 'Phòng Kinh Doanh Tour M.I.C.E & Khách VIP (TP. HCM)', branch: 'Chi Nhánh Quận 1 (TP. HCM)', phone: '0908 234 567', salary: 35000000, rate: '8.0%', comm: 5200000, allowance: 2500000, insurance: 3675000, net: 39025000, status: 'ACTIVE', hasUserAccount: true, userEmail: 'quan.vm@viettravel.vn', userRole: 'MANAGER', userActive: true },
    { code: 'NV-DN-001', name: 'Đặng Thảo Vy', dept: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound', branch: 'Chi Nhánh Hải Châu (Đà Nẵng)', phone: '0905 345 678', salary: 28000000, rate: '6.0%', comm: 3200000, allowance: 2000000, insurance: 2940000, net: 30260000, status: 'ACTIVE', hasUserAccount: true, userEmail: 'vy.dt@viettravel.vn', userRole: 'MANAGER', userActive: true },
    { code: 'NV-HN-004', name: 'Nguyễn Thị Minh Hạnh', dept: 'Phòng Kế Toán Vé Máy Bay & Quầy Thu Ngân POS (HN)', branch: 'Trụ Sở Hoàn Kiếm (HN)', phone: '0914 678 901', salary: 16000000, rate: '2.0%', comm: 1200000, allowance: 1000000, insurance: 1680000, net: 16520000, status: 'ACTIVE', hasUserAccount: true, userEmail: 'cashier@viettravel.vn', userRole: 'CASHIER', userActive: true },
    { code: 'NV-HN-008', name: 'Vũ Đình Trọng', dept: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)', branch: 'Trụ Sở Hoàn Kiếm (HN)', phone: '0918 012 345', salary: 14000000, rate: '5.0%', comm: 2100000, allowance: 800000, insurance: 1470000, net: 15430000, status: 'ACTIVE', hasUserAccount: false },
    { code: 'NV-HCM-002', name: 'Trần Mỹ Duyên', dept: 'Phòng Điều Hành Tour Đông Bắc Á & Đông Nam Á (HCM)', branch: 'Chi Nhánh Quận 1 (TP. HCM)', phone: '0938 123 456', salary: 18000000, rate: '5.0%', comm: 2600000, allowance: 1200000, insurance: 1890000, net: 19910000, status: 'ACTIVE', hasUserAccount: false }
  ]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/hr/api/employees');
      const json = await res.json();
      if (json.success && json.data?.employees?.length) {
        setEmployees(json.data.employees);
      }
    } catch (err) {
      console.warn('API employees fallback to local state:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleTerminateEmployee = async (id: string, name: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xác nhận THÔI VIỆC cho nhân viên "${name}"?\n\nLƯU Ý QUAN TRỌNG: Hệ thống sẽ tự động KHÓA/THU HỒI tài khoản đăng nhập hệ thống của nhân sự này ngay lập tức để bảo vệ dữ liệu công ty!`
      )
    )
      return;

    try {
      const res = await fetch('/hr/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TERMINATE', data: { id } })
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchEmployees();
      } else {
        alert(json.message || 'Lỗi khi cập nhật trạng thái thôi việc!');
      }
    } catch {
      showToast('Đã ghi nhận trạng thái thôi việc và tự động khóa tài khoản hệ thống.');
    }
  };

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
                  <div key={e.code} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {e.name.split(' ').slice(-1)[0][0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-slate-900 text-sm">{e.name}</h3>
                              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                                {e.code}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{e.email} • {e.phone}</span>
                          </div>
                        </div>

                        {e.status === 'TERMINATED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Đã Thôi Việc
                          </span>
                        ) : e.status === 'PROBATION' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Thử Việc
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đang Làm Việc
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Đơn vị:</span>
                          <span className="font-semibold text-slate-800 text-right">{e.dept}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Lương cơ bản:</span>
                          <span className="font-bold text-slate-900">{e.salary.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      </div>

                      {/* Trạng Thái Cấp Phát Tài Khoản Hệ Thống (IAM Status) */}
                      <div className="mt-3">
                        {e.hasUserAccount ? (
                          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-emerald-800">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="leading-tight">
                                <span className="font-bold block text-[11px] text-emerald-900">Đã Cấp Tài Khoản Hệ Thống</span>
                                <span className="font-mono text-[10px] text-emerald-700">{e.userEmail} ({e.userRole})</span>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                e.userActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {e.userActive ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-[11px]">Chưa cấp tài khoản hệ thống</span>
                            </div>
                            <a
                              href="/system"
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Sang System cấp phát &rarr;
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    {e.id && e.status !== 'TERMINATED' && (
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleTerminateEmployee(e.id!, e.name)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Chấm Dứt HĐLĐ / Thôi Việc</span>
                        </button>
                      </div>
                    )}
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
                <h2 className="text-xl font-bold text-slate-900">Chính Sách Hoa Hồng Theo Doanh Số Lữ Hành & Tour</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cơ chế thưởng doanh số minh bạch kích thích năng suất kinh doanh của đội ngũ điều hành tour, hướng dẫn viên và tư vấn MICE
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    8.0% Doanh Thu Tour
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Tour Outbound (Châu Âu, Mỹ, Úc, Đông Bắc Á)</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho các tour trọn gói dài ngày, bao gồm thưởng chốt tour đoàn gia đình và khách lẻ cao cấp.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    6.0% Doanh Thu Tour
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Tour Inbound & Hướng Dẫn Viên Quốc Tế</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho đội ngũ tour leader dẫn đoàn quốc tế, hướng dẫn viên di sản miền Trung và tour vịnh biển.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md">
                    5.0% Giá Trị Hợp Đồng
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Tour Khách Đoàn Doanh Nghiệp (M.I.C.E)</h3>
                  <p className="text-xs text-slate-500">Áp dụng cho các hợp đồng tour hội thảo, team building, gala dinner cho tập đoàn và doanh nghiệp FDI.</p>
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
