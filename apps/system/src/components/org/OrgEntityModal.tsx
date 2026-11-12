'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Building2, Award, Briefcase, Layers, Clock } from 'lucide-react';

export type OrgEntityType = 'department' | 'post' | 'title' | 'position' | 'type';

export interface OrgEntityModalProps {
  isOpen: boolean;
  type: OrgEntityType;
  initialData?: any;
  branches: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  jobPosts: Array<{ id: string; name: string; level: number }>;
  jobTitles: Array<{ id: string; name: string }>;
  themeColorHex: string;
  onClose: () => void;
  onSave: (type: OrgEntityType, data: any) => void;
}

export function OrgEntityModal({
  isOpen,
  type,
  initialData,
  branches,
  departments,
  jobPosts,
  jobTitles,
  themeColorHex,
  onClose,
  onSave
}: OrgEntityModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default initial states based on type
      if (type === 'department') {
        setFormData({
          code: `DEPT-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          name: '',
          manager: '',
          branch: branches[0]?.name || 'Toàn Hệ Thống',
          level: 'Khối Vận Hành',
          headcount: 0
        });
      } else if (type === 'post') {
        setFormData({
          code: `POST-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          name: '',
          level: 4,
          allowance: '2.500.000 đ',
          desc: ''
        });
      } else if (type === 'title') {
        setFormData({
          code: `TITLE-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          name: '',
          field: 'Da Liễu & Y Khoa Thẩm Mỹ',
          cert: ''
        });
      } else if (type === 'position') {
        setFormData({
          code: `POS-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          name: '',
          branch: branches[0]?.name || 'Cơ sở Hoàn Kiếm',
          dept: departments[0]?.name || 'Khối Bác Sĩ & Điều Trị',
          quota: 2,
          current: 0,
          salaryRange: '12M - 20M đ'
        });
      } else if (type === 'type') {
        setFormData({
          code: `EMP-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          name: '',
          hours: 44,
          insurance: true,
          leave: 12,
          desc: ''
        });
      }
    }
    setErrors({});
  }, [isOpen, type, initialData, branches, departments]);

  if (!isOpen) return null;

  const getTitle = () => {
    const isEdit = !!initialData?.id;
    switch (type) {
      case 'department':
        return isEdit ? 'Chỉnh Sửa Phòng Ban / Khối' : 'Thêm Mới Phòng Ban / Khối';
      case 'post':
        return isEdit ? 'Chỉnh Sửa Chức Vụ Hành Chính' : 'Thêm Mới Chức Vụ Cấp 1-5';
      case 'title':
        return isEdit ? 'Chỉnh Sửa Chức Danh Kỹ Thuật' : 'Thêm Mới Chức Danh Chuyên Môn';
      case 'position':
        return isEdit ? 'Chỉnh Sửa Vị Trí & Định Biên' : 'Thêm Mới Vị Trí Công Việc & Định Biên';
      case 'type':
        return isEdit ? 'Chỉnh Sửa Tính Chất Công Việc' : 'Thêm Mới Tính Chất & Phúc Lợi';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'department':
        return Building2;
      case 'post':
        return Award;
      case 'title':
        return Briefcase;
      case 'position':
        return Layers;
      case 'type':
        return Clock;
    }
  };

  const Icon = getIcon();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!formData.code?.trim()) newErrors.code = 'Vui lòng nhập mã định danh';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(type, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: themeColorHex }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{getTitle()}</h3>
              <p className="text-xs text-slate-400">Cấu hình tham số chuẩn hóa cho toàn chuỗi ERP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mã & Tên */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Mã Định Danh *</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: DEPT-01"
                className={`w-full bg-slate-50 border ${
                  errors.code ? 'border-rose-400' : 'border-slate-200'
                } rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden`}
              />
              {errors.code && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.code}</span>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Tên Hiển Thị *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Phòng Chăm Sóc Khách Hàng VIP"
                className={`w-full bg-slate-50 border ${
                  errors.name ? 'border-rose-400' : 'border-slate-200'
                } rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden`}
              />
              {errors.name && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.name}</span>}
            </div>
          </div>

          {/* Conditional Fields based on Entity Type */}
          {type === 'department' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Trực Thuộc Khối</label>
                  <select
                    value={formData.level || 'Khối Vận Hành'}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                  >
                    <option value="Khối Quản Trị">Khối Quản Trị (BOD)</option>
                    <option value="Khối Chuyên Môn">Khối Chuyên Môn & Y Khoa</option>
                    <option value="Khối Vận Hành">Khối Vận Hành & Spa</option>
                    <option value="Khối Kinh Doanh">Khối Kinh Doanh & CRM</option>
                    <option value="Khối Tài Chính">Khối Tài Chính — POS</option>
                    <option value="Khối Hậu Cần">Khối Hậu Cần & Kho Vận</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Cơ Sở Trực Thuộc</label>
                  <select
                    value={formData.branch || 'Toàn Hệ Thống'}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                  >
                    <option value="Toàn Hệ Thống">Toàn Hệ Thống (Trụ sở chính)</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Trưởng Đơn Vị / Phụ Trách</label>
                <input
                  type="text"
                  value={formData.manager || ''}
                  onChange={e => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="VD: BS. CKI Nguyễn Tuấn Anh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {type === 'post' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Cấp Bậc Hành Chính (Level)</label>
                <select
                  value={formData.level || 4}
                  onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value={1}>Level 1 — Ban Giám Đốc (BOD / C-Level)</option>
                  <option value={2}>Level 2 — Giám Đốc Chi Nhánh / Cơ Sở</option>
                  <option value={3}>Level 3 — Trưởng Phòng Chuyên Môn</option>
                  <option value={4}>Level 4 — Phó Phòng / Team Leader</option>
                  <option value={5}>Level 5 — Chuyên Viên / Nhân Viên</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Phụ Cấp Trách Nhiệm</label>
                <input
                  type="text"
                  value={formData.allowance || ''}
                  onChange={e => setFormData({ ...formData, allowance: e.target.value })}
                  placeholder="VD: 5.000.000 đ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mô Tả Quyền Hạn</label>
                <textarea
                  rows={2}
                  value={formData.desc || ''}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="VD: Phụ trách chuyên môn phòng ban, duyệt phân ca trực và đề xuất tuyển dụng"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {type === 'title' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Lĩnh Vực Chuyên Môn</label>
                <input
                  type="text"
                  value={formData.field || ''}
                  onChange={e => setFormData({ ...formData, field: e.target.value })}
                  placeholder="VD: Laser & Thiết Bị Y Tế Thẩm Mỹ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Yêu Cầu Chứng Chỉ / CCHN</label>
                <textarea
                  rows={2}
                  value={formData.cert || ''}
                  onChange={e => setFormData({ ...formData, cert: e.target.value })}
                  placeholder="VD: CCHN Bác sĩ Da liễu, >= 3 năm kinh nghiệm Laser công nghệ cao"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {type === 'position' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Cơ Sở / Chi Nhánh Áp Dụng</label>
                  <select
                    value={formData.branch || 'Toàn Hệ Thống'}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
                  >
                    <option value="Toàn Hệ Thống">Toàn Hệ Thống (HQ)</option>
                    <option value="Cơ sở Hoàn Kiếm">Cơ sở Hoàn Kiếm (HN)</option>
                    <option value="Chi Nhánh Quận 1">Chi Nhánh Quận 1 (TP. HCM)</option>
                    <option value="Chi Nhánh Đà Nẵng">Chi Nhánh Đà Nẵng</option>
                    <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Thuộc Phòng Ban / Khối</label>
                  <select
                    value={formData.dept || ''}
                    onChange={e => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Định Biên Tiêu Chuẩn (Quota)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.quota || 1}
                    onChange={e => setFormData({ ...formData, quota: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nhân Sự Hiện Có (Thực Tế)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.current || 0}
                    onChange={e => setFormData({ ...formData, current: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Dải Lương Khung (Min - Max)</label>
                <input
                  type="text"
                  value={formData.salaryRange || ''}
                  onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                  placeholder="VD: 15M - 25M đ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {type === 'type' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Giờ Làm Chuẩn / Tuần</label>
                  <input
                    type="number"
                    min={8}
                    max={60}
                    value={formData.hours || 44}
                    onChange={e => setFormData({ ...formData, hours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Ngày Phép Năm Có Lương</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.leave || 12}
                    onChange={e => setFormData({ ...formData, leave: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  checked={formData.insurance ?? true}
                  onChange={e => setFormData({ ...formData, insurance: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#dc0037]"
                />
                <label htmlFor="hasInsurance" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Đóng Bảo Hiểm Xã Hội & Y Tế Bắt Buộc (BHXH / BHYT 10.5%)
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mô Tả Tính Chất & Chế Độ</label>
                <textarea
                  rows={2}
                  value={formData.desc || ''}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="VD: HĐLĐ chính thức không xác định thời hạn, hưởng đầy đủ phúc lợi lễ tết"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90 active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeColorHex }}
            >
              <Check className="w-4 h-4" />
              <span>{initialData?.id ? 'Lưu Thay Đổi' : 'Thêm Mới Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
