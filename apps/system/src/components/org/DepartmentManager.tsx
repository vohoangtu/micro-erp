'use client';

import React, { useState } from 'react';
import {
  Network,
  Search,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Filter
} from 'lucide-react';

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  manager: string;
  branch: string;
  headcount: number;
  level: string;
  isActive?: boolean;
}

interface DepartmentManagerProps {
  departments: DepartmentItem[];
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (dept: DepartmentItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function DepartmentManager({
  departments,
  themeColorHex,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive
}: DepartmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const branches = ['ALL', 'Toàn Hệ Thống', 'Cơ sở Hoàn Kiếm', 'Chi Nhánh Quận 1', 'Chi Nhánh Đà Nẵng', 'Kho Tổng Hà Nội'];
  const levels = ['ALL', 'Khối Quản Trị', 'Khối Chuyên Môn', 'Khối Vận Hành', 'Khối Kinh Doanh', 'Khối Tài Chính', 'Khối Hậu Cần'];

  const filteredDepts = departments.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBranch = selectedBranch === 'ALL' || d.branch === selectedBranch;
    const matchLevel = selectedLevel === 'ALL' || d.level === selectedLevel;
    return matchSearch && matchBranch && matchLevel;
  });

  return (
    <div className="space-y-4">
      {/* Control Bar: Search + Filters + Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên phòng ban, mã DEPT hoặc trưởng đơn vị..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
            />
          </div>

          {/* Branch Filter */}
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

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Khối Chức Năng</option>
            <option value="Khối Quản Trị">Khối Quản Trị</option>
            <option value="Khối Chuyên Môn">Khối Chuyên Môn</option>
            <option value="Khối Vận Hành">Khối Vận Hành</option>
            <option value="Khối Kinh Doanh">Khối Kinh Doanh</option>
            <option value="Khối Tài Chính">Khối Tài Chính</option>
            <option value="Khối Hậu Cần">Khối Hậu Cần</option>
          </select>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem dạng thẻ (Grid Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem dạng bảng (Table List)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: themeColorHex }}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phòng Ban</span>
          </button>
        </div>
      </div>

      {/* Content View: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
              Không tìm thấy phòng ban nào khớp với bộ lọc
            </div>
          ) : (
            filteredDepts.map(dept => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      {dept.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {dept.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#dc0037] transition-colors">
                    {dept.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trưởng đơn vị:</span>
                      <span className="font-semibold text-slate-800">{dept.manager || 'Chưa bổ nhiệm'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trực thuộc:</span>
                      <span className="font-medium text-slate-700">{dept.branch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nhân sự thực tế:</span>
                      <span className="font-bold text-emerald-600">{dept.headcount} nhân sự</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => onToggleActive(dept.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hoạt động</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(dept)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      title="Chỉnh sửa thông tin"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(dept.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Xóa phòng ban"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Mã Đơn Vị</th>
                  <th className="py-3 px-4">Tên Phòng Ban / Khối</th>
                  <th className="py-3 px-4">Khối Chức Năng</th>
                  <th className="py-3 px-4">Trưởng Đơn Vị</th>
                  <th className="py-3 px-4">Cơ Sở Phụ Trách</th>
                  <th className="py-3 px-4 text-center">Nhân Sự</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDepts.map(dept => (
                  <tr key={dept.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{dept.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{dept.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700">
                        {dept.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{dept.manager}</td>
                    <td className="py-3.5 px-4 text-slate-600">{dept.branch}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                      {dept.headcount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(dept)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(dept.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
