'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, QrCode, CheckCircle2 } from 'lucide-react';

export default function MemberApp() {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [service, setService] = useState('Chăm Sóc Da Mặt Cao Cấp (75p)');
  const [time, setTime] = useState('18:00 - Hôm nay');

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col p-5 space-y-6 bg-white">
      {/* Header Profile */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-xs text-slate-500 font-medium">Xin chào,</span>
          <h2 className="text-xl font-bold text-slate-900">Chị Mai Lan</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm shadow-2xs">
          ML
        </div>
      </div>

      {/* Digital Membership Card (Luxury Privilege Card) */}
      <div className="bg-gradient-to-tr from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg shadow-teal-950/20 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-300 font-semibold">
              BHN Privilege Card
            </span>
            <h3 className="text-xl font-extrabold tracking-wider mt-1 text-white">PLATINUM MEMBER</h3>
          </div>
          <QrCode className="w-8 h-8 text-emerald-300" />
        </div>

        <div className="mt-8 flex justify-between items-end">
          <div>
            <div className="text-[11px] text-teal-200">Điểm tích lũy</div>
            <div className="text-3xl font-black text-white tracking-tight flex items-center gap-1.5">
              <span>640</span>
              <span className="text-xs font-normal text-emerald-300">pts</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-teal-200 font-mono">Thẻ ID: #8829-4401</span>
          </div>
        </div>
      </div>

      {/* Quick Booking Form */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Đặt Lịch Hẹn Nhanh</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Dịch vụ chăm sóc:</label>
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
            >
              <option>Chăm Sóc Da Mặt Cao Cấp (75p)</option>
              <option>Massage Body Đá Nóng Trị Liệu (90p)</option>
              <option>Liệu Trình Phục Hồi Chuyên Sâu (60p)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">Khung giờ mong muốn:</label>
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
            >
              <option>17:00 - Hôm nay</option>
              <option>18:00 - Hôm nay</option>
              <option>19:30 - Hôm nay</option>
              <option>09:30 - Ngày mai</option>
            </select>
          </div>

          <button
            onClick={handleBook}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xác Nhận Đặt Chỗ Ngay</span>
          </button>

          {bookingSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Lịch hẹn đã được gửi tới BHN Core thành công! Chuyên viên sẽ gọi xác nhận ngay.</span>
            </div>
          )}
        </div>
      </div>

      {/* Past Visits */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch Sử Trải Nghiệm Gần Đây</h4>
        {[
          { date: '02/11/2026', title: 'Chăm Sóc Da Mặt Cao Cấp', points: '+45 pts', status: 'Hoàn tất' },
          { date: '18/10/2026', title: 'Massage Body Đá Nóng', points: '+55 pts', status: 'Hoàn tất' }
        ].map((v, i) => (
          <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs shadow-2xs">
            <div>
              <div className="font-semibold text-slate-900">{v.title}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" /> {v.date}
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700">{v.points}</span>
              <div className="text-[10px] text-slate-500">{v.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
