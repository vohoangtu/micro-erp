'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Users,
  Download,
  Building,
  TrendingUp,
  Network
} from 'lucide-react';

export interface BranchItem {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  managerName?: string;
  headcount?: number;
  revenueToday?: string;
  isActive?: boolean;
}

interface BranchManagerProps {
  branches: BranchItem[];
  departmentCounts?: Record<string, number>;
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (branch: BranchItem) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onSelectBranchContext?: (branchName: string) => void;
}

export function BranchManager({
  branches,
  departmentCounts = {},
  themeColorHex,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  onSelectBranchContext
}: BranchManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('ALL');

  const cities = ['ALL', ...Array.from(new Set(branches.map(b => b.city || (b.name.includes('Hà Nội') ? 'Hà Nội' : b.name.includes('HCM') ? 'TP. HCM' : 'Đà Nẵng'))))];

  const filteredBranches = branches.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.managerName && b.managerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    const branchCity = b.city || (b.name.includes('Hà Nội') ? 'Hà Nội' : b.name.includes('HCM') ? 'TP. HCM' : 'Đà Nẵng');
    const matchCity = filterCity === 'ALL' || branchCity === filterCity;
    return matchSearch && matchCity;
  });

  const handleExportExcel = () => {
    const headers = ['Mã Cơ Sở', 'Tên Cơ Sở / Chi Nhánh', 'Giám Đốc Cơ Sở', 'Hotline', 'Địa Chỉ', 'Thành Phố', 'Phòng Ban Trực Thuộc', 'Quy Mô Nhân Sự', 'Trạng Thái'];
    const rows = filteredBranches.map(b => [
      b.code,
      b.name,
      b.managerName || 'Chưa bổ nhiệm',
      b.phone,
      b.address,
      b.city || '',
      departmentCounts[b.name] || 0,
      b.headcount || 0,
      b.isActive === false ? 'Tạm ngưng' : 'Hoạt động'
    ]);
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Co_So_Chi_Nhanh_VietTravel_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên cơ sở, mã chi nhánh, giám đốc phụ trách, địa chỉ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
            />
          </div>

          {/* City / Region Filter */}
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Khu Vực / Tỉnh Thành</option>
            {cities.filter(c => c !== 'ALL').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition whitespace-nowrap"
            title="Xuất danh sách cơ sở ra file Excel"
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
            <span>Thêm Cơ Sở / Chi Nhánh</span>
          </button>
        </div>
      </div>

      {/* Grid of Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
            Không tìm thấy cơ sở / chi nhánh nào khớp với từ khóa tìm kiếm
          </div>
        ) : (
          filteredBranches.map(branch => {
            const deptsCount = departmentCounts[branch.name] || 0;
            return (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{branch.code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đang Hoạt Động
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#dc0037] transition-colors">
                    {branch.name}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-2 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Giám đốc cơ sở:
                      </span>
                      <span className="font-semibold text-slate-800">{branch.managerName || 'Chưa bổ nhiệm'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Hotline:
                      </span>
                      <span className="font-mono font-semibold text-slate-800">{branch.phone}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Network className="w-3.5 h-3.5 text-slate-400" /> Phòng ban trực thuộc:
                      </span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {deptsCount} Phòng Ban
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Quy mô nhân sự:
                      </span>
                      <span className="font-bold text-emerald-600">
                        {branch.headcount || 20} Nhân sự
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Doanh thu hôm nay</span>
                    <span className="font-bold text-slate-900 text-sm">{branch.revenueToday || '84.500.000 đ'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(branch)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      title="Chỉnh sửa thông tin cơ sở"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(branch.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Xóa cơ sở / chi nhánh"
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
