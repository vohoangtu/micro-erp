'use client';

import React, { useState } from 'react';
import {
  Network,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  Award,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Search
} from 'lucide-react';
import { DepartmentItem } from './DepartmentManager';
import { JobPositionItem } from './JobPositionManager';

interface OrgTreeChartProps {
  departments: DepartmentItem[];
  positions: JobPositionItem[];
  themeColorHex: string;
}

export function OrgTreeChart({ departments, positions, themeColorHex }: OrgTreeChartProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [searchHighlight, setSearchHighlight] = useState('');

  // Group departments by Level / Khối
  const blocks = [
    {
      id: 'block-bod',
      name: 'Khối Quản Trị & Chiến Lược (BOD)',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeColor: '#8b5cf6',
      icon: Award
    },
    {
      id: 'block-clinic',
      name: 'Khối Chuyên Môn & Y Khoa Thẩm Mỹ',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: '#0ea5e9',
      icon: Building2
    },
    {
      id: 'block-spa',
      name: 'Khối Vận Hành & Trị Liệu Spa',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeColor: '#dc0037',
      icon: Layers
    },
    {
      id: 'block-crm',
      name: 'Khối Kinh Doanh & Chăm Sóc Khách Hàng (CRM)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: '#10b981',
      icon: Users
    },
    {
      id: 'block-finance',
      name: 'Khối Tài Chính & Thu Ngân POS',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: '#f59e0b',
      icon: Building2
    },
    {
      id: 'block-warehouse',
      name: 'Khối Hậu Cần & Kho Dược Mỹ Phẩm',
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      badgeColor: '#64748b',
      icon: Building2
    }
  ];

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const expandAll = () => setCollapsedNodes({});
  const collapseAll = () => {
    const collapsed: Record<string, boolean> = {};
    blocks.forEach(b => {
      collapsed[b.id] = true;
    });
    setCollapsedNodes(collapsed);
  };

  return (
    <div className="space-y-6">
      {/* Chart Control Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm node phòng ban hoặc vị trí..."
              value={searchHighlight}
              onChange={e => setSearchHighlight(e.target.value)}
              className="bg-slate-50 border border-slate-200/90 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            • Nhấp vào thẻ để thu gọn / mở rộng nhánh
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center gap-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mở Rộng Tất Cả</span>
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center gap-1"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Thu Gọn</span>
          </button>
        </div>
      </div>

      {/* Visual Tree View Container */}
      <div className="bg-[#faf9f6] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs overflow-x-auto min-w-[760px]">
        {/* ROOT NODE: HỘI ĐỒNG QUẢN TRỊ & TỔNG GIÁM ĐỐC */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700 w-80 text-center relative hover:scale-105 transition-transform duration-300">
            <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold uppercase">
              LEVEL 1 • TỐI CAO
            </span>
            <h3 className="font-black text-base mt-1">Ban Giám Đốc & Hội Đồng Quản Trị</h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">Tổng Giám Đốc (CEO) & C-Level</p>
            <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex justify-between text-[11px] text-slate-400">
              <span>Định biên: <strong>3 Nhân sự</strong></span>
              <span className="text-emerald-400 font-bold">100% Lấp đầy</span>
            </div>
          </div>

          {/* Root Connector Stem */}
          <div className="w-0.5 h-8 bg-slate-300 my-0" />
          <div className="w-[85%] max-w-4xl h-0.5 bg-slate-300 relative">
            <div className="absolute left-1/2 -top-1 w-2.5 h-2.5 rounded-full bg-slate-400 -translate-x-1/2" />
          </div>
        </div>

        {/* LEVEL 1: KHỐI CHỨC NĂNG (BLOCKS) */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {blocks.map(block => {
            const isBlockCollapsed = !!collapsedNodes[block.id];
            const BlockIcon = block.icon;

            // Find departments belonging to this block
            const blockDepts = departments.filter(d => {
              if (block.id === 'block-bod') return d.level === 'Khối Quản Trị';
              if (block.id === 'block-clinic') return d.level === 'Khối Chuyên Môn';
              if (block.id === 'block-spa') return d.level === 'Khối Vận Hành';
              if (block.id === 'block-crm') return d.level === 'Khối Kinh Doanh';
              if (block.id === 'block-finance') return d.level === 'Khối Tài Chính';
              if (block.id === 'block-warehouse') return d.level === 'Khối Hậu Cần';
              return false;
            });

            return (
              <div key={block.id} className="flex flex-col items-center">
                {/* Connector Branch to block */}
                <div className="w-0.5 h-4 bg-slate-300 mb-0" />

                {/* Block Header Card */}
                <div
                  onClick={() => toggleNode(block.id)}
                  className={`w-full bg-white rounded-2xl border ${block.color.split(' ')[2]} p-4 shadow-xs cursor-pointer hover:shadow-md transition-all select-none`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-2xs"
                        style={{ backgroundColor: block.badgeColor }}
                      >
                        <BlockIcon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{block.name}</h4>
                    </div>
                    {isBlockCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-medium">
                    <span>{blockDepts.length} Phòng Ban</span>
                    <span className="font-bold text-slate-700">
                      {blockDepts.reduce((s, d) => s + d.headcount, 0)} Nhân Sự
                    </span>
                  </div>
                </div>

                {/* Sub Departments under Block */}
                {!isBlockCollapsed && blockDepts.length > 0 && (
                  <div className="w-full flex flex-col items-center mt-3 space-y-3">
                    <div className="w-0.5 h-3 bg-slate-200" />

                    {blockDepts.map(dept => {
                      const isDeptCollapsed = !!collapsedNodes[dept.id];
                      // Find positions under this dept
                      const deptPositions = positions.filter(
                        p => p.dept.toLowerCase().includes(dept.name.toLowerCase()) ||
                             dept.name.toLowerCase().includes(p.dept.toLowerCase())
                      );

                      return (
                        <div key={dept.id} className="w-full bg-slate-50 rounded-xl border border-slate-200 p-3 shadow-2xs">
                          <div
                            onClick={() => toggleNode(dept.id)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{dept.code}</span>
                              <h5 className="font-bold text-slate-900 text-xs leading-tight">{dept.name}</h5>
                            </div>
                            {deptPositions.length > 0 && (
                              <button className="text-slate-400 hover:text-slate-600">
                                {isDeptCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-500 mt-1 flex justify-between border-t border-slate-200/60 pt-1.5">
                            <span>Phụ trách: <strong>{dept.manager}</strong></span>
                            <span className="font-bold text-emerald-600">{dept.headcount} nhân sự</span>
                          </div>

                          {/* Positions list */}
                          {!isDeptCollapsed && deptPositions.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-200 space-y-1.5">
                              {deptPositions.map(pos => (
                                <div
                                  key={pos.id}
                                  className="p-1.5 bg-white rounded-lg border border-slate-200/80 text-[10px] flex justify-between items-center"
                                >
                                  <span className="font-semibold text-slate-800 truncate pr-1">{pos.name}</span>
                                  <span className="font-mono font-bold text-slate-600 shrink-0">
                                    {pos.current}/{pos.quota}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
