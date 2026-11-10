'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  ShoppingBag,
  Briefcase,
  Bot,
  Sparkles,
  CheckCircle2,
  Layers,
  Palette,
  Search,
  Grid,
  Home,
  Settings,
  Fingerprint,
  Umbrella,
  Receipt,
  Smartphone
} from 'lucide-react';
import { ERP_APPS, UniversalTopbar } from '@erp/ui';

export default function ShellMasterLauncher() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
      const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      setDateStr(`${daysOfWeek[now.getDay()]}, ${now.getDate()} Tháng ${now.getMonth() + 1}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isBlue = themeColor === 'blue';
  const brandGradient = isBlue
    ? 'from-blue-600 to-indigo-700 shadow-blue-600/20'
    : 'from-[#dc0037] to-[#990026] shadow-[#dc0037]/25';
  const badgeColor = isBlue ? 'bg-blue-600' : 'bg-[#dc0037]';

  const appsList = [
    {
      id: 'bi',
      name: 'Management BI',
      shortName: 'Quản Trị BI',
      description: 'Phân hệ báo cáo doanh thu, occupancy và tài chính realtime',
      path: '/bi',
      icon: BarChart3,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      badge: 'Zone 1'
    },
    {
      id: 'crm',
      name: 'CRM & Khách Hàng',
      shortName: 'CRM',
      description: 'Phân hệ hồ sơ thành viên, phễu lead, phân hạng & Zalo ZNS',
      path: '/crm',
      icon: Users,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      badge: 'Zone 2'
    },
    {
      id: 'booking',
      name: 'Booking & Lịch Hẹn',
      shortName: 'Booking',
      description: 'Phân hệ lịch hẹn, điều phối ca làm, kỹ thuật viên và phòng VIP',
      path: '/booking',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      badge: 'Zone 3'
    },
    {
      id: 'pos',
      name: 'ERP / POS Bán Hàng',
      shortName: 'POS Quầy',
      description: 'Phân hệ thu ngân quầy, quét mã VietQR, xuất nhập kho hóa đơn',
      path: '/pos',
      icon: ShoppingBag,
      gradient: isBlue
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        : 'linear-gradient(135deg, #dc0037 0%, #990026 100%)',
      badge: 'Zone 4'
    },
    {
      id: 'hr',
      name: 'HR & Bảng Lương',
      shortName: 'Nhân Sự HR',
      description: 'Phân hệ nhân sự, chấm công FaceID và tự động tính hoa hồng',
      path: '/hr',
      icon: Briefcase,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: 'Zone 5'
    },
    {
      id: 'ai',
      name: 'AI Copilot 2026',
      shortName: 'AI Copilot',
      description: 'Phân hệ trợ lý điều hành thông minh RAG trên PostgreSQL 17',
      path: '/ai',
      icon: Bot,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      badge: 'Zone 6'
    },
    {
      id: 'system',
      name: 'Hệ Thống & VPS Node',
      shortName: 'Cấu Hình',
      description: 'Quản trị phân quyền RBAC, Docker Node & License Key',
      path: '/system',
      icon: Settings,
      gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
      badge: 'Zone 7'
    },
    {
      id: 'member-portal',
      name: 'Cổng Hội Viên Member',
      shortName: 'Member App',
      description: 'Cổng Web / PWA dành riêng cho khách hàng trải nghiệm',
      path: 'http://localhost:3001',
      icon: Smartphone,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      badge: 'Portal',
      isExternal: true
    }
  ];

  const filteredApps = appsList.filter(
    a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* GLOBAL SEARCH MODAL (Ctrl + K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm nhanh phân hệ độc lập... (ESC để đóng)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Các Phân Hệ Độc Lập (Multi-Zones)
              </div>
              {filteredApps.map(app => {
                const Icon = app.icon;
                return (
                  <a
                    key={app.id}
                    href={app.path}
                    target={app.isExternal ? '_blank' : undefined}
                    rel={app.isExternal ? 'noreferrer' : undefined}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ background: app.gradient }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-400">{app.description}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      {app.badge}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Universal Topbar */}
      <UniversalTopbar themeColor={themeColor} onThemeChange={setThemeColor} />

      {/* Launcher Home Canvas */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-between py-10 px-4 relative">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Minimalist Clock & Date Widget */}
          <div className="text-center mb-6 select-none">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-sans">
              {timeStr || '16:00'}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 mt-2 text-xs font-medium text-slate-600 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{dateStr || 'Hôm nay'}</span>
            </div>
          </div>

          {/* Employee Self-Service Quick Bar */}
          <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 pl-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block">
                  {isCheckedIn ? 'Hôm nay: Đã điểm danh (08:14 AM)' : 'Chưa điểm danh ca chiều'}
                </span>
                <span className="text-[10px] text-slate-400">Trụ sở Hà Nội • GPS Hợp lệ</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsCheckedIn(!isCheckedIn);
                  showToast(isCheckedIn ? 'Đã Check-out ca làm việc thành công!' : 'Điểm danh FaceID thành công!');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                  isCheckedIn
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>{isCheckedIn ? 'Check-out' : 'Chấm công 1-chạm'}</span>
              </button>

              <a
                href="/hr"
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
              >
                <Umbrella className="w-3 h-3 text-amber-500" />
                <span>Phép: 12d</span>
              </a>

              <a
                href="/hr"
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
              >
                <Receipt className="w-3 h-3 text-emerald-600" />
                <span>Lương T11</span>
              </a>
            </div>
          </div>

          {/* SQUIRCLE APP LAUNCHER GRID (Mỗi App độc lập hoàn toàn) */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl justify-items-center mb-8">
            {appsList.map(app => {
              const Icon = app.icon;
              return (
                <a
                  key={app.id}
                  href={app.path}
                  target={app.isExternal ? '_blank' : undefined}
                  rel={app.isExternal ? 'noreferrer' : undefined}
                  className="flex flex-col items-center cursor-pointer select-none group transition-transform active:scale-95"
                >
                  <div className="relative">
                    <div
                      className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center text-white shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all"
                      style={{ background: app.gradient }}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    {app.badge && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold text-white px-1 shadow-md ring-2 ring-white ${badgeColor}`}
                      >
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2.5 text-center group-hover:text-blue-600 transition">
                    {app.shortName}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Floating Quick Dock */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-3xl px-4 py-2.5 shadow-lg flex items-center gap-4">
          <a
            href="/pos"
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
            title="Mở App POS Bán Hàng Độc Lập"
          >
            <ShoppingBag className="w-5 h-5 text-[#dc0037]" />
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">POS</span>
          </a>

          <a
            href="/booking"
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
            title="Mở App Booking Độc Lập"
          >
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">Booking</span>
          </a>

          <a
            href="/bi"
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
            title="Mở App Management BI Độc Lập"
          >
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">BI</span>
          </a>

          <a
            href="/ai"
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
            title="Mở Trợ Lý AI Copilot"
          >
            <Bot className="w-5 h-5 text-pink-600" />
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">AI</span>
          </a>
        </div>
      </main>
    </div>
  );
}
