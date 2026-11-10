'use client';

import React, { useState } from 'react';
import { UniversalTopbar } from '@erp/ui';
import { Briefcase, Sparkles, CheckCircle2, DollarSign, Calculator } from 'lucide-react';

export default function HrAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [payrollSuccess, setPayrollSuccess] = useState(false);

  const [employees] = useState([
    { code: 'EMP-001', name: 'Nguyễn Thị Mai', dept: 'Kỹ Thuật Viên Trị Liệu', salary: '10.000.000 ₫', rate: '8.0%', comm: '3.420.000 ₫', net: '13.420.000 ₫' },
    { code: 'EMP-002', name: 'Trần Văn Hoàng', dept: 'Tư Vấn Khách Hàng', salary: '9.000.000 ₫', rate: '5.0%', comm: '2.150.000 ₫', net: '11.150.000 ₫' },
    { code: 'EMP-003', name: 'Bác sĩ Lê Đình Trọng', dept: 'Chuyên Khoa Da Liễu', salary: '25.000.000 ₫', rate: '10.0%', comm: '6.800.000 ₫', net: '31.800.000 ₫' }
  ]);

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <UniversalTopbar
        currentZoneName="HR & Bảng Lương (Zone 5)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Phân Hệ HR, Chấm Công & Tính Hoa Hồng</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tự động hóa tính hoa hồng theo đơn POS, quản lý bảng lương và chấm công nhân sự
            </p>
          </div>

          <button
            onClick={() => {
              setPayrollSuccess(true);
              setTimeout(() => setPayrollSuccess(false), 3500);
            }}
            className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
          >
            <Calculator className="w-4 h-4" />
            <span>Chạy Tính Bảng Lương Tháng</span>
          </button>
        </div>

        {payrollSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Bảng lương tháng đã được tính toán tự động dựa trên hóa đơn POS và ca dịch vụ hoàn tất!</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Mã NV</th>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Vị trí phòng ban</th>
                <th className="p-4">Lương Cơ Bản</th>
                <th className="p-4">Tỉ Lệ Hoa Hồng</th>
                <th className="p-4">Hoa Hồng Đã Tính</th>
                <th className="p-4">Tổng Thực Nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {employees.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className={`p-4 font-mono text-xs font-bold ${brandText}`}>{e.code}</td>
                  <td className="p-4 font-semibold text-slate-900">{e.name}</td>
                  <td className="p-4 text-xs text-slate-500">{e.dept}</td>
                  <td className="p-4 font-semibold text-slate-800">{e.salary}</td>
                  <td className="p-4 font-mono text-xs text-amber-700 font-bold">{e.rate}</td>
                  <td className={`p-4 font-bold ${brandText}`}>{e.comm}</td>
                  <td className="p-4 font-extrabold text-slate-900">{e.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
