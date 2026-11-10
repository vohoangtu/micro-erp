'use client';

import React, { useState } from 'react';
import { UniversalTopbar } from '@erp/ui';
import { BarChart3, TrendingUp, Calendar, Users, CreditCard, ArrowUpRight, Clock } from 'lucide-react';

export default function BiAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const isBlue = themeColor === 'blue';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <UniversalTopbar
        currentZoneName="Management BI (Zone 1)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Phân Hệ Báo Cáo Quản Trị & Thông Minh Doanh Nghiệp (BI)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu hợp nhất thời gian thực từ POS, Booking, CRM và HR phục vụ ban điều hành
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* Detailed Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4">Giao Dịch Gần Nhất Đồng Bộ Từ POS Hub</h3>
          <div className="space-y-3">
            {[
              { code: 'ORD-K891', customer: 'Chị Nguyễn Thanh Hương', item: 'Gói Chăm Sóc Da Mặt Cao Cấp + Serum B5', amount: '1.070.000 ₫', time: '5 phút trước' },
              { code: 'ORD-K890', customer: 'Anh Trần Minh Tuấn', item: 'Massage Body Đá Nóng 90p', amount: '550.000 ₫', time: '22 phút trước' },
              { code: 'ORD-K889', customer: 'Chị Lê Thị Ngọc Ánh', item: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao', amount: '2.400.000 ₫', time: '1 giờ trước' }
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <div className="font-semibold text-sm text-slate-900">{row.customer}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{row.item} • <span className={`font-mono font-medium ${brandText}`}>{row.code}</span></div>
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
      </main>
    </div>
  );
}
