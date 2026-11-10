'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  GitFork,
  Network,
  ShieldCheck,
  Server,
  Key,
  QrCode,
  MessageSquare,
  FileText,
  Bot,
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Layers,
  Award,
  Clock,
  Briefcase,
  Check,
  ChevronRight,
  HardDrive,
  Cpu,
  Activity,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  ShieldAlert,
  Send
} from 'lucide-react';
import { UniversalTopbar } from '@erp/ui';

// Mock Data for Initial State (Synced with Seed Data)
const INITIAL_BRANCHES = [
  {
    id: 'br-1',
    code: 'BR-HN-01',
    name: 'BHN Clinic & Spa — Trụ Sở Hoàn Kiếm (Hà Nội)',
    phone: '024 3828 2026',
    address: 'Số 68 Phố Tràng Thi, Hàng Trống, Hoàn Kiếm, Hà Nội',
    managerName: 'Trần Hương Giang',
    headcount: 24,
    revenueToday: '84.500.000 đ',
    isActive: true
  },
  {
    id: 'br-2',
    code: 'BR-HCM-01',
    name: 'BHN Wellness Center — Chi Nhánh Quận 1 (TP. HCM)',
    phone: '028 3910 2026',
    address: 'Số 120 Đường Lê Duẩn, Bến Nghé, Quận 1, TP. HCM',
    managerName: 'Võ Minh Quân',
    headcount: 18,
    revenueToday: '62.000.000 đ',
    isActive: true
  },
  {
    id: 'br-3',
    code: 'BR-DN-01',
    name: 'BHN Aesthetic Clinic — Chi Nhánh Hải Châu (Đà Nẵng)',
    phone: '0236 3848 2026',
    address: 'Số 86 Đường Bạch Đằng, Hải Châu 1, Đà Nẵng',
    managerName: 'Đặng Thảo Vy',
    headcount: 12,
    revenueToday: '38.200.000 đ',
    isActive: true
  }
];

const INITIAL_DEPARTMENTS = [
  {
    id: 'd-1',
    code: 'DEPT-BOD',
    name: 'Ban Giám Đốc & Điều Hành Chiến Lược',
    manager: 'Tổng Giám Đốc',
    branch: 'Toàn Hệ Thống',
    headcount: 3,
    level: 'Khối Quản Trị'
  },
  {
    id: 'd-2',
    code: 'DEPT-CLINIC',
    name: 'Khối Bác Sĩ & Điều Trị Da Chuyên Sâu',
    manager: 'BS. CKI Nguyễn Tuấn Anh',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 6,
    level: 'Khối Chuyên Môn'
  },
  {
    id: 'd-3',
    code: 'DEPT-SPA-THERAPY',
    name: 'Khối Kỹ Thuật Viên & Trị Liệu Spa',
    manager: 'Hoàng Mai Phương',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 12,
    level: 'Khối Vận Hành'
  },
  {
    id: 'd-4',
    code: 'DEPT-SALES-CSKH',
    name: 'Phòng Tư Vấn Thẩm Mỹ & Chăm Sóc Khách Hàng (CRM)',
    manager: 'Lê Thu Thảo',
    branch: 'Toàn Hệ Thống',
    headcount: 8,
    level: 'Khối Kinh Doanh'
  },
  {
    id: 'd-5',
    code: 'DEPT-FINANCE-POS',
    name: 'Phòng Kế Toán — Thu Ngân POS',
    manager: 'Nguyễn Thị Minh Hạnh',
    branch: 'Toàn Hệ Thống',
    headcount: 5,
    level: 'Khối Tài Chính'
  },
  {
    id: 'd-6',
    code: 'DEPT-WAREHOUSE',
    name: 'Phòng Kho Dược Mỹ Phẩm & Thiết Bị Y Tế',
    manager: 'Trịnh Quốc Bảo',
    branch: 'Kho Tổng Hà Nội',
    headcount: 4,
    level: 'Khối Hậu Cần'
  }
];

const INITIAL_JOB_POSTS = [
  { id: 'p-1', code: 'POST-BOD', name: 'Tổng Giám Đốc (CEO / C-Level)', level: 1, allowance: '20.000.000 đ', desc: 'Lãnh đạo chiến lược tối cao và phân quyền' },
  { id: 'p-2', code: 'POST-BRANCH-DIR', name: 'Giám Đốc Chi Nhánh / Quản Lý Cơ Sở', level: 2, allowance: '10.000.000 đ', desc: 'Chịu trách nhiệm toàn diện doanh số và vận hành cơ sở' },
  { id: 'p-3', code: 'POST-DEPT-HEAD', name: 'Trưởng Phòng Chuyên Môn', level: 3, allowance: '5.000.000 đ', desc: 'Phụ trách chuyên môn phòng ban và phân ca' },
  { id: 'p-4', code: 'POST-TEAM-LEAD', name: 'Phó Phòng / Trưởng Nhóm (Team Leader / Shift Leader)', level: 4, allowance: '2.500.000 đ', desc: 'Giám sát trực tiếp ca trị liệu và hỗ trợ giải quyết sự cố' },
  { id: 'p-5', code: 'POST-STAFF', name: 'Chuyên Viên / Nhân Viên Thực Thi', level: 5, allowance: '0 đ', desc: 'Nhân sự thực thi ca dịch vụ hoặc nghiệp vụ' }
];

const INITIAL_JOB_TITLES = [
  { id: 't-1', code: 'TITLE-DERMA-DOC', name: 'Bác Sĩ Chuyên Khoa Da Liễu CKI', field: 'Da Liễu & Y Khoa Thẩm Mỹ', cert: 'CCHN Bác sĩ Da liễu, >= 5 năm Laser' },
  { id: 't-2', code: 'TITLE-SENIOR-THERAPIST', name: 'Chuyên Viên Vận Hành Máy Laser Công Nghệ Cao', field: 'Laser & Thiết Bị Y Tế', cert: 'Chứng chỉ an toàn bức xạ Laser Picosecond' },
  { id: 't-3', code: 'TITLE-SPA-THERAPIST', name: 'Kỹ Thuật Viên Spa & Chăm Sóc Da Trưởng', field: 'Spa & Chăm Sóc Sắc Đẹp', cert: 'Chứng chỉ nghề Thẩm mỹ, Massage bấm huyệt' },
  { id: 't-4', code: 'TITLE-BEAUTY-CONSULTANT', name: 'Chuyên Viên Tư Vấn Thẩm Mỹ Cao Cấp', field: 'Tư Vấn & Kinh Doanh', cert: 'Kỹ năng phác đồ dược mỹ phẩm cao cấp' },
  { id: 't-5', code: 'TITLE-LEAD-CASHIER', name: 'Thu Ngân Trưởng & Kế Toán Quầy POS', field: 'Tài Chính & Kế Toán', cert: 'Bằng Kế toán, nghiệp vụ VietQR NAPAS 247' }
];

const INITIAL_JOB_POSITIONS = [
  { id: 'pos-1', code: 'POS-DOC-LEAD', name: 'Bác Sĩ Trưởng Ca Trị Liệu Da Liễu', dept: 'Khối Bác Sĩ & Điều Trị', quota: 2, current: 2, salaryRange: '30M - 60M đ' },
  { id: 'pos-2', code: 'POS-LASER-SPEC', name: 'Chuyên Viên Vận Hành Laser Pico & HIFU', dept: 'Khối Kỹ Thuật Viên Spa', quota: 6, current: 4, salaryRange: '15M - 25M đ' },
  { id: 'pos-3', code: 'POS-CONSULTANT', name: 'Chuyên Viên Tư Vấn & Chăm Sóc Hội Viên Ruby', dept: 'Phòng Tư Vấn CSKH', quota: 8, current: 6, salaryRange: '10M - 35M đ' },
  { id: 'pos-4', code: 'POS-CASHIER-MAIN', name: 'Thu Ngân Quầy POS Trưởng Ca Sáng', dept: 'Phòng Kế Toán POS', quota: 4, current: 3, salaryRange: '8M - 14M đ' }
];

const INITIAL_EMPLOYMENT_TYPES = [
  { id: 'et-1', code: 'EMP-FULLTIME', name: 'Toàn Thời Gian Cố Định (Full-Time)', hours: 44, insurance: true, leave: 12, desc: 'HĐLĐ chính thức không xác định thời hạn, đóng BHXH/BHYT đầy đủ' },
  { id: 'et-2', code: 'EMP-PARTTIME', name: 'Bán Thời Gian / Ca Gãy (Part-Time)', hours: 24, insurance: false, leave: 0, desc: 'Linh động theo ca khách đặt, thanh toán theo giờ + hoa hồng ca' },
  { id: 'et-3', code: 'EMP-PROBATION', name: 'Thử Việc (Probation - 60 Ngày)', hours: 44, insurance: false, leave: 0, desc: 'Hưởng 85% lương cơ bản theo quy định, đánh giá sau 2 tháng' },
  { id: 'et-4', code: 'EMP-CONTRACTOR-DOC', name: 'Bác Sĩ Hợp Đồng Chuyên Gia (Contractor)', hours: 16, insurance: false, leave: 0, desc: 'Thù lao chi trả trực tiếp theo từng ca phẫu thuật phức tạp' },
  { id: 'et-5', code: 'EMP-SEASONAL', name: 'Thời Vụ / Mùa Lễ Tết (Seasonal)', hours: 48, insurance: false, leave: 0, desc: 'Tăng cường mùa cận Tết, phụ cấp ca đêm và thưởng năng suất' }
];

const INITIAL_USERS = [
  { id: 'u-1', name: 'BHN System Administrator', email: 'admin@bhn.vn', role: 'SUPER_ADMIN', branch: 'Toàn Hệ Thống', dept: 'Ban Giám Đốc', status: 'ACTIVE' },
  { id: 'u-2', name: 'Trần Hương Giang', email: 'manager@bhn.vn', role: 'BRANCH_MANAGER', branch: 'Cơ sở Hoàn Kiếm', dept: 'Quản Lý Cơ Sở', status: 'ACTIVE' },
  { id: 'u-3', name: 'Lê Thu Trang', email: 'cashier@bhn.vn', role: 'CASHIER_POS', branch: 'Cơ sở Hoàn Kiếm', dept: 'Thu Ngân POS', status: 'ACTIVE' },
  { id: 'u-4', name: 'BS. CKI Nguyễn Tuấn Anh', email: 'doctor@bhn.vn', role: 'DOCTOR_THERAPIST', branch: 'Cơ sở Hoàn Kiếm', dept: 'Khối Bác Sĩ', status: 'ACTIVE' },
  { id: 'u-5', name: 'Võ Minh Quân', email: 'quan.vo@bhn.vn', role: 'BRANCH_MANAGER', branch: 'Cơ sở Quận 1 (HCM)', dept: 'Quản Lý Cơ Sở', status: 'ACTIVE' }
];

const RBAC_MODULES = [
  { id: 'crm', name: 'CRM & Khách Hàng' },
  { id: 'booking', name: 'Booking & Lịch Hẹn' },
  { id: 'pos', name: 'ERP / POS Bán Hàng' },
  { id: 'hr', name: 'Nhân Sự HR & Bảng Lương' },
  { id: 'bi', name: 'Báo Cáo & Quản Trị BI' },
  { id: 'ai', name: 'AI Copilot 2026' },
  { id: 'system', name: 'Tháp Điều Khiển Hệ Thống' }
];

export default function SystemControlTowerPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState<'org' | 'users' | 'branches' | 'integrations' | 'ai' | 'vps' | 'audit'>('org');
  const [orgSubTab, setOrgSubTab] = useState<'depts' | 'posts' | 'titles' | 'positions' | 'types'>('depts');

  // Interactive State
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [jobPosts, setJobPosts] = useState(INITIAL_JOB_POSTS);
  const [jobTitles, setJobTitles] = useState(INITIAL_JOB_TITLES);
  const [jobPositions, setJobPositions] = useState(INITIAL_JOB_POSITIONS);
  const [employmentTypes, setEmploymentTypes] = useState(INITIAL_EMPLOYMENT_TYPES);
  const [users, setUsers] = useState(INITIAL_USERS);

  // VietQR Config State
  const [bankAccount, setBankAccount] = useState({
    bank: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '999988882026',
    accountHolder: 'CTY CP THAM MY VIEN BHN INTERNATIONAL',
    memoPrefix: 'BHN'
  });

  // Zalo ZNS Config State
  const [zaloConfig, setZaloConfig] = useState({
    appId: '182736459012',
    oaId: '992837465019',
    status: 'CONNECTED'
  });

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isBlue = themeColor === 'blue';
  const primaryColorHex = isBlue ? '#0066cc' : '#dc0037';

  // 1-Click Backup Simulation
  const handleTriggerBackup = () => {
    showToast('🚀 Đang khởi chạy lệnh pg_dump snapshot trên PostgreSQL 17...');
    setTimeout(() => {
      showToast('✅ Đã tạo bản sao lưu Snapshot erp_core_backup_2026-11.sql.gz thành công (14.8 MB)!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pb-24">
      {/* Universal Topbar with 9-dot App Switcher and Theme Toggle */}
      <UniversalTopbar
        currentZoneName="Hệ Thống & Tháp Điều Khiển (Zone 8)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-xs"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  ENTERPRISE CONTROL TOWER
                </span>
                <span className="text-xs text-slate-500 font-mono">Port 3008 • Zone 8</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Tháp Điều Khiển Hệ Thống & Cơ Cấu Tổ Chức
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Quản lý cây cơ cấu tổ chức, người dùng, phân quyền ma trận RBAC, tích hợp Việt Nam và giám sát hạ tầng VPS.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerBackup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColorHex }}
              >
                <Database className="w-4 h-4" />
                <span>Sao Lưu DB 1-Click</span>
              </button>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4 mt-5">
            {[
              { id: 'org', label: '🏛️ Cơ Cấu Tổ Chức', count: `${departments.length} Khoa/Phòng` },
              { id: 'users', label: '👥 Người Dùng & RBAC', count: `${users.length} Tài khoản` },
              { id: 'branches', label: '🏢 Chuỗi Chi Nhánh', count: `${branches.length} Cơ sở` },
              { id: 'integrations', label: '🔌 Tích Hợp (VietQR / Zalo)', count: '3 Cổng' },
              { id: 'ai', label: '🧠 AI Copilot Control', count: 'Gemini 2.5' },
              { id: 'vps', label: '🖥️ Giám Sát VPS Node', count: '100% Sống' },
              { id: 'audit', label: '🛡️ Audit Logs & Brand', count: '2 Bản ghi' }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: CƠ CẤU TỔ CHỨC DOANH NGHIỆP */}
        {activeTab === 'org' && (
          <div className="space-y-6">
            {/* Sub-tab Pill Navigation */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              {[
                { id: 'depts', label: '🏢 Phòng Ban (Org Units)', icon: Network, count: departments.length },
                { id: 'posts', label: '🎖️ Chức Vụ (Cấp 1-5)', icon: Award, count: jobPosts.length },
                { id: 'titles', label: '🏷️ Chức Danh Chuyên Môn', icon: Briefcase, count: jobTitles.length },
                { id: 'positions', label: '📌 Vị Trí & Định Biên', icon: Layers, count: jobPositions.length },
                { id: 'types', label: '⏳ Tính Chất Công Việc', icon: Clock, count: employmentTypes.length }
              ].map((sub) => {
                const isSubSelected = orgSubTab === sub.id;
                const Icon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setOrgSubTab(sub.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isSubSelected
                        ? 'text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    style={isSubSelected ? { backgroundColor: primaryColorHex } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                    <span className="text-[10px] opacity-80">({sub.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab 1: Phòng Ban */}
            {orgSubTab === 'depts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {dept.code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5">
                          {dept.name}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {dept.level}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trưởng đơn vị:</span>
                        <span className="font-semibold text-slate-800">{dept.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trực thuộc:</span>
                        <span className="font-medium text-slate-700">{dept.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nhân sự thực tế:</span>
                        <span className="font-bold text-emerald-600">{dept.headcount} nhân viên</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 2: Chức Vụ */}
            {orgSubTab === 'posts' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Danh Mục Cấp Bậc Chức Vụ Hành Chính</h3>
                    <p className="text-xs text-slate-500">Phân định quyền hạn điều hành, cấp bậc quản lý (Level 1 đến Level 5) và phụ cấp chức danh</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {jobPosts.map((post) => (
                    <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-2xs"
                          style={{ backgroundColor: primaryColorHex }}
                        >
                          L{post.level}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{post.name}</span>
                            <span className="font-mono text-[11px] text-slate-400">{post.code}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{post.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600">{post.allowance}</span>
                        <span className="block text-[11px] text-slate-400">Phụ cấp trách nhiệm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Chức Danh Chuyên Môn */}
            {orgSubTab === 'titles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobTitles.map((title) => (
                  <div key={title.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">{title.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {title.code}
                      </span>
                    </div>
                    <div className="text-xs space-y-1.5 mt-3">
                      <div>
                        <span className="text-slate-400">Lĩnh vực chuyên môn:</span>{' '}
                        <span className="font-semibold text-slate-700">{title.field}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Yêu cầu chứng chỉ / CCHN:</span>{' '}
                        <span className="text-slate-600">{title.cert}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 4: Vị Trí Công Việc & Định Biên */}
            {orgSubTab === 'positions' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Mã Vị Trí</th>
                      <th className="py-3 px-4">Tên Vị Trí Công Việc</th>
                      <th className="py-3 px-4">Thuộc Khoa / Phòng</th>
                      <th className="py-3 px-4">Định Biên (Thực / Chuẩn)</th>
                      <th className="py-3 px-4">Dải Lương Khung</th>
                      <th className="py-3 px-4 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {jobPositions.map((pos) => {
                      const isFull = pos.current >= pos.quota;
                      return (
                        <tr key={pos.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-500">{pos.code}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{pos.name}</td>
                          <td className="py-3 px-4 text-slate-600">{pos.dept}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{pos.current}</span>
                            <span className="text-slate-400"> / {pos.quota} người</span>
                            {!isFull && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                                Cần tuyển {pos.quota - pos.current}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-700">{pos.salaryRange}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-tab 5: Tính Chất Công Việc */}
            {orgSubTab === 'types' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employmentTypes.map((et) => (
                  <div key={et.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">{et.code}</span>
                        {et.insurance ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Có BHXH/BHYT
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            Không BHXH
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{et.name}</h4>
                      <p className="text-xs text-slate-500 mt-2">{et.desc}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-600">
                      <span>{et.hours} giờ / tuần</span>
                      <span>{et.leave} ngày phép/năm</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUẢN TRỊ NGƯỜI DÙNG & RBAC */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Danh Sách Tài Khoản Nội Bộ & Gán Vai Trò</h3>
                  <p className="text-xs text-slate-500">Liên kết tài khoản đăng nhập với Cơ cấu tổ chức và Quyền hạn ma trận</p>
                </div>
                <button
                  onClick={() => showToast('Mở form tạo tài khoản người dùng mới...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Tài Khoản
                </button>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Họ Và Tên</th>
                    <th className="py-3 px-4">Email / Đăng Nhập</th>
                    <th className="py-3 px-4">Vai Trò Hệ Thống</th>
                    <th className="py-3 px-4">Cơ Sở Công Tác</th>
                    <th className="py-3 px-4">Phòng Ban</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.branch}</td>
                      <td className="py-3 px-4 text-slate-600">{u.dept}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Granular RBAC Matrix Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Ma Trận Phân Quyền Granular RBAC (Theo Phân Hệ)</h3>
              <p className="text-xs text-slate-500 mb-4">Quy định quyền truy cập CRUD cho từng chức vụ và vai trò trên 7 phân hệ ERP</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2.5">Phân Hệ ERP</th>
                      <th className="p-2.5 text-center">Xem (Read)</th>
                      <th className="p-2.5 text-center">Tạo Mới (Create)</th>
                      <th className="p-2.5 text-center">Chỉnh Sửa (Update)</th>
                      <th className="p-2.5 text-center">Xóa / Hủy (Delete)</th>
                      <th className="p-2.5 text-center">Phê Duyệt (Approve)</th>
                      <th className="p-2.5 text-center">Xuất File (Export)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RBAC_MODULES.map((mod) => (
                      <tr key={mod.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-800">{mod.name}</td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-slate-300 mx-auto" /></td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                        <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ CHUỖI CHI NHÁNH */}
        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {branches.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{b.code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Đang Hoạt Động
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{b.address}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hotline cơ sở:</span>
                      <span className="font-semibold text-slate-800">{b.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Giám đốc cơ sở:</span>
                      <span className="font-semibold text-slate-800">{b.managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quy mô nhân sự:</span>
                      <span className="font-bold text-emerald-600">{b.headcount} nhân sự</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Doanh thu hôm nay</span>
                    <span className="font-bold text-slate-900 text-sm">{b.revenueToday}</span>
                  </div>
                  <button
                    onClick={() => showToast(`Chuyển ngữ cảnh quản trị sang: ${b.name}`)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TÍCH HỢP VIỆT NAM (VietQR / ZALO ZNS) */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VietQR Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Cấu Hình VietQR & Chuyển Khoản NAPAS 247</h3>
                  <p className="text-xs text-slate-500">Tự động sinh mã QR động kèm số tiền và mã hóa đơn tại quầy POS</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ngân Hàng Thụ Hưởng</label>
                  <input
                    type="text"
                    value={bankAccount.bank}
                    onChange={(e) => setBankAccount({ ...bankAccount, bank: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Số Tài Khoản</label>
                  <input
                    type="text"
                    value={bankAccount.accountNumber}
                    onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tên Chủ Tài Khoản (In hoa không dấu)</label>
                  <input
                    type="text"
                    value={bankAccount.accountHolder}
                    onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Xem trước mẫu VietQR động:</span>
                  <p className="text-slate-500 mt-0.5">Mã QR sinh ra sẽ tự động kèm mã đơn `BHN-POS-XXXX` để hệ thống tự động đối soát thanh toán qua Webhook.</p>
                </div>
              </div>

              <button
                onClick={() => showToast('✅ Đã lưu cấu hình tài khoản VietQR thành công!')}
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: primaryColorHex }}
              >
                Lưu Cấu Hình VietQR
              </button>
            </div>

            {/* Zalo ZNS Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Zalo Official Account & Mẫu ZNS Tự Động</h3>
                  <p className="text-xs text-slate-500">Tự động gửi thông báo lịch hẹn và tri ân hội viên qua Zalo ZNS</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Zalo App ID</label>
                  <input
                    type="text"
                    value={zaloConfig.appId}
                    onChange={(e) => setZaloConfig({ ...zaloConfig, appId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Zalo OA ID</label>
                  <input
                    type="text"
                    value={zaloConfig.oaId}
                    onChange={(e) => setZaloConfig({ ...zaloConfig, oaId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Template list */}
              <div className="mt-4 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Các mẫu thông báo tự động đang kích hoạt:</span>
                {[
                  { name: 'ZNS 01: Xác nhận đặt lịch hẹn thành công', time: 'Tức thì khi đặt' },
                  { name: 'ZNS 02: Nhắc lịch hẹn trước 120 phút', time: 'Tự động 2h trước ca' },
                  { name: 'ZNS 03: Chúc mừng sinh nhật & Tặng Voucher 20%', time: '08:00 sáng sinh nhật' }
                ].map((tmpl, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">{tmpl.name}</span>
                      <span className="text-[11px] text-slate-400">{tmpl.time}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Đang gửi thử nghiệm mẫu: ${tmpl.name}`)}
                      className="text-[11px] font-semibold px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      Bắn Thử
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI COPILOT CONTROL */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Trạm Điều Khiển AI Copilot & Vector Store RAG</h3>
                <p className="text-xs text-slate-500">Giám sát mức tiêu thụ Token theo từng chi nhánh và cập nhật tri thức `pgvector` HNSW</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Google Gemini 2.5 Flash (Context 1M+)
              </span>
            </div>

            {/* Quota Progress */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Hạn mức Token toàn chuỗi tháng 11/2026</span>
                <span className="font-mono text-emerald-600">142.850 / 1.000.000 Tokens (14.2%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '14.2%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Chi phí token ước tính: ~0.42 USD / 10.500 VNĐ</span>
            </div>

            {/* RAG Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm">Văn Bản Tri Thức Doanh Nghiệp (PostgreSQL 17 HNSW Index)</h4>
                <button
                  onClick={() => showToast('Mở hộp thoại tải lên tài liệu PDF/Docx để nhúng vector...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Văn Bản RAG
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { title: 'Chính sách Tích lũy Điểm thưởng & Nâng hạng Hội viên BHN Privilege 2026', chunks: 14, category: 'Hội Viên' },
                  { title: 'Quy trình Điều phối Phòng Dịch vụ & Xử lý Hủy lịch hẹn', chunks: 8, category: 'Vận Hành' },
                  { title: 'Chính sách Chi trả Hoa hồng & Thưởng Hiệu suất Nhân sự (HR & Commission)', chunks: 19, category: 'Nhân Sự' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-400">Phân loại: {doc.category} • {doc.chunks} vector chunks (1536 dims)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã Lập Chỉ Mục HNSW
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GIÁM SÁT HẠ TẦNG VPS */}
        {activeTab === 'vps' && (
          <div className="space-y-6">
            {/* Live Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Tải Vi Xử Lý (CPU)</span>
                  <Cpu className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900 font-mono">14.8%</span>
                <span className="text-[11px] text-slate-500 block mt-1">4 vCPUs • 2.6 GHz</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Bộ Nhớ RAM</span>
                  <HardDrive className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900 font-mono">2.8 / 8.0 GB</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">35% Sử dụng (Dư 5.2GB)</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Ổ Cứng SSD NVMe</span>
                  <Database className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900 font-mono">34 / 160 GB</span>
                <span className="text-[11px] text-slate-500 block mt-1">Còn trống 126 GB</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Uptime Máy Chủ</span>
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900 font-mono">99.98%</span>
                <span className="text-[11px] text-slate-500 block mt-1">Hoạt động 38 ngày liên tục</span>
              </div>
            </div>

            {/* Microservices Health Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Trạng Thái Sức Khỏe Toàn Bộ Dịch Vụ Microservices</h3>
                  <p className="text-xs text-slate-500">Giám sát trực tiếp các container Docker chạy nền trên máy chủ VPS</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tất Cả Dịch Vụ Sẵn Sàng
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { name: 'PostgreSQL 17 + pgvector (HNSW)', port: 5432, role: 'Lưu trữ CSDL quan hệ & Vector embeddings', latency: '1.2 ms', status: 'OPTIMAL' },
                  { name: 'Valkey 8 (Linux Foundation Cache)', port: 6379, role: 'In-memory cache & Session store', latency: '0.4 ms', status: 'OPTIMAL' },
                  { name: 'NATS 2.29 JetStream Message Bus', port: 4222, role: 'Event-driven broker bất đồng bộ', latency: '< 0.1 ms', status: 'OPTIMAL' },
                  { name: 'NestJS 12.4 Fastify Gateway', port: 8000, role: 'API Gateway & Controllers nghiệp vụ', latency: '3.8 ms', status: 'OPTIMAL' },
                  { name: 'Traefik v3 Ingress & SSL', port: '80 / 443', role: 'Reverse proxy, HTTP/3 QUIC & Let\'s Encrypt', latency: '1.0 ms', status: 'OPTIMAL' }
                ].map((svc, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{svc.name}</span>
                        <span className="text-slate-400">{svc.role} • Port: {svc.port}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-700 font-semibold">{svc.latency}</span>
                      <span className="block text-[10px] font-bold text-emerald-600">{svc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS & BRAND */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Nhật Ký Truy Vết Thao Tác (Audit Trails)</h3>
                  <p className="text-xs text-slate-500">Ghi vết toàn bộ hành vi nhạy cảm: Đăng nhập, Duyệt lương, Hủy đơn, Sao lưu dữ liệu</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { user: 'BHN System Administrator', action: 'DATABASE_BACKUP_SNAPSHOT', resource: 'POSTGRESQL_17', time: '10 phút trước', ip: '127.0.0.1' },
                  { user: 'Trần Hương Giang', action: 'PAYROLL_CALCULATE', resource: 'PAYROLL_2026_11', time: '2 giờ trước', ip: '192.168.1.105' },
                  { user: 'BHN System Administrator', action: 'ORGANIZATION_UPDATE', resource: 'DEPT_SPA_THERAPY', time: 'Hôm qua', ip: '127.0.0.1' },
                  { user: 'Lê Thu Trang', action: 'ORDER_CHECKOUT_VIETQR', resource: 'ORDER_BHN_8820', time: 'Hôm qua', ip: '192.168.1.108' }
                ].map((log, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.user}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                          {log.action}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] block mt-1">Đối tượng: {log.resource} • IP: {log.ip}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* White-label settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">Cấu Hình Thương Hiệu White-Label</h3>
              <p className="text-xs text-slate-500 mb-4">Tùy biến tên doanh nghiệp, logo và tông màu chủ đạo hiển thị toàn chuỗi</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tên Chuỗi / Thương Hiệu</label>
                  <input
                    type="text"
                    defaultValue="BHN International Wellness & Clinic"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hotline CSKH Toàn Quốc</label>
                  <input
                    type="text"
                    defaultValue="1900 882026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">Tông màu mặc định hệ thống:</span>
                  <span className="text-[11px] text-slate-500">Hiện tại: {isBlue ? '🔵 Xanh Biếc (Azure Blue)' : '🔴 Đỏ Ruby lab(45 79.29 35.14) (#dc0037)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setThemeColor('red')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                      !isBlue ? 'ring-2 ring-slate-800 ring-offset-2' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: '#dc0037' }}
                  >
                    🔴 Đỏ Ruby
                  </button>
                  <button
                    onClick={() => setThemeColor('blue')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                      isBlue ? 'ring-2 ring-slate-800 ring-offset-2' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: '#0066cc' }}
                  >
                    🔵 Xanh Biếc
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
