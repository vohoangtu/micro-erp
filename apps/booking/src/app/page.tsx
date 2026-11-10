'use client';

import React, { useState } from 'react';
import { UniversalTopbar } from '@erp/ui';
import { Calendar, Plus, X, Clock, CheckCircle2, User, Sparkles } from 'lucide-react';

export default function BookingAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newCust, setNewCust] = useState('');
  const [newService, setNewService] = useState('Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell');
  const [newTime, setNewTime] = useState('19:30 - Hôm nay');
  const [newStaff, setNewStaff] = useState('KTV. Trần Mai');

  const [bookings, setBookings] = useState([
    { id: 1, time: '16:30 - Hôm nay', customer: 'Nguyễn Thị Mai Lan', service: 'Gói Chăm Sóc Da Mặt Cao Cấp', staff: 'KTV. Trần Mai', room: 'Phòng VIP 2', status: 'CONFIRMED' },
    { id: 2, time: '17:30 - Hôm nay', customer: 'Lê Minh Tuấn', service: 'Massage Body Đá Nóng Himalaya 90p', staff: 'KTV. Hoàng Quân', room: 'Phòng Trị Liệu 1', status: 'IN_PROGRESS' },
    { id: 3, time: '18:45 - Hôm nay', customer: 'Đỗ Phương Thảo', service: 'Trị Liệu Phục Hồi Chuyên Sâu', staff: 'KTV. Thanh Tâm', room: 'Phòng Chăm Sóc Da', status: 'PENDING' }
  ]);

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <UniversalTopbar
        currentZoneName="Booking & Lịch Hẹn (Zone 3)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Phân Hệ Booking & Điều Phối Lịch Trình</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý ca trực, phân bổ kỹ thuật viên, phòng VIP và kiểm soát công suất phục vụ
            </p>
          </div>

          <button
            onClick={() => setShowAddBooking(true)}
            className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
          >
            <Plus className="w-4 h-4" />
            <span>Đặt Lịch Mới</span>
          </button>
        </div>

        {/* Add Booking Modal */}
        {showAddBooking && (
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">Tạo Lịch Hẹn Chăm Sóc Mới</h3>
              <button onClick={() => setShowAddBooking(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Tên khách hàng"
                value={newCust}
                onChange={e => setNewCust(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
              />
              <select
                value={newService}
                onChange={e => setNewService(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              >
                <option>Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell</option>
                <option>Massage Body Đá Nóng Himalaya 90p</option>
                <option>Trị Liệu Phục Hồi Chuyên Sâu</option>
              </select>
              <input
                type="text"
                placeholder="Khung giờ hẹn"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
              <select
                value={newStaff}
                onChange={e => setNewStaff(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              >
                <option>KTV. Trần Mai</option>
                <option>KTV. Hoàng Quân</option>
                <option>KTV. Thanh Tâm</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddBooking(false)} className="px-3 py-1.5 text-xs text-slate-600">
                Hủy
              </button>
              <button
                onClick={() => {
                  if (newCust.trim()) {
                    setBookings(prev => [
                      ...prev,
                      {
                        id: Date.now(),
                        customer: newCust,
                        service: newService,
                        time: newTime,
                        staff: newStaff,
                        room: 'Phòng VIP 2',
                        status: 'CONFIRMED'
                      }
                    ]);
                    setNewCust('');
                    setShowAddBooking(false);
                  }
                }}
                className={`${primaryBtn} px-4 py-1.5 rounded-lg text-xs font-semibold`}
              >
                Xác Nhận Đặt Chỗ
              </button>
            </div>
          </div>
        )}

        {/* Bookings Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bookings.map(b => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${brandText}`}>
                  <Clock className="w-3.5 h-3.5" /> {b.time}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {b.status}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{b.customer}</h4>
                <div className="text-xs text-slate-600 mt-1">{b.service}</div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Kỹ thuật viên:</span>
                  <strong className="text-slate-800">{b.staff}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Phòng phục vụ:</span>
                  <strong className="text-purple-700">{b.room}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
