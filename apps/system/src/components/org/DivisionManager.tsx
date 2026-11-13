'use client';

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Users,
  Network,
  Download,
  Award,
  Compass,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export interface DivisionItem {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  leaderName?: string;
  description?: string;
  color?: string;
  orderIndex?: number;
  isActive?: boolean;
}

interface DivisionManagerProps {
  divisions: DivisionItem[];
  departmentCounts?: Record<string, number>;
  headcountCounts?: Record<string, number>;
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (div: DivisionItem) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string) => void;
}

export function DivisionManager({
  divisions,
  departmentCounts = {},
  headcountCounts = {},
  themeColorHex,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive
}: DivisionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDivisions = divisions.filter(div => {
    const matchSearch =
      div.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      div.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (div.leaderName && div.leaderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (div.description && div.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const handleExportExcel = () => {
    const headers = ['Mã Khối', 'Tên Khối Trực Thuộc', 'Tên Viết Tắt', 'Lãnh Đạo Phụ Trách (C-Level)', 'Phòng Ban Trực Thuộc', 'Tổng Nhân Sự Khối', 'Mô Tả Nhiệm Vụ', 'Trạng Thái'];
    const rows = filteredDivisions.map(div => [
      div.code,
      div.name,
      div.shortName || '',
      div.leaderName || 'Chưa bổ nhiệm',
      departmentCounts[div.name] || departmentCounts[div.code] || 0,
      headcountCounts[div.name] || headcountCounts[div.code] || 0,
      div.description || '',
      div.isActive === false ? 'Tạm ngưng' : 'Hoạt động'
    ]);
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Khoi_Truc_Thuoc_VietTravel_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên khối trực thuộc, mã BLOCK, lãnh đạo phụ trách (C-Level)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition whitespace-nowrap"
            title="Xuất danh sách khối chức năng ra file Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: themeColorHex }}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khối Trực Thuộc</span>
          </button>
        </div>
      </div>

      {/* Grid of Divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDivisions.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
            Không tìm thấy khối trực thuộc nào khớp với từ khóa tìm kiếm
          </div>
        ) : (
          filteredDivisions.map(div => {
            const deptsCount = departmentCounts[div.name] || departmentCounts[div.code] || 0;
            const staffCount = headcountCounts[div.name] || headcountCounts[div.code] || 0;
            const badgeColor = div.color || '#0ea5e9';

            return (
              <div
                key={div.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{div.code}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: badgeColor }}
                    >
                      {div.shortName || 'Khối Chức Năng'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#dc0037] transition-colors">
                    {div.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {div.description || 'Chức năng điều hành và giám sát chuyên môn trực thuộc Ban Giám Đốc'}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Lãnh đạo phụ trách:</span>
                      <span className="font-semibold text-slate-800">{div.leaderName || 'Tổng Giám Đốc'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Phòng ban trực thuộc:</span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {deptsCount} Phòng Ban
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tổng nhân sự khối:</span>
                      <span className="font-bold text-emerald-600">
                        {staffCount} Nhân sự
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
                    <span className="text-[11px] font-medium text-slate-500">Mã màu nhận diện</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(div)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      title="Chỉnh sửa khối"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(div.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Xóa khối chức năng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
