'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, Users, DollarSign } from 'lucide-react';

export interface JobPositionItem {
  id: string;
  code: string;
  name: string;
  dept: string;
  branch?: string;
  quota: number;
  current: number;
  salaryRange: string;
  isActive?: boolean;
}

interface JobPositionManagerProps {
  jobPositions: JobPositionItem[];
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (pos: JobPositionItem) => void;
  onDelete: (id: string) => void;
}

export function JobPositionManager({
  jobPositions,
  themeColorHex,
  onAdd,
  onEdit,
  onDelete
}: JobPositionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VACANT' | 'FULL'>('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  const branches = [
    'ALL',
    'Toàn Hệ Thống',
    'Cơ sở Hoàn Kiếm',
    'Chi Nhánh Quận 1',
    'Chi Nhánh Đà Nẵng',
    'Kho Tổng Hà Nội'
  ];

  const departments = [
    'ALL',
    'Khối Bác Sĩ & Điều Trị Da Chuyên Sâu (Hoàn Kiếm)',
    'Khối Kỹ Thuật Viên & Trị Liệu Spa (Hoàn Kiếm)',
    'Phòng Kinh Doanh & Tư Vấn Khách Hàng (Hoàn Kiếm)',
    'Phòng Kế Toán — Quầy Thu Ngân POS (Hoàn Kiếm)',
    'Khối Bác Sĩ & Điều Trị Da Chuyên Sâu (Quận 1)',
    'Khối Kỹ Thuật Viên & Trị Liệu Spa (Quận 1)',
    'Phòng Kinh Doanh & Tư Vấn Khách Hàng (Quận 1)',
    'Khối Kinh Doanh & Tiếp Thị Toàn Chuỗi (HQ)',
    'Phòng Kho Dược Mỹ Phẩm & Thiết Bị Y Tế'
  ];

  const filteredPositions = jobPositions.filter(p => {
    const isFull = p.current >= p.quota;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.branch && p.branch.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'VACANT' && !isFull) ||
      (filterStatus === 'FULL' && isFull);
    const matchDept = selectedDept === 'ALL' || p.dept === selectedDept;
    const matchBranch = selectedBranch === 'ALL' || p.branch === selectedBranch;

    return matchSearch && matchStatus && matchDept && matchBranch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo vị trí công việc, mã POS hoặc phòng ban..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Cơ Sở / Chi Nhánh</option>
            {branches.filter(b => b !== 'ALL').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Tình Trạng Định Biên</option>
            <option value="VACANT">Đang Thiếu Nhân Sự (Khuyết Định Biên)</option>
            <option value="FULL">Đã Đầy Đủ Định Biên</option>
          </select>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Phòng Ban</option>
            {departments.filter(d => d !== 'ALL').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: themeColorHex }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Vị Trí & Định Biên</span>
        </button>
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Mã Vị Trí</th>
                <th className="py-3 px-4">Tên Vị Trí Công Việc</th>
                <th className="py-3 px-4">Cơ Sở / Chi Nhánh</th>
                <th className="py-3 px-4">Thuộc Khoa / Phòng</th>
                <th className="py-3 px-4">Định Biên (Thực Tế / Tiêu Chuẩn)</th>
                <th className="py-3 px-4">Dải Lương Khung</th>
                <th className="py-3 px-4 text-center">Tình Trạng Tuyển Dụng</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPositions.map(pos => {
                const isFull = pos.current >= pos.quota;
                const fillPct = pos.quota > 0 ? Math.round((pos.current / pos.quota) * 100) : 100;
                const needMore = Math.max(0, pos.quota - pos.current);

                return (
                  <tr key={pos.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{pos.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pos.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {pos.branch || 'Toàn Hệ Thống'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{pos.dept}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{pos.current}</span>
                        <span className="text-slate-400">/ {pos.quota} người</span>
                        <span className="text-[10px] font-bold text-slate-500">({fillPct}%)</span>
                      </div>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, fillPct)}%`,
                            backgroundColor: isFull ? '#10b981' : '#f59e0b'
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{pos.salaryRange}</td>
                    <td className="py-3.5 px-4 text-center">
                      {isFull ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đủ Định Biên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Tuyển Thêm {needMore}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(pos)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                          title="Chỉnh sửa vị trí"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(pos.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Xóa vị trí"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
