'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  Calendar,
  Plus,
  X,
  Clock,
  CheckCircle2,
  User,
  Sparkles,
  Users,
  DoorOpen,
  Sliders,
  CalendarDays,
  Check,
  AlertCircle,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';

interface BookingItem {
  id: number;
  time: string;
  customer: string;
  phone: string;
  service: string;
  staff: string;
  room: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
}

export default function BookingAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newCust, setNewCust] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState('Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell');
  const [newTime, setNewTime] = useState('16:00 - Hôm nay');
  const [newStaff, setNewStaff] = useState('KTV. Trần Mai');
  const [newRoom, setNewRoom] = useState('Phòng VIP 1');

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
  const bookingSubpages: SubpageItem[] = [
    { id: 'timeline', label: 'Lịch Hẹn Hôm Nay', icon: Clock },
    { id: 'calendar', label: 'Lịch Tuần & Lưới Giờ', icon: CalendarDays },
    { id: 'technicians', label: 'Bác Sĩ & Kỹ Thuật Viên', icon: Users },
    { id: 'rooms', label: 'Phòng & Giường Dịch Vụ', icon: DoorOpen },
    { id: 'config', label: 'Cấu Hình Lịch Trình', icon: Sliders }
  ];

  const [bookings, setBookings] = useState<BookingItem[]>([
    { id: 1, time: '14:30 - Hôm nay', customer: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', service: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', staff: 'KTV. Trần Mai', room: 'Phòng VIP 1', status: 'IN_PROGRESS' },
    { id: 2, time: '16:00 - Hôm nay', customer: 'Lê Minh Tuấn', phone: '0933 445 566', service: 'Massage Body Đá Nóng Himalaya 90p', staff: 'KTV. Hoàng Quân', room: 'Phòng Trị Liệu 2', status: 'CONFIRMED' },
    { id: 3, time: '17:15 - Hôm nay', customer: 'Đỗ Phương Thảo', phone: '0919 555 444', service: 'Trị Liệu Phục Hồi Chuyên Sâu', staff: 'KTV. Thanh Tâm', room: 'Phòng Chăm Sóc Da', status: 'PENDING' },
    { id: 4, time: '18:30 - Hôm nay', customer: 'Trần Văn Hoàng', phone: '0912 888 999', service: 'Combo HIFU Trẻ Hóa 2026', staff: 'Bác sĩ Lê Đình Trọng', room: 'Phòng Phẫu Thuật Nhẹ', status: 'CONFIRMED' }
  ]);

  const [technicians] = useState([
    { name: 'KTV. Trần Mai', role: 'Kỹ Thuật Viên Chuyên Sâu', status: 'BUSY', currentGuest: 'Chị Mai Lan', turnsToday: 4 },
    { name: 'KTV. Hoàng Quân', role: 'Chuyên Viên Massage Body', status: 'AVAILABLE', currentGuest: 'Chờ khách 16:00', turnsToday: 3 },
    { name: 'KTV. Thanh Tâm', role: 'Kỹ Thuật Viên Da Liễu', status: 'AVAILABLE', currentGuest: 'Sẵn sàng', turnsToday: 2 },
    { name: 'Bác sĩ Lê Đình Trọng', role: 'Bác Sĩ Chuyên Khoa Da', status: 'BUSY', currentGuest: 'Đang hội chẩn', turnsToday: 5 }
  ]);

  const [rooms] = useState([
    { name: 'Phòng VIP 1', type: 'Phòng VIP Đơn', capacity: '1 Giường', status: 'OCCUPIED', currentService: 'Bio-Cell (Chị Mai Lan)' },
    { name: 'Phòng VIP 2', type: 'Phòng VIP Đôi', capacity: '2 Giường', status: 'AVAILABLE', currentService: 'Sẵn sàng đón khách' },
    { name: 'Phòng Trị Liệu 2', type: 'Phòng Body & Đá Nóng', capacity: '3 Giường', status: 'RESERVED', currentService: 'Giữ chỗ cho 16:00' },
    { name: 'Phòng Chăm Sóc Da', type: 'Phòng Tiêu Chuẩn', capacity: '4 Giường', status: 'AVAILABLE', currentService: '2 giường trống' }
  ]);

  const handleCreateBooking = () => {
    if (!newCust.trim()) return;
    const newB: BookingItem = {
      id: Date.now(),
      customer: newCust,
      phone: newPhone || '0901 222 333',
      service: newService,
      time: newTime,
      staff: newStaff,
      room: newRoom,
      status: 'CONFIRMED'
    };
    setBookings([newB, ...bookings]);
    setNewCust('');
    setNewPhone('');
    setShowAddBooking(false);
    showToast(`✅ Đã tạo lịch hẹn thành công cho khách ${newB.customer} vào lúc ${newB.time}! NATS Event Bus phát 'booking.created'.`);
  };

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Đang Thực Hiện</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã Xác Nhận</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Chờ Khách Đến</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Đã Hoàn Tất</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung */}
      <UniversalTopbar
        currentZoneName="Booking & Lịch Hẹn (Zone 3)"
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
          appName="Booking & Lịch Hẹn"
          appCode="ZONE 3 • SCHEDULE"
          appIcon={Calendar}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
          themeColor={themeColor}
          subpages={bookingSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: LỊCH HẸN HÔM NAY (TIMELINE) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Điều Phối Lịch Hẹn & Ca Phục Vụ</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Kiểm soát khung giờ đón khách, phân bổ kỹ thuật viên, phòng VIP và chống trùng lịch tức thì
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBooking(true)}
                  className={`${primaryBtn} px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Đặt Lịch Mới</span>
                </button>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Lịch hẹn hôm nay</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{bookings.length} lượt</div>
                  <span className="text-[11px] text-purple-600 font-medium mt-1 block">Tỉ lệ kín phòng: 88%</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Đang phục vụ trong phòng</span>
                  <div className="text-2xl font-bold text-amber-600 mt-1">
                    {bookings.filter(b => b.status === 'IN_PROGRESS').length} khách
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Phòng VIP 1 đang sáng đèn</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">KTV đang trực sẵn sàng</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {technicians.filter(t => t.status === 'AVAILABLE').length} / {technicians.length} nhân sự
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Đáp ứng tốt ca chiều</span>
                </div>
              </div>

              {/* Add Booking Modal / Drawer */}
              {showAddBooking && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Tạo Lịch Hẹn Chăm Sóc Mới</h3>
                    <button onClick={() => setShowAddBooking(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tên khách hàng *</label>
                      <input
                        type="text"
                        placeholder="Chị Mai Lan"
                        value={newCust}
                        onChange={e => setNewCust(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        placeholder="0903 123 456"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Khung giờ hẹn *</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Dịch vụ điều trị</label>
                      <select
                        value={newService}
                        onChange={e => setNewService(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option>Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell</option>
                        <option>Massage Body Đá Nóng Himalaya 90p</option>
                        <option>Trị Liệu Phục Hồi Chuyên Sâu</option>
                        <option>Combo HIFU Trẻ Hóa 2026</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kỹ thuật viên</label>
                      <select
                        value={newStaff}
                        onChange={e => setNewStaff(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option>KTV. Trần Mai</option>
                        <option>KTV. Hoàng Quân</option>
                        <option>KTV. Thanh Tâm</option>
                        <option>Bác sĩ Lê Đình Trọng</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phòng phục vụ</label>
                      <select
                        value={newRoom}
                        onChange={e => setNewRoom(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      >
                        <option>Phòng VIP 1</option>
                        <option>Phòng VIP 2</option>
                        <option>Phòng Trị Liệu 2</option>
                        <option>Phòng Chăm Sóc Da</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddBooking(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleCreateBooking}
                      className={`${primaryBtn} px-5 py-2 rounded-xl text-xs font-bold`}
                    >
                      Xác Nhận Giữ Chỗ
                    </button>
                  </div>
                </div>
              )}

              {/* Bookings Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {bookings.map(b => (
                  <div
                    key={b.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs hover:border-slate-300 transition"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="font-mono text-xs font-bold text-slate-900">{b.time}</span>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{b.customer}</h3>
                          <span className="text-xs text-slate-400 font-mono">{b.phone}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700">
                          {b.room}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-2">{b.service}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Phụ trách: <strong className="text-slate-800">{b.staff}</strong></span>
                      <div className="flex gap-1.5">
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              setBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: 'IN_PROGRESS' } : item));
                              showToast(`Đã nhận khách ${b.customer} vào ${b.room}!`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px]"
                          >
                            Bắt Đầu Liệu Trình
                          </button>
                        )}
                        {b.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => {
                              setBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: 'COMPLETED' } : item));
                              showToast(`Đã hoàn tất liệu trình cho ${b.customer}. Chuyển quầy POS thanh toán!`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px]"
                          >
                            Hoàn Tất & Qua Thu Ngân
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LỊCH TUẦN & LƯỚI GIỜ */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lịch Tổng Thể Tuần Này</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tổng quan công suất giường và khung giờ cao điểm trong tuần
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-x-auto">
                <div className="grid grid-cols-7 gap-3 min-w-[700px] text-center">
                  {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((day, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-700">{day}</div>
                      <div className="text-[11px] text-slate-400">1{idx + 0} Tháng 11</div>
                      <div className="mt-2 text-sm font-black text-purple-600">
                        {idx === 5 || idx === 6 ? '18 Lịch (Kín)' : `${8 + idx} Lịch`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BÁC SĨ & KỸ THUẬT VIÊN */}
          {activeTab === 'technicians' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Danh Sách Điều Phối Bác Sĩ & Kỹ Thuật Viên</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Trực quan hóa khối lượng công việc và tình trạng rảnh/bận của nhân sự trực ca
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicians.map((tech, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{tech.name}</h3>
                        <p className="text-xs text-slate-500">{tech.role}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          tech.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {tech.status === 'AVAILABLE' ? 'Sẵn Sàng Tiếp Khách' : 'Đang Làm Liệu Trình'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                      <span>Khách hiện tại: <strong>{tech.currentGuest}</strong></span>
                      <span>Hôm nay: <strong className="text-purple-600">{tech.turnsToday} ca</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHÒNG & GIƯỜNG DỊCH VỤ */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hiện Trạng Phòng VIP & Buồng Điều Trị</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kiểm soát tình trạng giường điều trị để phân bổ khách hàng không bị nghẽn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((rm, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{rm.name}</h3>
                        <p className="text-xs text-slate-500">{rm.type} • {rm.capacity}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          rm.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : rm.status === 'OCCUPIED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {rm.status === 'AVAILABLE' ? 'Phòng Trống' : rm.status === 'OCCUPIED' ? 'Đang Phục Vụ' : 'Đã Giữ Chỗ'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl">
                      {rm.currentService}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CẤU HÌNH LỊCH TRÌNH */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Cấu Hình Lịch Trình & Quy Chuẩn Đón Khách</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Thiết lập thời gian mở cửa, thời lượng liệu trình đệm và chính sách đặt cọc
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Giờ mở cửa sáng</label>
                    <input type="text" defaultValue="08:30" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Giờ đóng cửa tối</label>
                    <input type="text" defaultValue="21:30" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Thời gian đệm dọn phòng (Buffer)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <option>15 Phút</option>
                      <option>20 Phút</option>
                      <option>30 Phút</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Số lượng đặt tối đa / giờ</label>
                    <input type="number" defaultValue={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>
                </div>
                <button
                  onClick={() => showToast('✅ Đã lưu quy chuẩn vận hành lịch hẹn thành công!')}
                  className={`${primaryBtn} px-5 py-2.5 rounded-xl text-xs font-bold transition`}
                >
                  Lưu Cấu Hình Booking
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
