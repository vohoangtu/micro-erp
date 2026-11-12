'use client';

import React, { useState } from 'react';
import { Clock, Plus, Edit2, Trash2, Search, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export interface EmploymentTypeItem {
  id: string;
  code: string;
  name: string;
  hours: number;
  insurance: boolean;
  leave: number;
  desc: string;
  isActive?: boolean;
}

interface EmploymentTypeManagerProps {
  employmentTypes: EmploymentTypeItem[];
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (type: EmploymentTypeItem) => void;
  onDelete: (id: string) => void;
}

export function EmploymentTypeManager({
  employmentTypes,
  themeColorHex,
  onAdd,
  onEdit,
  onDelete
}: EmploymentTypeManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = employmentTypes.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tính chất công việc, mã HĐLĐ hoặc quyền lợi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
          />
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: themeColorHex }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tính Chất Công Việc</span>
        </button>
      </div>

      {/* Grid of Employment Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTypes.map(et => (
          <div
            key={et.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {et.code}
                </span>
                {et.insurance ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Có BHXH/BHYT
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Không đóng BHXH
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-base leading-snug">{et.name}</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{et.desc}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-4">
              <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-3">
                <span>⏱️ {et.hours} giờ / tuần</span>
                <span>🏖️ {et.leave} ngày phép/năm</span>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onEdit(et)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  title="Chỉnh sửa tính chất công việc"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(et.id)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Xóa tính chất công việc"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
