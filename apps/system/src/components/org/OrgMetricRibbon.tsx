'use client';

import React from 'react';
import { Network, Layers, Users, UserPlus, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface OrgMetricRibbonProps {
  totalDepts: number;
  totalPositions: number;
  currentHeadcount: number;
  quotaHeadcount: number;
  totalAllowance: string;
  themeColorHex: string;
}

export function OrgMetricRibbon({
  totalDepts,
  totalPositions,
  currentHeadcount,
  quotaHeadcount,
  totalAllowance,
  themeColorHex
}: OrgMetricRibbonProps) {
  const fillRate = quotaHeadcount > 0 ? Math.round((currentHeadcount / quotaHeadcount) * 100) : 100;
  const vacantCount = Math.max(0, quotaHeadcount - currentHeadcount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng Phòng Ban */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phòng Ban & Khối</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">{totalDepts} Đơn Vị</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Phân bổ theo mạng lưới chi nhánh toàn quốc</span>
          </div>
        </div>
      </div>

      {/* 2. Vị Trí & Định Biên */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Định Biên Nhân Sự</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">
            {currentHeadcount} <span className="text-sm font-bold text-slate-400">/ {quotaHeadcount} Người</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, fillRate)}%`,
                backgroundColor: fillRate >= 80 ? '#10b981' : '#f59e0b'
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
            <span>Tỷ lệ lấp đầy:</span>
            <span className="font-bold text-emerald-700">{fillRate}% Đạt chuẩn</span>
          </div>
        </div>
      </div>

      {/* 3. Nhu Cầu Tuyển Dụng */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khuyết Định Biên</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-amber-600">
            {vacantCount} <span className="text-sm font-bold text-slate-500">Chỉ Tiêu</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Cần tuyển dụng bổ sung cho quý 4</span>
          </div>
        </div>
      </div>

      {/* 4. Tổng Phụ Cấp Chức Vụ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phụ Cấp Trách Nhiệm</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">{totalAllowance}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Áp dụng cho Cấp bậc Level 1 - Level 4
          </div>
        </div>
      </div>
    </div>
  );
}
