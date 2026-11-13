'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Search,
  Plus,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Network,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  UserPlus,
  Mail,
  UserCheck
} from 'lucide-react';
import { UnprovisionedEmployee } from './UserProvisionModal';

export interface SystemUserItem {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string;
  createdAt: string;
  allowedModules: string[];
  isLinkedWithHR: boolean;
  employee: {
    id: string;
    code: string;
    fullName: string;
    phone: string;
    citizenId: string;
    workEmail: string;
    branchName: string;
    deptName: string;
    status: string;
  } | null;
}

interface UserManagerProps {
  users: SystemUserItem[];
  unprovisionedEmployees: UnprovisionedEmployee[];
  totalEmployees: number;
  themeColorHex: string;
  onOpenProvisionModal: (empId?: string) => void;
  onToggleLock: (id: string) => void;
  onResetPassword: (id: string) => void;
  onRevoke: (id: string, name: string) => void;
}

export function UserManager({
  users,
  unprovisionedEmployees,
  totalEmployees,
  themeColorHex,
  onOpenProvisionModal,
  onToggleLock,
  onResetPassword,
  onRevoke
}: UserManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'locked' | 'unprovisioned'>('all');

  const branches = ['ALL', 'Trụ Sở Hoàn Kiếm (Hà Nội)', 'Chi Nhánh Quận 1 (TP. HCM)', 'Chi Nhánh Hải Châu (Đà Nẵng)', 'Trung Tâm Quản Lý Xe Du Lịch'];

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.employee?.code && u.employee.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.employee?.branchName && u.employee.branchName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.employee?.deptName && u.employee.deptName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    const branchName = u.employee?.branchName || '';
    const matchBranch = filterBranch === 'ALL' || branchName.includes(filterBranch) || filterBranch.includes(branchName);
    const matchRole = filterRole === 'ALL' || u.role === filterRole;

    if (activeTab === 'active') return matchSearch && matchBranch && matchRole && u.isActive;
    if (activeTab === 'locked') return matchSearch && matchBranch && matchRole && !u.isActive;
    return matchSearch && matchBranch && matchRole;
  });

  const filteredUnprovisioned = unprovisionedEmployees.filter(e => {
    return (
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.deptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.branchName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleExportCSV = () => {
    const headers = [
      'Email Đăng Nhập',
      'Mã Nhân Viên (HR)',
      'Họ Và Tên',
      'Số Điện Thoại',
      'Cơ Sở Trực Thuộc',
      'Phòng Ban',
      'Vai Trò Hệ Thống',
      'Phân Hệ Được Cấp',
      'Trạng Thái',
      'Đăng Nhập Lần Cuối'
    ];
    const rows = filteredUsers.map(u => [
      u.email,
      u.employee?.code || 'Chưa liên kết HR',
      u.fullName,
      u.employee?.phone || '',
      u.employee?.branchName || 'Toàn Hệ Thống',
      u.employee?.deptName || 'Khối Quản Trị',
      u.role,
      u.allowedModules.join('; '),
      u.isActive ? 'Hoạt động' : 'Đang khóa',
      u.lastLoginAt
    ]);
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Tai_Khoan_He_Thong_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'BRANCH_MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEPT_HEAD':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'TOUR_OPERATOR':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'TICKETING_POS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TOUR_LEADER':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Thống Kê Cấp Phát Danh Tính (IAM Metrics Ribbon) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng Nhân Sự Công Ty (HR)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalEmployees}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Hồ sơ chính thức từ Phân hệ HR</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tài Khoản Đã Cấp Phát</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{users.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {totalEmployees > 0 ? `${Math.round((users.length / totalEmployees) * 100)}% nhân sự đã có tài khoản` : '100%'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nhân Sự Chờ Cấp Phát</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{unprovisionedEmployees.length}</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Sẵn sàng cấp quyền hệ thống</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tài Khoản Đang Khóa</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{users.filter(u => !u.isActive).length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Ngưng quyền truy cập</span>
        </div>
      </div>

      {/* 2. Thanh Tabs Chuyển Đổi & Bộ Lọc Điều Khiển */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tất Cả Tài Khoản ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đang Hoạt Động ({users.filter(u => u.isActive).length})
            </button>
            <button
              onClick={() => setActiveTab('locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'locked' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đang Tạm Khóa ({users.filter(u => !u.isActive).length})
            </button>
            <button
              onClick={() => setActiveTab('unprovisioned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'unprovisioned' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Chờ Cấp Phát HR ({unprovisionedEmployees.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất Excel</span>
            </button>
            <button
              onClick={() => onOpenProvisionModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeColorHex }}
            >
              <Plus className="w-4 h-4" />
              <span>Cấp Phát Tài Khoản Mới</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo email, họ tên, mã NV, chi nhánh..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={filterBranch}
              onChange={e => setFilterBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Tất cả chi nhánh / cơ sở</option>
              <option value="Hoàn Kiếm">Trụ sở Hoàn Kiếm (Hà Nội)</option>
              <option value="Quận 1">Chi nhánh Quận 1 (TP. HCM)</option>
              <option value="Hải Châu">Chi nhánh Hải Châu (Đà Nẵng)</option>
              <option value="Xe Du Lịch">Trung tâm xe & Kho tổng</option>
            </select>
          </div>

          <div>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Tất cả vai trò hệ thống</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Quản trị viên tối cao)</option>
              <option value="BRANCH_MANAGER">BRANCH_MANAGER (Giám đốc chi nhánh)</option>
              <option value="DEPT_HEAD">DEPT_HEAD (Trưởng phòng ban)</option>
              <option value="TOUR_OPERATOR">TOUR_OPERATOR (Điều hành tour)</option>
              <option value="TICKETING_POS">TICKETING_POS (Thu ngân & Vé GDS)</option>
              <option value="TOUR_LEADER">TOUR_LEADER (Hướng dẫn viên)</option>
              <option value="MICE_CONSULTANT">MICE_CONSULTANT (Kinh doanh MICE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH TÀI KHOẢN (HOẶC DANH SÁCH CHỜ CẤP PHÁT) */}
      {activeTab === 'unprovisioned' ? (
        /* View Danh Sách Nhân Sự Chờ Cấp Tài Khoản */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Danh Sách Nhân Sự Đang Làm Việc Chưa Cấp Tài Khoản Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Dữ liệu đồng bộ trực tiếp từ Phân hệ HR. Nhấn nút Cấp Tài Khoản để cấp quyền truy cập hệ thống ngay.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg">
              {filteredUnprovisioned.length} nhân sự
            </span>
          </div>

          {filteredUnprovisioned.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Không tìm thấy nhân sự phù hợp với điều kiện tìm kiếm.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã NV & Họ Tên</th>
                    <th className="py-3 px-4">Liên Hệ / Email HR</th>
                    <th className="py-3 px-4">Cơ Sở Trực Thuộc</th>
                    <th className="py-3 px-4">Phòng Ban Công Tác</th>
                    <th className="py-3 px-4 text-center">Trạng Thái HR</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUnprovisioned.map(emp => (
                    <tr key={emp.id} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {emp.fullName.split(' ').slice(-1)[0][0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{emp.fullName}</span>
                            <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                              {emp.code}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 block">{emp.workEmail}</span>
                        <span className="text-slate-400 text-[11px]">{emp.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{emp.branchName}</td>
                      <td className="py-3 px-4 text-slate-600">{emp.deptName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {emp.status === 'PROBATION' ? 'Thử việc' : 'Đang làm việc'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onOpenProvisionModal(emp.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 flex items-center gap-1 mx-auto"
                          style={{ backgroundColor: themeColorHex }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Cấp Tài Khoản</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* View Danh Sách Tài Khoản Hệ Thống Đã Cấp */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Danh Mục Tài Khoản Truy Cập Hệ Thống (IAM)</h3>
              <p className="text-xs text-slate-500">
                Mỗi tài khoản được liên kết 1-1 với nhân viên chính thức trong Phân hệ HR. Thông tin tổ chức được đồng bộ tự động.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {filteredUsers.length} tài khoản
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">Không tìm thấy tài khoản nào khớp với bộ lọc.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Tài Khoản / Email</th>
                    <th className="py-3 px-4">Nhân Viên Liên Kết (HR)</th>
                    <th className="py-3 px-4">Cơ Sở & Phòng Ban</th>
                    <th className="py-3 px-4">Vai Trò & Quyền Hạn</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => {
                    const emp = user.employee;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition">
                        {/* Cột 1: Tài Khoản / Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                              {user.fullName.split(' ').slice(-1)[0][0]}
                            </div>
                            <div>
                              <span className="font-mono font-bold text-slate-900 block text-xs">{user.email}</span>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>Đăng nhập: {user.lastLoginAt}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Nhân Viên Liên Kết (HR) */}
                        <td className="py-3.5 px-4">
                          {emp ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800">{emp.fullName}</span>
                                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                                  {emp.code}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                <span>ĐT: {emp.phone}</span>
                                <span className="text-emerald-600 font-semibold text-[10px]">✓ Đã xác thực HR</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-slate-800">{user.fullName}</span>
                              <span className="text-[10px] text-amber-600 block">Root System Account</span>
                            </div>
                          )}
                        </td>

                        {/* Cột 3: Cơ Sở & Phòng Ban */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {emp?.branchName || 'Toàn Hệ Thống'}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {emp?.deptName || 'Khối Quản Trị'}
                          </span>
                        </td>

                        {/* Cột 4: Vai Trò & Quyền Hạn */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {user.allowedModules.length} phân hệ ERP được cấp
                          </div>
                        </td>

                        {/* Cột 5: Trạng Thái */}
                        <td className="py-3.5 px-4 text-center">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Hoạt Động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Bị Khóa
                            </span>
                          )}
                        </td>

                        {/* Cột 6: Thao Tác Quản Trị */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Nút Khóa / Mở Khóa */}
                            <button
                              onClick={() => onToggleLock(user.id)}
                              title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              className={`p-1.5 rounded-lg transition ${
                                user.isActive
                                  ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                              }`}
                            >
                              {user.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            {/* Nút Đặt Lại Mật Khẩu */}
                            <button
                              onClick={() => onResetPassword(user.id)}
                              title="Đặt lại mật khẩu khởi tạo"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Thu Hồi Tài Khoản */}
                            {user.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => onRevoke(user.id, user.email)}
                                title="Thu hồi tài khoản khỏi hệ thống"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
