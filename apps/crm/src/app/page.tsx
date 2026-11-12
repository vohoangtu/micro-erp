'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  Users,
  Plus,
  X,
  Search,
  Filter,
  ShieldCheck,
  Heart,
  Sparkles,
  MessageSquare,
  Award,
  Star,
  Send,
  CheckCircle2,
  PhoneCall,
  Clock,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Gift
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'DIAMOND' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD';
  points: number;
  spent: string;
  lastVisit: string;
}

export default function CrmAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('customers');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';
  const brandBg = isBlue ? 'bg-blue-50' : 'bg-[#fef1f3]';

  // Subpages without badges (clean SaaS style)
  const crmSubpages: SubpageItem[] = [
    { id: 'customers', label: 'Danh Sách Khách Hàng', icon: Users },
    { id: 'tiers', label: 'Hạng Thẻ & Điểm Thưởng', icon: Award },
    { id: 'zns', label: 'Chăm Sóc Zalo ZNS', icon: MessageSquare },
    { id: 'feedback', label: 'Đánh Giá & Phản Hồi', icon: Star },
    { id: 'segments', label: 'Phân Khúc Khách Hàng', icon: TrendingUp }
  ];

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CUST-001', name: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', email: 'mailan@gmail.com', tier: 'PLATINUM', points: 640, spent: '18.500.000 ₫', lastVisit: 'Hôm nay' },
    { id: 'CUST-002', name: 'Trần Văn Hoàng', phone: '0912 888 999', email: 'hoang.tran@gmail.com', tier: 'GOLD', points: 320, spent: '9.200.000 ₫', lastVisit: 'Hôm qua' },
    { id: 'CUST-003', name: 'Phạm Thu Hằng', phone: '0988 777 666', email: 'thuhang@yahoo.com', tier: 'SILVER', points: 80, spent: '2.800.000 ₫', lastVisit: '3 ngày trước' },
    { id: 'CUST-004', name: 'Lê Minh Tuấn', phone: '0933 445 566', email: 'tuan.lm@corp.vn', tier: 'DIAMOND', points: 1250, spent: '35.000.000 ₫', lastVisit: 'Hôm nay' },
    { id: 'CUST-005', name: 'Đỗ Phương Thảo', phone: '0919 555 444', email: 'thao.dp@spa.vn', tier: 'GOLD', points: 290, spent: '8.400.000 ₫', lastVisit: '5 ngày trước' },
    { id: 'CUST-006', name: 'Vũ Hoàng Nam', phone: '0908 333 222', email: 'nam.vh@tech.com', tier: 'STANDARD', points: 20, spent: '650.000 ₫', lastVisit: '1 tuần trước' }
  ]);

  const [reviews] = useState([
    { customer: 'Nguyễn Thị Mai Lan', rating: 5, date: '11:20 Hôm nay', service: 'Chăm Sóc Da Mặt Cao Cấp Bio-Cell', comment: 'Bác sĩ và KTV Mai rất nhiệt tình, liệu trình êm dịu, không gian phòng VIP rất thơm và sạch sẽ.' },
    { customer: 'Trần Văn Hoàng', rating: 5, date: 'Hôm qua', service: 'Massage Body Đá Nóng Himalaya', comment: 'Tay nghề kỹ thuật viên rất tốt, giảm mỏi vai gáy rõ rệt sau buổi đầu tiên.' },
    { customer: 'Phạm Thu Hằng', rating: 4, date: '2 ngày trước', service: 'Serum Trị Liệu B5 & Cấp Ẩm', comment: 'Dịch vụ tốt, thời gian chờ khám tư vấn hơi lâu khoảng 10 phút.' }
  ]);

  const filteredCustomers = customers.filter(c => {
    const matchTier = selectedTierFilter === 'ALL' || c.tier === selectedTierFilter;
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTier && matchSearch;
  });

  const handleAddCustomer = () => {
    if (!newCustName.trim()) return;
    const newCust: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustName,
      phone: newCustPhone || '0901 000 999',
      email: newCustEmail || 'khachhang@bhn.vn',
      tier: 'STANDARD',
      points: 50,
      spent: '0 ₫',
      lastVisit: 'Vừa tạo'
    };
    setCustomers([newCust, ...customers]);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setShowAddCustomer(false);
    showToast(`✅ Đã thêm hội viên mới: ${newCust.name} (Tặng ngay 50 điểm chào mừng)!`);
  };

  const getTierBadgeClass = (tier: Customer['tier']) => {
    switch (tier) {
      case 'DIAMOND':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PLATINUM':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'GOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SILVER':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung */}
      <UniversalTopbar
        currentZoneName="CRM & Khách Hàng (Zone 2)"
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
          appName="CRM & Hội Viên"
          appCode="ZONE 2 • MEMBERSHIP"
          appIcon={Users}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          themeColor={themeColor}
          subpages={crmSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: DANH SÁCH KHÁCH HÀNG */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Hồ Sơ Khách Hàng 360° & Hội Viên</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Quản lý danh bạ khách hàng toàn diện, phân hạng thành viên loyalty và đồng bộ tự động với Zalo ZNS
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className={`${primaryBtn} px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Khách Hàng Mới</span>
                </button>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tổng số hội viên</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{customers.length} khách</div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">+12 hội viên tuần này</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Hội viên VIP (Platinum/Diamond)</span>
                  <div className="text-2xl font-bold text-[#dc0037] mt-1">
                    {customers.filter(c => c.tier === 'PLATINUM' || c.tier === 'DIAMOND').length} khách
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Chiếm 68% tổng doanh thu</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tỷ lệ quay lại (Retention)</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">84.6%</div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Vượt mục tiêu quý (+4.2%)</span>
                </div>
              </div>

              {/* Add Customer Modal / Box */}
              {showAddCustomer && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Thêm Hồ Sơ Khách Hàng Mới</h3>
                    <button onClick={() => setShowAddCustomer(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={newCustName}
                        onChange={e => setNewCustName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        placeholder="0909 123 456"
                        value={newCustPhone}
                        onChange={e => setNewCustPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email liên hệ</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={newCustEmail}
                        onChange={e => setNewCustEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddCustomer(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleAddCustomer}
                      className={`${primaryBtn} px-5 py-2 rounded-xl text-xs font-bold`}
                    >
                      Lưu Hội Viên Mới
                    </button>
                  </div>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo họ tên, số điện thoại hoặc email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 transition"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['ALL', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'STANDARD'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTierFilter(tier)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        selectedTierFilter === tier
                          ? `${primaryBtn}`
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tier === 'ALL' ? 'Tất Cả Hạng' : tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Mã KH</th>
                        <th className="py-3 px-4">Họ Và Tên</th>
                        <th className="py-3 px-4">Số Điện Thoại</th>
                        <th className="py-3 px-4">Hạng Hội Viên</th>
                        <th className="py-3 px-4">Điểm Tích Lũy</th>
                        <th className="py-3 px-4">Tổng Chi Tiêu</th>
                        <th className="py-3 px-4">Lần Ghé Gần Nhất</th>
                        <th className="py-3 px-4 text-right">Tương Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{c.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{c.name}</div>
                            <div className="text-[11px] text-slate-400">{c.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{c.phone}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTierBadgeClass(c.tier)}`}>
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-bold ${brandText}`}>{c.points} pts</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{c.spent}</td>
                          <td className="py-3.5 px-4 text-slate-500">{c.lastVisit}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => showToast(`Đang gửi tin Zalo ZNS chúc mừng / nhắc lịch tới ${c.name}...`)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                              Gửi ZNS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HẠNG THẺ & ĐIỂM THƯỞNG LOYALTY */}
          {activeTab === 'tiers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quy Chuẩn Hạng Hội Viên & Chính Sách Loyalty</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Quy đổi 100.000 ₫ = 1 điểm thưởng. Tự động nâng hạng khi đạt ngưỡng điểm tích lũy trong năm
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: 'Standard Member', min: '0 - 49 pts', discount: 'Quyền Lợi Chuẩn', color: 'border-slate-200', desc: 'Tích điểm mỗi hóa đơn, nhận thông tin ưu đãi qua Zalo OA.' },
                  { name: 'Silver Member', min: 'Từ 50 pts', discount: 'Giảm 5% Dịch Vụ', color: 'border-slate-300', desc: 'Tặng voucher sinh nhật 200.000 ₫, miễn phí soi da công nghệ cao.' },
                  { name: 'Gold Member', min: 'Từ 200 pts', discount: 'Giảm 10% Dịch Vụ', color: 'border-amber-300', desc: 'Tặng voucher sinh nhật 500.000 ₫, miễn phí 1 buổi trị liệu oxy tươi.' },
                  { name: 'Platinum / Diamond', min: 'Từ 500 pts', discount: 'Giảm 15% - 20%', color: 'border-purple-300', desc: 'Ưu tiên phòng VIP 1, chỉ định Bác sĩ trưởng khoa và đỗ xe miễn phí.' }
                ].map((tier, idx) => (
                  <div key={idx} className={`bg-white border ${tier.color} rounded-2xl p-5 shadow-xs space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {tier.min}
                      </span>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{tier.name}</h3>
                    <div className={`text-sm font-extrabold ${brandText}`}>{tier.discount}</div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHĂM SÓC ZALO ZNS */}
          {activeTab === 'zns' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Chiến Dịch Chăm Sóc Khách Hàng Tự Động (Zalo ZNS)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đã kết nối chính thức Zalo Cloud Account (ZCA). Hệ thống tự động gửi tin thông báo chuẩn Brandname
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { id: '3120', name: 'ZNS Xác Nhận Đặt Lịch Hẹn', trigger: 'Sự kiện booking.created', status: 'Đang Hoạt Động', desc: 'Gửi mã lịch hẹn, giờ phục vụ, tên kỹ thuật viên và địa chỉ chi nhánh.' },
                  { id: '3121', name: 'ZNS Thông Báo Điểm POS', trigger: 'Sự kiện order.paid', status: 'Đang Hoạt Động', desc: 'Thông báo số điểm vừa tích lũy và số dư điểm khả dụng sau thanh toán.' },
                  { id: '3122', name: 'ZNS Chúc Mừng Sinh Nhật', trigger: 'Cronjob 08:30 hàng ngày', status: 'Đang Hoạt Động', desc: 'Gửi lời chúc mừng cùng mã voucher giảm 20% độc quyền.' }
                ].map(tmpl => (
                  <div key={tmpl.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        Template #{tmpl.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tmpl.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{tmpl.name}</h3>
                    <p className="text-xs text-slate-500">{tmpl.desc}</p>
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg">
                      Trigger: {tmpl.trigger}
                    </div>
                    <button
                      onClick={() => showToast(`Đã gửi mẫu tin test ZNS #${tmpl.id} thành công!`)}
                      className="w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                    >
                      Gửi Tin Thử Nghiệm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ĐÁNH GIÁ & PHẢN HỒI */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Khảo Sát Hài Lòng & Đánh Giá Dịch Vụ</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đánh giá trực tiếp từ ứng dụng khách hàng (Member App) sau khi kết thúc liệu trình
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.customer}</span>
                        <span className="text-xs text-slate-400">• {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="inline-block text-[11px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 font-medium">
                      {rev.service}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PHÂN KHÚC KHÁCH HÀNG RFM */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Phân Khúc Khách Hàng RFM & Tần Suất Ghé Thăm</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Phân tích hành vi tiêu dùng để đưa ra chiến dịch cá nhân hóa tăng doanh thu
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">Hội Viên Trung Thành (VIP Champions)</h3>
                  <div className="text-2xl font-bold text-purple-600">42 khách</div>
                  <p className="text-xs text-slate-500">Ghé thăm &gt; 2 lần/tháng, chi tiêu &gt; 15.000.000 ₫/quý.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">Hội Viên Tiềm Năng (Potential Loyalists)</h3>
                  <div className="text-2xl font-bold text-emerald-600">89 khách</div>
                  <p className="text-xs text-slate-500">Khách mới có mức độ hài lòng cao và vừa hoàn thành 1 liệu trình.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">Cảnh Báo Rời Bỏ (&gt;60 ngày chưa quay lại)</h3>
                  <div className="text-2xl font-bold text-rose-600">18 khách</div>
                  <p className="text-xs text-slate-500">Đã hơn 2 tháng chưa phát sinh giao dịch mới hoặc đặt lịch.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
