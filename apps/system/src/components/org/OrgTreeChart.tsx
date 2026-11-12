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
  Briefcase,
  MapPin,
  Building
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

const BRANCH_INFO: Record<string, { title: string; subtitle: string; manager: string; levelBadge: string; quota: string }> = {
  'Cơ sở Hoàn Kiếm': {
    title: 'Viet Travel Corp — Trụ Sở Hoàn Kiếm (Hà Nội)',
    subtitle: 'Cơ Sở 1 • Trung Tâm Điều Hành Tour Miền Bắc & Outbound',
    manager: 'Trần Hương Giang — Giám Đốc Chi Nhánh',
    levelBadge: 'CƠ SỞ 1 • CHI NHÁNH HÀ NỘI',
    quota: '26 Nhân sự • 4 Phòng ban chuyên môn'
  },
  'Chi Nhánh Quận 1': {
    title: 'Viet Travel Group — Chi Nhánh Quận 1 (TP. HCM)',
    subtitle: 'Cơ Sở 2 • Trung Tâm Lữ Hành Miền Nam & Tour Quốc Tế M.I.C.E',
    manager: 'Võ Minh Quân — Giám Đốc Chi Nhánh',
    levelBadge: 'CƠ SỞ 2 • CHI NHÁNH TP. HCM',
    quota: '24 Nhân sự • 4 Phòng ban chuyên môn'
  },
  'Chi Nhánh Đà Nẵng': {
    title: 'Viet Travel Group — Chi Nhánh Hải Châu (Đà Nẵng)',
    subtitle: 'Cơ Sở 3 • Trung Tâm Tour Di Sản & Khách Quốc Tế Inbound',
    manager: 'Đặng Thảo Vy — Giám Đốc Chi Nhánh',
    levelBadge: 'CƠ SỞ 3 • CHI NHÁNH ĐÀ NẴNG',
    quota: '16 Nhân sự • 4 Phòng ban chuyên môn'
  },
  'Toàn Hệ Thống': {
    title: 'Ban Giám Đốc & Hội Đồng Quản Trị Lữ Hành',
    subtitle: 'Trụ Sở Trung Ương • Tổng Giám Đốc (CEO) & C-Level',
    manager: 'Hội Đồng Quản Trị & Ban Điều Hành Toàn Chuỗi',
    levelBadge: 'TRỤ SỞ TỔNG • CẤP QUẢN TRỊ',
    quota: '18 Nhân sự • 4 Khối trực thuộc'
  },
  'Kho Tổng Hà Nội': {
    title: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư',
    subtitle: 'Đội Xe Du Lịch 16-45 Chỗ & Kho Vật Tư Lữ Hành Toàn Quốc',
    manager: 'Trịnh Quốc Bảo — Trưởng Trung Tâm Hậu Cần',
    levelBadge: 'HẬU CẦN & ĐỘI XE',
    quota: '4 Nhân sự'
  }
};

export function OrgTreeChart({ departments, positions, themeColorHex }: OrgTreeChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [searchHighlight, setSearchHighlight] = useState('');

  // 6 Functional Blocks of the Enterprise (Travel & Tourism)
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
      id: 'block-ops',
      name: 'Khối Thiết Kế & Điều Hành Tour (Operations)',
      shortName: 'Sản Phẩm & Điều Hành',
      category: 'core',
      color: 'border-blue-200 bg-blue-50/70 text-blue-800',
      badgeColor: '#0ea5e9',
      icon: Compass,
      levelKey: 'Khối Điều Hành Tour'
    },
    {
      id: 'block-guides',
      name: 'Khối Hướng Dẫn Viên & Vận Chuyển Du Lịch',
      shortName: 'Hướng Dẫn Viên & Xe',
      category: 'core',
      color: 'border-rose-200 bg-rose-50/70 text-rose-800',
      badgeColor: '#dc0037',
      icon: Users,
      levelKey: 'Khối Hướng Dẫn Viên'
    },
    {
      id: 'block-sales',
      name: 'Khối Kinh Doanh, Đại Lý & M.I.C.E (CRM)',
      shortName: 'Kinh Doanh & M.I.C.E',
      category: 'support',
      color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800',
      badgeColor: '#10b981',
      icon: Briefcase,
      levelKey: 'Khối Kinh Doanh & MICE'
    },
    {
      id: 'block-finance',
      name: 'Khối Tài Chính, Thanh Toán Quốc Tế & Vé',
      shortName: 'Tài Chính & Vé',
      category: 'support',
      color: 'border-amber-200 bg-amber-50/70 text-amber-800',
      badgeColor: '#f59e0b',
      icon: Building2,
      levelKey: 'Khối Tài Chính & Vé'
    },
    {
      id: 'block-logistics',
      name: 'Khối Visa, CSKH & Đội Xe Du Lịch',
      shortName: 'Visa & Hậu Cần Xe',
      category: 'support',
      color: 'border-slate-300 bg-slate-100/70 text-slate-800',
      badgeColor: '#64748b',
      icon: Building,
      levelKey: 'Khối Visa & Hậu Cần'
    }
  ];

  const branchOptions = [
    { id: 'ALL', label: '🌐 Toàn Hệ Thống (Mọi Cơ Sở)' },
    { id: 'Cơ sở Hoàn Kiếm', label: '📍 Cơ Sở Hoàn Kiếm (HN)' },
    { id: 'Chi Nhánh Quận 1', label: '📍 Chi Nhánh Quận 1 (TP. HCM)' },
    { id: 'Chi Nhánh Đà Nẵng', label: '📍 Chi Nhánh Hải Châu (Đà Nẵng)' },
    { id: 'Toàn Hệ Thống', label: '🏛️ Trụ Sở & Điều Hành (HQ)' },
    { id: 'Kho Tổng Hà Nội', label: '📦 Kho Tổng Hà Nội' }
  ];

  // Filtered lists based on selected branch
  const activeDepartments = useMemo(() => {
    if (selectedBranch === 'ALL') return departments;
    return departments.filter(d => d.branch === selectedBranch);
  }, [departments, selectedBranch]);

  const activePositions = useMemo(() => {
    if (selectedBranch === 'ALL') return positions;
    return positions.filter(p => p.branch === selectedBranch || (!p.branch && selectedBranch === 'Toàn Hệ Thống'));
  }, [positions, selectedBranch]);

  // Helper to match positions with department
  const getPositionsForDept = (deptName: string, deptCode: string, deptBranch: string) => {
    const normDept = deptName.toLowerCase();
    return activePositions.filter(p => {
      // If position has branch, it must match dept branch
      if (p.branch && p.branch !== deptBranch && deptBranch !== 'Toàn Hệ Thống') {
        return false;
      }

      const normPosDept = (p.dept || '').toLowerCase();
      const normPosName = (p.name || '').toLowerCase();

      if (normPosDept === normDept) return true;
      if (normPosDept.includes(normDept) || normDept.includes(normPosDept)) return true;

      // Match by travel domain keywords in Model 1
      if (deptCode.includes('OUTBOUND') && (normPosName.includes('outbound') || normPosDept.includes('outbound') || normPosName.includes('châu âu') || normPosName.includes('nhật bản') || normPosName.includes('điều hành'))) return true;
      if (deptCode.includes('INBOUND') && (normPosName.includes('inbound') || normPosDept.includes('inbound') || normPosName.includes('di sản'))) return true;
      if (deptCode.includes('PRODUCT') && (normPosName.includes('gds') || normPosName.includes('hàng không') || normPosDept.includes('hàng không') || normPosName.includes('sản phẩm'))) return true;
      if (deptCode.includes('GUIDES') && (normPosName.includes('hướng dẫn') || normPosDept.includes('hướng dẫn') || normPosName.includes('guide'))) return true;
      if (deptCode.includes('SALES') && (normPosName.includes('tư vấn') || normPosName.includes('kinh doanh') || normPosName.includes('mice') || normPosName.includes('bán tour') || normPosName.includes('khách đoàn'))) return true;
      if (deptCode.includes('COMMERCIAL') && (normPosName.includes('b2b') || normPosName.includes('tiếp thị') || normPosName.includes('telesales'))) return true;
      if (deptCode.includes('FINANCE') && (normPosName.includes('thu ngân') || normPosName.includes('kế toán') || normPosName.includes('vé') || normPosName.includes('pos'))) return true;
      if ((deptCode.includes('LOGISTICS') || deptCode.includes('FLEET') || deptCode.includes('WAREHOUSE')) && (normPosName.includes('xe') || normPosName.includes('kho') || normPosName.includes('vật tư') || normPosName.includes('hậu cần'))) return true;
      if (deptCode.includes('BOD') && (normPosName.includes('giám đốc') || normPosName.includes('ceo'))) return true;

      return false;
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
    activeDepartments.forEach(d => {
      if (d.name.toLowerCase().includes(query) || d.manager.toLowerCase().includes(query) || d.code.toLowerCase().includes(query)) count++;
    });
    activePositions.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)) count++;
    });
    return count;
  }, [searchHighlight, activeDepartments, activePositions]);

  // Total system metrics
  const totalSystemHeadcount = activeDepartments.reduce((s, d) => s + d.headcount, 0) + (selectedBranch === 'ALL' || selectedBranch === 'Toàn Hệ Thống' ? 3 : 0);

  // Get Branch Badge Style
  const getBranchBadge = (branchName: string) => {
    if (branchName.includes('Hoàn Kiếm')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (branchName.includes('Quận 1')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (branchName.includes('Đà Nẵng')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (branchName.includes('Kho')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  // Render a Department Card with its positions
  const renderDepartmentCard = (dept: DepartmentItem, blockBadgeColor: string) => {
    const isDeptCollapsed = !!collapsedNodes[dept.id];
    const deptPositions = getPositionsForDept(dept.name, dept.code, dept.branch);
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
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-slate-400">{dept.code}</span>
              {selectedBranch === 'ALL' && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${getBranchBadge(dept.branch)}`}>
                  {dept.branch}
                </span>
              )}
              {isDeptMatched && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  Khớp
                </span>
              )}
            </div>
            <h5 className="font-bold text-slate-900 text-xs leading-snug mt-1">{dept.name}</h5>
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
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-semibold truncate">{pos.name}</span>
                  </div>
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

  // Branch Info for current view
  const currentBranchInfo = BRANCH_INFO[selectedBranch];

  return (
    <div className="space-y-4">
      {/* Chart Control Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Search Bar & Branch Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Filter Dropdown (Model 1 Core Feature) */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#dc0037] shrink-0" />
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              {branchOptions.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm phòng ban, vị trí, chức vụ..."
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
            • Quy mô: <strong>{totalSystemHeadcount} nhân sự</strong> ({activeDepartments.length} phòng)
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
            {/* ROOT NODE */}
            {selectedBranch === 'ALL' ? (
              // Macro Root Node: BOD Toàn Hệ Thống
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-5 rounded-2xl shadow-xl border border-slate-700 w-88 text-center relative hover:scale-102 transition-transform select-none">
                  <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold uppercase">
                    LEVEL 1 • TỐI CAO TOÀN CHUỖI
                  </span>
                  <h3 className="font-black text-base mt-1">Ban Giám Đốc & Hội Đồng Quản Trị</h3>
                  <p className="text-xs text-slate-300 mt-1 font-medium">Tổng Giám Đốc (CEO) & C-Level Toàn Hệ Thống</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex justify-between text-[11px] text-slate-400">
                    <span>
                      Quy mô chuỗi: <strong>{departments.length} Phòng Ban</strong>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {totalSystemHeadcount} Nhân sự
                    </span>
                  </div>
                </div>

                {/* Vertical Trunk coming down from BOD */}
                <div className="w-0.5 h-8 bg-slate-300" />
              </div>
            ) : (
              // Specific Branch Root Node (Model 1 Core)
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-xl border border-slate-700 w-92 text-center relative hover:scale-102 transition-transform select-none">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-300 font-bold uppercase">
                    {currentBranchInfo?.levelBadge || 'CƠ SỞ ĐỘC LẬP'}
                  </span>
                  <h3 className="font-black text-base mt-1">
                    {currentBranchInfo?.title || selectedBranch}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    {currentBranchInfo?.manager}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex justify-between text-[11px] text-slate-400">
                    <span>{currentBranchInfo?.quota}</span>
                    <span className="text-emerald-400 font-bold">Vận Hành Độc Lập</span>
                  </div>
                </div>

                <div className="w-0.5 h-8 bg-slate-300" />
              </div>
            )}

            {/* LEVEL 1: COLUMNS WITH MATHEMATICAL BUS CONNECTOR */}
            {selectedBranch === 'ALL' ? (
              // Macro View: 6 Functional Blocks
              <div className="flex justify-center items-start pt-0 min-w-max mx-auto">
                {blocks.map((block, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === blocks.length - 1;
                  const depts = activeDepartments.filter(d => d.level === block.levelKey);

                  return (
                    <div key={block.id} className="flex flex-col items-center relative px-3 w-68 sm:w-72">
                      <div className="w-full h-8 relative pointer-events-none">
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
            ) : (
              // Specific Branch View (Model 1): Departments of this branch directly as columns
              <div className="flex justify-center items-start pt-0 min-w-max mx-auto">
                {activeDepartments.map((dept, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === activeDepartments.length - 1;
                  const deptPositions = getPositionsForDept(dept.name, dept.code, dept.branch);

                  return (
                    <div key={dept.id} className="flex flex-col items-center relative px-3 w-72 sm:w-80">
                      <div className="w-full h-8 relative pointer-events-none">
                        {!isFirst && (
                          <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-slate-300" />
                        )}
                        {!isLast && (
                          <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-slate-300" />
                        )}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
                      </div>

                      {/* Department Card */}
                      <div className="w-full">
                        {renderDepartmentCard(dept, '#0ea5e9')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PHÂN CẤP 2 TẦNG (2-TIER CLUSTERED GRID) */}
      {viewMode === 'grid2' && (
        <div className="bg-[#faf9f6] border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs overflow-x-auto w-full">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            {/* ROOT NODE */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700 w-84 text-center relative select-none">
                <span className="text-[10px] font-mono tracking-widest text-rose-300 font-bold uppercase">
                  {selectedBranch === 'ALL' ? 'LEVEL 1 • TỐI CAO TOÀN CHUỖI' : (currentBranchInfo?.levelBadge || 'CƠ SỞ')}
                </span>
                <h3 className="font-black text-base mt-1">
                  {selectedBranch === 'ALL' ? 'Ban Giám Đốc & Hội Đồng Quản Trị' : currentBranchInfo?.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {selectedBranch === 'ALL' ? 'Tổng Giám Đốc (CEO) & C-Level' : currentBranchInfo?.manager}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex justify-between text-[11px] text-slate-400">
                  <span>Quy mô: <strong>{activeDepartments.length} Phòng Ban</strong></span>
                  <span className="text-emerald-400 font-bold">{totalSystemHeadcount} Nhân sự</span>
                </div>
              </div>

              <div className="w-0.5 h-8 bg-slate-300" />
            </div>

            {/* TIER 1: CORE BLOCKS */}
            <div className="w-full">
              <div className="text-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Tầng 1 • Khối Nghiệp Vụ Trọng Tâm & Y Khoa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0">
                {blocks.slice(0, 3).map((block, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === 2;
                  const depts = activeDepartments.filter(d => d.level === block.levelKey);

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

            {/* TIER 2: SUPPORT BLOCKS */}
            <div className="w-full">
              <div className="text-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Tầng 2 • Khối Kinh Doanh, Tài Chính & Kho Vận
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0">
                {blocks.slice(3, 6).map((block, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === 2;
                  const depts = activeDepartments.filter(d => d.level === block.levelKey);

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
                  {selectedBranch === 'ALL' ? 'Cấp Lãnh Đạo Tối Cao Toàn Chuỗi' : currentBranchInfo?.levelBadge}
                </span>
                <h4 className="font-bold text-sm">
                  {selectedBranch === 'ALL' ? 'Ban Giám Đốc & Hội Đồng Quản Trị (BOD)' : currentBranchInfo?.title}
                </h4>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-emerald-400 font-bold">{totalSystemHeadcount} Nhân sự</span>
              <span className="text-slate-400 block text-[11px]">{activeDepartments.length} Phòng Ban</span>
            </div>
          </div>

          {/* Directory Hierarchy Branches */}
          <div className="space-y-4 border-l-2 border-slate-300 ml-4 pl-4 sm:pl-6">
            {blocks.map(block => {
              const depts = activeDepartments.filter(d => d.level === block.levelKey);
              if (depts.length === 0) return null;

              const isBlockCollapsed = !!collapsedNodes[block.id];
              const BlockIcon = block.icon;
              const blockHeadcount = depts.reduce((s, d) => s + d.headcount, 0);

              return (
                <div key={block.id} className="relative space-y-2">
                  <div className="absolute -left-4 sm:-left-6 top-5 w-4 sm:w-6 h-0.5 bg-slate-300" />

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
                        const deptPositions = getPositionsForDept(dept.name, dept.code, dept.branch);

                        return (
                          <div key={dept.id} className="relative space-y-1.5">
                            <div className="absolute -left-4 sm:-left-6 top-4 w-4 sm:w-6 h-0.5 bg-slate-200" />

                            <div
                              onClick={() => toggleNode(dept.id)}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition select-none"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {dept.code}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${getBranchBadge(dept.branch)}`}>
                                  {dept.branch}
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
