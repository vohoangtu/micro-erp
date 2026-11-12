'use client';

import React, { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Search, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface JobPostItem {
  id: string;
  code: string;
  name: string;
  level: number;
  allowance: string;
  desc: string;
  isActive?: boolean;
}

interface JobPostManagerProps {
  jobPosts: JobPostItem[];
  themeColorHex: string;
  onAdd: () => void;
  onEdit: (post: JobPostItem) => void;
  onDelete: (id: string) => void;
}

export function JobPostManager({
  jobPosts,
  themeColorHex,
  onAdd,
  onEdit,
  onDelete
}: JobPostManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');

  const filteredPosts = jobPosts
    .filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = selectedLevel === 'ALL' || p.level === selectedLevel;
      return matchSearch && matchLevel;
    })
    .sort((a, b) => a.level - b.level);

  const getLevelLabel = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'Cấp 1 — Ban Giám Đốc (BOD / C-Level)';
      case 2:
        return 'Cấp 2 — Giám Đốc Cơ Sở / Chi Nhánh';
      case 3:
        return 'Cấp 3 — Trưởng Phòng Chuyên Môn';
      case 4:
        return 'Cấp 4 — Phó Phòng / Trưởng Nhóm (Team Lead)';
      default:
        return 'Cấp 5 — Chuyên Viên / Nhân Sự Thực Thi';
    }
  };

  const getLevelBadgeColor = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 2:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 3:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 4:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên chức vụ, mã POST hoặc quyền hạn..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 shadow-2xs transition"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-white border border-slate-200/90 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">Mọi Cấp Bậc (Level 1 - 5)</option>
            <option value={1}>Level 1 (BOD / C-Level)</option>
            <option value={2}>Level 2 (Giám Đốc Cơ Sở)</option>
            <option value={3}>Level 3 (Trưởng Phòng)</option>
            <option value={4}>Level 4 (Trưởng Nhóm / Phó Phòng)</option>
            <option value={5}>Level 5 (Chuyên Viên)</option>
          </select>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: themeColorHex }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chức Vụ</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Danh Mục Cấp Bậc Chức Vụ Hành Chính (Hierarchy Level 1 - 5)</h3>
            <p className="text-xs text-slate-500">Quy định thẩm quyền điều hành, hạn mức ký duyệt và phụ cấp trách nhiệm</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {filteredPosts.length} Chức vụ
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-2xs shrink-0"
                  style={{ backgroundColor: themeColorHex }}
                >
                  L{post.level}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{post.name}</span>
                    <span className="font-mono text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                      {post.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeColor(post.level)}`}>
                      {getLevelLabel(post.level)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{post.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 pl-13 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-black text-emerald-600 block">{post.allowance}</span>
                  <span className="text-[11px] text-slate-400">Phụ cấp trách nhiệm / tháng</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                    title="Chỉnh sửa chức vụ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Xóa chức vụ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
