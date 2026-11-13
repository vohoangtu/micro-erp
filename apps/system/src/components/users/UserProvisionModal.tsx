'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  Building2,
  Network,
  Phone,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';

export interface UnprovisionedEmployee {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  citizenId?: string;
  workEmail: string;
  branchName: string;
  deptName: string;
  status: string;
  joinDate?: string;
}

interface UserProvisionModalProps {
  isOpen: boolean;
  unprovisionedEmployees: UnprovisionedEmployee[];
  themeColorHex: string;
  onClose: () => void;
  onProvision: (data: {
    employeeId: string;
    email: string;
    password?: string;
    role: string;
    allowedModules: string[];
    mustChangePassword: boolean;
  }) => Promise<boolean | void>;
}

const AVAILABLE_MODULES = [
  { id: 'pos', name: 'ERP / POS Bán Hàng', desc: 'Quầy thu ngân, quét VietQR và xuất hóa đơn' },
  { id: 'booking', name: 'Booking & Lịch Hẹn', desc: 'Đặt tour, giữ chỗ chuyến bay và dịch vụ' },
  { id: 'crm', name: 'CRM & Khách Hàng', desc: 'Hồ sơ du khách, lịch sử tour và chăm sóc CSKH' },
  { id: 'hr', name: 'Nhân Sự HR & Bảng Lương', desc: 'Hồ sơ nhân viên, chấm công và tính lương' },
  { id: 'bi', name: 'Báo Cáo & Quản Trị BI', desc: 'Dashboard doanh thu, P&L chi nhánh toàn chuỗi' },
  { id: 'ai', name: 'AI Copilot 2026', desc: 'Trợ lý AI thiết kế lịch trình tour & tư vấn khách hàng' },
  { id: 'system', name: 'Tháp Điều Khiển Hệ Thống', desc: 'Cấu hình cơ cấu tổ chức, người dùng và bảo mật' }
];

export function UserProvisionModal({
  isOpen,
  unprovisionedEmployees,
  themeColorHex,
  onClose,
  onProvision
}: UserProvisionModalProps) {
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [role, setRole] = useState<string>('STAFF');
  const [allowedModules, setAllowedModules] = useState<string[]>(['pos', 'booking']);
  const [initialPassword, setInitialPassword] = useState<string>('Travel@2026');
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (unprovisionedEmployees.length > 0) {
        const first = unprovisionedEmployees[0];
        setSelectedEmpId(first.id);
        setLoginEmail(first.workEmail || `${first.code.toLowerCase()}@viettravel.vn`);
        inferRoleAndModules(first.deptName, first.code);
      } else {
        setSelectedEmpId('');
        setLoginEmail('');
      }
      setInitialPassword('Travel@2026');
      setMustChangePassword(true);
    }
  }, [isOpen, unprovisionedEmployees]);

  const selectedEmployee = unprovisionedEmployees.find(e => e.id === selectedEmpId);

  const inferRoleAndModules = (dept: string, code: string) => {
    if (dept.includes('Ban Giám Đốc') || code.includes('BOD')) {
      setRole('SUPER_ADMIN');
      setAllowedModules(['crm', 'booking', 'pos', 'hr', 'bi', 'ai', 'system']);
    } else if (dept.includes('Giám Đốc') || dept.includes('Chi Nhánh')) {
      setRole('BRANCH_MANAGER');
      setAllowedModules(['crm', 'booking', 'pos', 'hr', 'bi']);
    } else if (dept.includes('Điều Hành')) {
      setRole('TOUR_OPERATOR');
      setAllowedModules(['booking', 'crm', 'ai']);
    } else if (dept.includes('Kế Toán') || dept.includes('Thu Ngân')) {
      setRole('TICKETING_POS');
      setAllowedModules(['pos', 'booking']);
    } else if (dept.includes('Hướng Dẫn Viên')) {
      setRole('TOUR_LEADER');
      setAllowedModules(['booking']);
    } else if (dept.includes('Kinh Doanh') || dept.includes('M.I.C.E')) {
      setRole('MICE_CONSULTANT');
      setAllowedModules(['crm', 'booking', 'pos']);
    } else {
      setRole('STAFF');
      setAllowedModules(['pos', 'booking']);
    }
  };

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    setErrorMessage(null);
    const emp = unprovisionedEmployees.find(e => e.id === empId);
    if (emp) {
      setLoginEmail(emp.workEmail || `${emp.code.toLowerCase()}@viettravel.vn`);
      inferRoleAndModules(emp.deptName, emp.code);
    }
  };

  const toggleModule = (modId: string) => {
    setAllowedModules(prev =>
      prev.includes(modId) ? prev.filter(m => m !== modId) : [...prev, modId]
    );
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInitialPassword(`Travel@${rand}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) {
      setErrorMessage('Vui lòng chọn nhân viên công ty cần cấp phát tài khoản!');
      return;
    }
    if (!loginEmail || !loginEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập định dạng email đăng nhập hợp lệ!');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onProvision({
        employeeId: selectedEmpId,
        email: loginEmail,
        password: initialPassword,
        role,
        allowedModules,
        mustChangePassword
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra trong quá trình cấp phát tài khoản!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: themeColorHex }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cấp Phát Tài Khoản Truy Cập Hệ Thống</h3>
              <p className="text-xs text-slate-400">
                Điều kiện: Chỉ cấp phát cho nhân sự chính thức của tập đoàn đã có hồ sơ trong Phân hệ HR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {unprovisionedEmployees.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Toàn Bộ Nhân Sự Đã Được Cấp Phát!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Tất cả nhân viên đang làm việc (ACTIVE) trong Phân hệ HR đều đã sở hữu tài khoản đăng nhập hệ thống. Để cấp phát tài khoản mới, vui lòng tiếp nhận thêm nhân sự mới trong App HR trước.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Bước 1: Chọn Nhân Sự Từ HR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">1</span>
                  Chọn Nhân Viên Công Ty (Từ Phân Hệ HR) *
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {unprovisionedEmployees.length} nhân sự sẵn sàng cấp phát
                </span>
              </div>

              <select
                value={selectedEmpId}
                onChange={e => handleSelectEmployee(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                {unprovisionedEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    [{emp.code}] {emp.fullName} — {emp.deptName} ({emp.branchName})
                  </option>
                ))}
              </select>

              {/* Preview Card của Nhân Viên được chọn */}
              {selectedEmployee && (
                <div className="p-3.5 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {selectedEmployee.fullName.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{selectedEmployee.fullName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                          {selectedEmployee.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {selectedEmployee.status === 'PROBATION' ? 'Thử việc' : 'Đang làm việc'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" /> {selectedEmployee.branchName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Network className="w-3 h-3 text-slate-400" /> {selectedEmployee.deptName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {selectedEmployee.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg shrink-0">
                    ✓ Hồ sơ HR hợp lệ
                  </span>
                </div>
              )}
            </div>

            {/* Bước 2: Cấu Hình Tài Khoản Truy Cập Hệ Thống */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">2</span>
                Thiết Lập Tài Khoản & Phân Quyền Truy Cập
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Đăng Nhập */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Email / Tên Đăng Nhập Hệ Thống *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="VD: nhanvien@viettravel.vn"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Vai Trò Hệ Thống */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Vai Trò Quyền Hạn (System Role) *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN — Quản trị viên tối cao toàn chuỗi</option>
                    <option value="BRANCH_MANAGER">BRANCH_MANAGER — Giám đốc Chi nhánh / Cơ sở</option>
                    <option value="DEPT_HEAD">DEPT_HEAD — Trưởng Phòng Ban Chuyên Môn</option>
                    <option value="TOUR_OPERATOR">TOUR_OPERATOR — Chuyên Viên Điều Hành Tour Outbound/Inbound</option>
                    <option value="TICKETING_POS">TICKETING_POS — Chuyên Viên Vé & Thu Ngân Quầy POS</option>
                    <option value="TOUR_LEADER">TOUR_LEADER — Hướng Dẫn Viên Du Lịch Quốc Tế</option>
                    <option value="MICE_CONSULTANT">MICE_CONSULTANT — Chuyên Viên Tư Vấn Tour Đoàn & VIP</option>
                    <option value="ACCOUNTANT">ACCOUNTANT — Kế Toán Tài Chính & Công Nợ</option>
                    <option value="STAFF">STAFF — Nhân Viên Nghiệp Vụ Cơ Bản</option>
                  </select>
                </div>
              </div>

              {/* Mật Khẩu Khởi Tạo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mật Khẩu Ban Đầu (Initial Password) *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={initialPassword}
                      onChange={e => setInitialPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tạo Mật Khẩu Ngẫu Nhiên</span>
                  </button>
                </div>
              </div>

              {/* Cờ Bắt Buộc Đổi Mật Khẩu */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="mustChangePass"
                  checked={mustChangePassword}
                  onChange={e => setMustChangePassword(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-[#dc0037]"
                />
                <label htmlFor="mustChangePass" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Bắt buộc đổi mật khẩu ở lần đăng nhập đầu tiên (Bảo mật tiêu chuẩn)
                </label>
              </div>

              {/* Phân Quyền Phân Hệ ERP (Module Access) */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2">
                  Phân Quyền Truy Cập Các Phân Hệ ERP (7 Phân Hệ)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_MODULES.map(mod => {
                    const isChecked = allowedModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 mt-0.5 rounded-sm text-emerald-600 pointer-events-none"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-xs block text-slate-800">{mod.name}</span>
                          <span className="text-[10px] text-slate-500 leading-tight block">{mod.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 flex items-center gap-1.5"
                style={{ backgroundColor: themeColorHex }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang Cấp Phát...' : 'Xác Nhận Cấp Phát Tài Khoản'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
