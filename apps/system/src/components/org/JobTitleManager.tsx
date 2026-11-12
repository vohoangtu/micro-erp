'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Search, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export interface JobTitleItem {
  id: string;
  code: string;
  name: string;
  field: string;
  cert: string;
  isActive?: boolean;
}

interface JobTitleManagerProps {
  jobTitles: JobTitleItem[];
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (title: JobTitleItem) => void;
  onDelete: (id: string) => void;
}

export function JobTitleManager({
  jobTitles,
  themeColorHex,
  onAdd,
  onEdit,
  onDelete
}: JobTitleManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('ALL');

  const fields = ['ALL', 'Da Liễu & Y Khoa Thẩm Mỹ', 'Laser & Thiết Bị Y Tế', 'Spa & Chăm Sóc Sắc Đẹp', 'Tư Vấn & Kinh Doanh', 'Tài Chính & Kế Toán'];

  const filteredTitles = jobTitles.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchField = selectedField === 'ALL' || t.field === selectedField;
    return matchSearch && matchField;
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
              placeholder="Tìm theo chức danh chuyên môn, mã TITLE hoặc chứng chỉ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
            />
          </div>

          <select
            value={selectedField}
            onChange={e => setSelectedField(e.target.value)}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Lĩnh Vực Chuyên Môn</option>
            {fields.filter(f => f !== 'ALL').map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: themeColorHex }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chức Danh</span>
        </button>
      </div>

      {/* Titles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTitles.map(title => (
          <div
            key={title.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {title.code}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base leading-snug mt-0.5">
                    {title.name}
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                  {title.field}
                </span>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Yêu Cầu Chứng Chỉ / CCHN:
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">{title.cert}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Tiêu Chuẩn Y Khoa 2026
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(title)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  title="Chỉnh sửa chức danh"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(title.id)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Xóa chức danh"
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
