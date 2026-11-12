'use client';

import React, { useState, useMemo } from 'react';
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
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Compass,
  FolderTree,
  LayoutGrid,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { DepartmentItem } from './DepartmentManager';
import { JobPositionItem } from './JobPositionManager';

interface OrgTreeChartProps {
  departments: DepartmentItem[];
  positions: JobPositionItem[];
  themeColorHex: string;
}

type ViewMode = 'tree' | 'grid2' | 'directory';

interface OrgBlock {
  id: string;
  name: string;
  shortName: string;
  category: 'core' | 'support';
  color: string;
  badgeColor: string;
  icon: any;
  levelKey: string;
}

export function OrgTreeChart({ departments, positions, themeColorHex }: OrgTreeChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [searchHighlight, setSearchHighlight] = useState('');

  // 6 Functional Blocks of the Enterprise
  const blocks: OrgBlock[] = [
    {
      id: 'block-bod',
      name: 'Khối Quản Trị & Chiến Lược (BOD)',
      shortName: 'BOD & Quản Trị',
      category: 'core',
      color: 'border-purple-200 bg-purple-50/70 text-purple-800',
      badgeColor: '#8b5cf6',
      icon: Award,
      levelKey: 'Khối Quản Trị'
    },
    {
      id: 'block-clinic',
      name: 'Khối Chuyên Môn & Y Khoa Thẩm Mỹ',
      shortName: 'Y Khoa & Bác Sĩ',
      category: 'core',
      color: 'border-blue-200 bg-blue-50/70 text-blue-800',
      badgeColor: '#0ea5e9',
      icon: Building2,
      levelKey: 'Khối Chuyên Môn'
    },
    {
      id: 'block-spa',
      name: 'Khối Vận Hành & Trị Liệu Spa',
      shortName: 'Vận Hành Spa',
      category: 'core',
      color: 'border-rose-200 bg-rose-50/70 text-rose-800',
      badgeColor: '#dc0037',
      icon: Layers,
      levelKey: 'Khối Vận Hành'
    },
    {
      id: 'block-crm',
      name: 'Khối Kinh Doanh & Chăm Sóc Khách Hàng (CRM)',
      shortName: 'Kinh Doanh & CRM',
      category: 'support',
      color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800',
      badgeColor: '#10b981',
      icon: Users,
      levelKey: 'Khối Kinh Doanh'
    },
    {
      id: 'block-finance',
      name: 'Khối Tài Chính & Thu Ngân POS',
      shortName: 'Tài Chính & POS',
      category: 'support',
      color: 'border-amber-200 bg-amber-50/70 text-amber-800',
      badgeColor: '#f59e0b',
      icon: Building2,
      levelKey: 'Khối Tài Chính'
    },
    {
      id: 'block-warehouse',
      name: 'Khối Hậu Cần & Kho Dược Mỹ Phẩm',
      shortName: 'Hậu Cần & Kho',
      category: 'support',
      color: 'border-slate-300 bg-slate-100/70 text-slate-800',
      badgeColor: '#64748b',
      icon: Building2,
      levelKey: 'Khối Hậu Cần'
    }
  ];

  // Helper to match positions with department
  const getPositionsForDept = (deptName: string, deptCode: string) => {
    const normDept = deptName.toLowerCase();
    return positions.filter(p => {
      const normPosDept = (p.dept || '').toLowerCase();
      const normPosName = (p.name || '').toLowerCase();

      if (deptCode === 'DEPT-BOD' || normDept.includes('ban giám đốc')) {
        return (
          normPosDept.includes('giám đốc') ||
          normPosDept.includes('bod') ||
          normPosName.includes('giám đốc') ||
          normPosName.includes('ceo')
        );
      }
      if (deptCode === 'DEPT-CLINIC' || normDept.includes('bác sĩ')) {
        return (
          normPosDept.includes('bác sĩ') ||
          normPosDept.includes('chuyên môn') ||
          normPosName.includes('bác sĩ')
        );
      }
      if (
        deptCode === 'DEPT-SPA-THERAPY' ||
        normDept.includes('kỹ thuật viên') ||
        normDept.includes('spa')
      ) {
        return (
          normPosDept.includes('kỹ thuật') ||
          normPosDept.includes('spa') ||
          normPosName.includes('laser') ||
          normPosName.includes('spa')
        );
      }
      if (
        deptCode === 'DEPT-SALES-CSKH' ||
        normDept.includes('tư vấn') ||
        normDept.includes('crm')
      ) {
        return (
          normPosDept.includes('tư vấn') ||
          normPosDept.includes('cskh') ||
          normPosName.includes('tư vấn')
        );
      }
      if (
        deptCode === 'DEPT-FINANCE-POS' ||
        normDept.includes('kế toán') ||
        normDept.includes('thu ngân')
      ) {
        return (
          normPosDept.includes('kế toán') ||
          normPosDept.includes('pos') ||
          normPosDept.includes('thu ngân') ||
          normPosName.includes('thu ngân')
        );
      }
      if (deptCode === 'DEPT-WAREHOUSE' || normDept.includes('kho')) {
        return (
          normPosDept.includes('kho') ||
          normPosDept.includes('hậu cần') ||
          normPosName.includes('kho')
        );
      }
      return normPosDept.includes(normDept) || normDept.includes(normPosDept);
    });
  };

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const expandAll = () => setCollapsedNodes({});

  const collapseAll = () => {
    const collapsed: Record<string, boolean> = {};
    blocks.forEach(b => {
      collapsed[b.id] = true;
    });
    departments.forEach(d => {
      collapsed[d.id] = true;
    });
    setCollapsedNodes(collapsed);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.65), 1.35));
  };

  const resetZoom = () => setZoomLevel(1);

  // Search filter and highlight checks
  const isMatchSearch = (text: string) => {
    if (!searchHighlight.trim()) return false;
    return text.toLowerCase().includes(searchHighlight.trim().toLowerCase());
  };

  const matchStats = useMemo(() => {
    if (!searchHighlight.trim()) return 0;
    const query = searchHighlight.trim().toLowerCase();
    let count = 0;
    blocks.forEach(b => {
      if (b.name.toLowerCase().includes(query)) count++;
    });
    departments.forEach(d => {
      if (d.name.toLowerCase().includes(query) || d.manager.toLowerCase().includes(query) || d.code.toLowerCase().includes(query)) count++;
    });
    positions.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)) count++;
    });
    return count;
  }, [searchHighlight, departments, positions]);

  // Total system metrics
  const totalSystemHeadcount = departments.reduce((s, d) => s + d.headcount, 0) + 3; // +3 BOD

  // Render a Department Card with its positions
  const renderDepartmentCard = (dept: DepartmentItem, blockBadgeColor: string) => {
    const isDeptCollapsed = !!collapsedNodes[dept.id];
    const deptPositions = getPositionsForDept(dept.name, dept.code);
    const isDeptMatched =
      isMatchSearch(dept.name) || isMatchSearch(dept.code) || isMatchSearch(dept.manager);

    return (
      <div
        key={dept.id}
        className={`w-full bg-white rounded-xl border p-3 shadow-2xs transition-all ${
          isDeptMatched
            ? 'ring-2 ring-amber-400 border-amber-300 bg-amber-50/20'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div
          onClick={() => toggleNode(dept.id)}
          className="flex items-start justify-between cursor-pointer select-none"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400">{dept.code}</span>
              {isDeptMatched && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  Khớp
                </span>
              )}
            </div>
            <h5 className="font-bold text-slate-900 text-xs leading-snug mt-0.5">{dept.name}</h5>
          </div>
          {deptPositions.length > 0 && (
            <button
              onClick={e => {
                e.stopPropagation();
                toggleNode(dept.id);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
              title={isDeptCollapsed ? 'Mở rộng vị trí' : 'Thu gọn vị trí'}
            >
              {isDeptCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-500 mt-2 flex justify-between items-center border-t border-slate-100 pt-1.5">
          <span className="truncate pr-1">
            Phụ trách: <strong>{dept.manager}</strong>
          </span>
          <span className="font-bold text-emerald-600 shrink-0">{dept.headcount} NS</span>
        </div>

        {/* Nested Positions under Department with tree guide lines */}
        {!isDeptCollapsed && deptPositions.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 border-l-2 border-slate-200/80 pl-2.5 ml-1">
            {deptPositions.map(pos => {
              const isPosMatched = isMatchSearch(pos.name) || isMatchSearch(pos.code);
              return (
                <div
                  key={pos.id}
                  className={`p-1.5 rounded-lg border text-[10px] flex justify-between items-center transition ${
                    isPosMatched
                      ? 'bg-amber-100/60 border-amber-300 text-amber-900 font-bold'
                      : 'bg-slate-50/90 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <span className="font-semibold truncate pr-2">{pos.name}</span>
                  <span className="font-mono font-bold text-slate-600 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {pos.current}/{pos.quota}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render a Functional Block Column
  const renderBlockCard = (block: OrgBlock, depts: DepartmentItem[]) => {
    const isBlockCollapsed = !!collapsedNodes[block.id];
    const BlockIcon = block.icon;
    const isBlockMatched = isMatchSearch(block.name) || isMatchSearch(block.shortName);
    const blockHeadcount = depts.reduce((s, d) => s + d.headcount, 0);

    return (
      <div className="w-full flex flex-col items-center">
        {/* Block Header Card */}
        <div
          onClick={() => toggleNode(block.id)}
          className={`w-full bg-white rounded-2xl border p-4 shadow-xs cursor-pointer hover:shadow-md transition-all select-none ${
            isBlockMatched
              ? 'ring-2 ring-amber-400 border-amber-300'
              : `${block.color.split(' ')[0]}`
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-2xs shrink-0"
                style={{ backgroundColor: block.badgeColor }}
              >
                <BlockIcon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate" title={block.name}>
                {block.name}
              </h4>
            </div>
            {isBlockCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            )}
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>{depts.length} Phòng Ban</span>
            <span className="font-bold text-slate-700">{blockHeadcount} Nhân Sự</span>
          </div>
        </div>

        {/* Stem down to departments */}
        {!isBlockCollapsed && depts.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-300" />
            <div className="w-full space-y-3">
              {depts.map(dept => renderDepartmentCard(dept, block.badgeColor))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Control Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Search Bar & Info */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm node phòng ban, chức vụ, quản lý..."
              value={searchHighlight}
              onChange={e => setSearchHighlight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition"
            />
          </div>

          {searchHighlight && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold animate-in fade-in">
              {matchStats > 0 ? `Tìm thấy ${matchStats} kết quả` : 'Không có kết quả'}
            </span>
          )}

          <span className="text-xs text-slate-400 hidden xl:inline">
            • Tổng quy mô: <strong>{totalSystemHeadcount} nhân sự</strong>
          </span>
        </div>

        {/* Right: View Mode Toggle & Zoom & Expand */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sơ đồ cây phân cấp ngang quốc tế"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cây Toàn Cảnh</span>
            </button>

            <button
              onClick={() => setViewMode('grid2')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid2'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Phân cấp 2 tầng nghiệp vụ trực quan"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Phân 2 Tầng</span>
            </button>

            <button
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'directory'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cây thư mục tổ chức dễ đọc"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Cây Thư Mục</span>
            </button>
          </div>

          {/* Zoom controls for Tree Mode */}
          {viewMode === 'tree' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
              <button
                onClick={() => handleZoom(-0.15)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-600 transition"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-700 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.15)}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-600 transition"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-600 transition"
                title="Đặt lại zoom 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center gap-1"
              title="Mở rộng toàn bộ phòng ban và vị trí"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mở Rộng</span>
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center gap-1"
              title="Thu gọn toàn bộ"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thu Gọn</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: SƠ ĐỒ CÂY TOÀN CẢNH (TREE FLOW) */}
      {viewMode === 'tree' && (
        <div className="bg-[#faf9f6] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs overflow-x-auto w-full">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out'
            }}
            className="flex flex-col items-center min-w-max mx-auto py-2"
          >
            {/* ROOT NODE: BOD & HỘI ĐỒNG QUẢN TRỊ */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-5 rounded-2xl shadow-xl border border-slate-700 w-84 text-center relative hover:scale-102 transition-transform select-none">
                <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold uppercase">
                  LEVEL 1 • TỐI CAO
                </span>
                <h3 className="font-black text-base mt-1">Ban Giám Đốc & Hội Đồng Quản Trị</h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">Tổng Giám Đốc (CEO) & C-Level</p>
                <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex justify-between text-[11px] text-slate-400">
                  <span>
                    Định biên: <strong>3 Nhân sự</strong>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% Lấp đầy
                  </span>
                </div>
              </div>

              {/* Vertical Trunk coming down from BOD */}
              <div className="w-0.5 h-8 bg-slate-300" />
            </div>

            {/* LEVEL 1: KHỐI CHỨC NĂNG (6 COLUMNS WITH PERFECT CONTINUOUS BUS CONNECTOR) */}
            <div className="flex justify-center items-start pt-0 min-w-max mx-auto">
              {blocks.map((block, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === blocks.length - 1;
                const depts = departments.filter(d => d.level === block.levelKey);

                return (
                  <div key={block.id} className="flex flex-col items-center relative px-3 w-68 sm:w-72">
                    {/* Continuous Branch Lines:
                        Left half: touches previous column's right edge.
                        Right half: touches next column's left edge.
                        Vertical drop: connects straight to the block card.
                    */}
                    <div className="w-full h-8 relative pointer-events-none">
                      {!isFirst && (
                        <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-slate-300" />
                      )}
                      {!isLast && (
                        <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-slate-300" />
                      )}
                      {/* Vertical Drop Line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300" />
                      {/* Junction Dot */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
                    </div>

                    {/* Block Card & Children */}
                    {renderBlockCard(block, depts)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PHÂN CẤP 2 TẦNG (2-TIER CLUSTERED GRID WITH EXPLICIT BACKBONE) */}
      {viewMode === 'grid2' && (
        <div className="bg-[#faf9f6] border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs overflow-x-auto w-full">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            {/* ROOT NODE: BOD */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700 w-80 text-center relative select-none">
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

              {/* Vertical Trunk to Tier 1 */}
              <div className="w-0.5 h-8 bg-slate-300" />
            </div>

            {/* TIER 1: CORE BLOCKS (QUẢN TRỊ, CHUYÊN MÔN, VẬN HÀNH SPA) */}
            <div className="w-full">
              <div className="text-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Tầng 1 • Khối Nghiệp Vụ Trọng Tâm & Y Khoa
                </span>
              </div>

              {/* Tier 1 Columns with Continuous Connectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0">
                {blocks.slice(0, 3).map((block, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === 2;
                  const depts = departments.filter(d => d.level === block.levelKey);

                  return (
                    <div key={block.id} className="flex flex-col items-center relative">
                      <div className="hidden md:block w-full h-8 relative pointer-events-none">
                        {!isFirst && (
                          <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-slate-300" />
                        )}
                        {!isLast && (
                          <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-slate-300" />
                        )}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
                      </div>

                      {renderBlockCard(block, depts)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Central Vertical Connector Spine to Tier 2 */}
            <div className="flex flex-col items-center my-6">
              <div className="w-0.5 h-8 bg-slate-300" />
              <div className="px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-[10px] font-bold text-slate-500 shadow-2xs">
                Trục Hỗ Trợ Vận Hành & Hậu Cần Kinh Doanh
              </div>
              <div className="w-0.5 h-8 bg-slate-300" />
            </div>

            {/* TIER 2: SUPPORT BLOCKS (CRM, TÀI CHÍNH POS, HẬU CẦN KHO) */}
            <div className="w-full">
              <div className="text-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Tầng 2 • Khối Kinh Doanh, Tài Chính & Kho Vận
                </span>
              </div>

              {/* Tier 2 Columns with Continuous Connectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0">
                {blocks.slice(3, 6).map((block, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === 2;
                  const depts = departments.filter(d => d.level === block.levelKey);

                  return (
                    <div key={block.id} className="flex flex-col items-center relative">
                      <div className="hidden md:block w-full h-8 relative pointer-events-none">
                        {!isFirst && (
                          <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-slate-300" />
                        )}
                        {!isLast && (
                          <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-slate-300" />
                        )}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
                      </div>

                      {renderBlockCard(block, depts)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: CÂY THƯ MỤC DANH MỤC (DIRECTORY OUTLINE TREE) */}
      {viewMode === 'directory' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Root Directory Node */}
          <div className="border border-slate-300 rounded-2xl p-4 bg-slate-900 text-white flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-300 font-bold uppercase">
                  Cấp Lãnh Đạo Tối Cao
                </span>
                <h4 className="font-bold text-sm">Ban Giám Đốc & Hội Đồng Quản Trị (BOD)</h4>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-emerald-400 font-bold">3 Nhân sự</span>
              <span className="text-slate-400 block text-[11px]">Định biên 100%</span>
            </div>
          </div>

          {/* Directory Hierarchy Branches */}
          <div className="space-y-4 border-l-2 border-slate-300 ml-4 pl-4 sm:pl-6">
            {blocks.map(block => {
              const depts = departments.filter(d => d.level === block.levelKey);
              const isBlockCollapsed = !!collapsedNodes[block.id];
              const BlockIcon = block.icon;
              const blockHeadcount = depts.reduce((s, d) => s + d.headcount, 0);

              return (
                <div key={block.id} className="relative space-y-2">
                  {/* Branch Horizontal Arm */}
                  <div className="absolute -left-4 sm:-left-6 top-5 w-4 sm:w-6 h-0.5 bg-slate-300" />

                  {/* Block Node Item */}
                  <div
                    onClick={() => toggleNode(block.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer hover:shadow-xs transition select-none ${
                      isMatchSearch(block.name)
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-slate-50/80 border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: block.badgeColor }}
                      >
                        <BlockIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-900">{block.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {depts.length} phòng • {blockHeadcount} nhân sự
                      </span>
                      {isBlockCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Departments inside Block */}
                  {!isBlockCollapsed && depts.length > 0 && (
                    <div className="space-y-2 border-l-2 border-slate-200 ml-5 pl-4 sm:pl-6 pt-1">
                      {depts.map(dept => {
                        const isDeptCollapsed = !!collapsedNodes[dept.id];
                        const deptPositions = getPositionsForDept(dept.name, dept.code);

                        return (
                          <div key={dept.id} className="relative space-y-1.5">
                            <div className="absolute -left-4 sm:-left-6 top-4 w-4 sm:w-6 h-0.5 bg-slate-200" />

                            <div
                              onClick={() => toggleNode(dept.id)}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition select-none"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {dept.code}
                                </span>
                                <span className="font-bold text-xs text-slate-800">{dept.name}</span>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span className="text-[11px] text-slate-500">
                                  Trưởng đơn vị: <strong>{dept.manager}</strong>
                                </span>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  {dept.headcount} NS
                                </span>
                                {deptPositions.length > 0 && (
                                  <span className="text-slate-400">
                                    {isDeptCollapsed ? (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Job Positions under Department */}
                            {!isDeptCollapsed && deptPositions.length > 0 && (
                              <div className="space-y-1 border-l-2 border-slate-200/60 ml-5 pl-4 pt-1">
                                {deptPositions.map(pos => (
                                  <div
                                    key={pos.id}
                                    className="flex items-center justify-between p-1.5 bg-slate-50/80 rounded-md border border-slate-200/70 text-[11px]"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <Briefcase className="w-3 h-3 text-slate-400" />
                                      <span className="font-semibold text-slate-700">{pos.name}</span>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      Định biên: {pos.current}/{pos.quota}
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
      )}
    </div>
  );
}
