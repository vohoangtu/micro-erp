'use client';

import React, { useState } from 'react';
import {
  Grid,
  Home,
  ChevronRight,
  Layers,
  Palette,
  BarChart3,
  Users,
  Calendar,
  ShoppingBag,
  Briefcase,
  Bot,
  Settings,
  Smartphone
} from 'lucide-react';

export interface UniversalTopbarProps {
  currentZoneName?: string;
  themeColor: 'blue' | 'red';
  onThemeChange: (color: 'blue' | 'red') => void;
}

export const ERP_APPS = [
  {
    id: 'bi',
    name: 'Management BI',
    shortName: 'Quản Trị BI',
    path: '/bi',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
  },
  {
    id: 'crm',
    name: 'CRM & Khách Hàng',
    shortName: 'CRM',
    path: '/crm',
    icon: Users,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    id: 'booking',
    name: 'Booking & Lịch Hẹn',
    shortName: 'Booking',
    path: '/booking',
    icon: Calendar,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  },
  {
    id: 'pos',
    name: 'ERP / POS Bán Hàng',
    shortName: 'POS',
    path: '/pos',
    icon: ShoppingBag,
    gradient: 'linear-gradient(135deg, #dc0037 0%, #990026 100%)'
  },
  {
    id: 'hr',
    name: 'HR & Bảng Lương',
    shortName: 'Nhân Sự HR',
    path: '/hr',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    id: 'ai',
    name: 'AI Copilot 2026',
    shortName: 'AI Copilot',
    path: '/ai',
    icon: Bot,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
  },
  {
    id: 'system',
    name: 'Hệ Thống & VPS Node',
    shortName: 'Cấu Hình',
    path: '/system',
    icon: Settings,
    gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)'
  },
  {
    id: 'member-portal',
    name: 'Cổng Hội Viên Member',
    shortName: 'Member App',
    path: 'http://localhost:3001',
    icon: Smartphone,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    isExternal: true
  }
];

export function UniversalTopbar({
  currentZoneName,
  themeColor,
  onThemeChange
}: UniversalTopbarProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const isBlue = themeColor === 'blue';

  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';
  const brandGradient = isBlue
    ? 'from-blue-600 to-indigo-700'
    : 'from-[#dc0037] to-[#990026]';

  return (
    <header className="h-14 border-b border-[#eae6df] bg-[#faf8f5]/90 backdrop-blur-md px-5 flex items-center justify-between z-30 shrink-0 sticky top-0">
      {/* Left: App Switcher & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* 9-Dots App Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(prev => !prev)}
            className={`p-2 rounded-xl transition ${
              isSwitcherOpen ? 'bg-slate-200/80 text-slate-900' : 'text-slate-600 hover:bg-slate-200/50'
            }`}
            title="Mở App Switcher Drawer"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* App Switcher Dropdown Drawer */}
          {isSwitcherOpen && (
            <div className="absolute top-12 left-0 w-80 bg-white border border-slate-200 rounded-3xl shadow-xl p-4 z-50 animate-in fade-in duration-100 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900">Chuyển Đổi Phân Hệ ERP</span>
                <a
                  href="/"
                  className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Home className="w-3 h-3" /> Về Launcher
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ERP_APPS.map(app => {
                  const Icon = app.icon;
                  return (
                    <a
                      key={app.id}
                      href={app.path}
                      target={app.isExternal ? '_blank' : undefined}
                      rel={app.isExternal ? 'noreferrer' : undefined}
                      onClick={() => setIsSwitcherOpen(false)}
                      className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition group"
                    >
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                        style={{ background: app.gradient }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1.5 text-center leading-tight">
                        {app.shortName}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Home Launcher Icon */}
        <a
          href="/"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition"
        >
          <div
            className={`w-5 h-5 rounded-md bg-gradient-to-br ${brandGradient} flex items-center justify-center text-white`}
          >
            <Layers className="w-3 h-3" />
          </div>
          <span>BHN CORE</span>
        </a>

        {currentZoneName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-xs font-bold ${brandText}`}>{currentZoneName}</span>
          </>
        )}
      </div>

      {/* Right: Color Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Color Tone Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <button
            onClick={() => onThemeChange('red')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition ${
              !isBlue ? 'bg-slate-100 text-[#dc0037] font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tone Đỏ lab(45 79.29 35.14)"
          >
            <span className="w-2 h-2 rounded-full bg-[#dc0037]"></span>
            <span className="text-[11px]">Đỏ Ruby</span>
          </button>
          <button
            onClick={() => onThemeChange('blue')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition ${
              isBlue ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tone Xanh Biếc"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[11px]">Xanh Biếc</span>
          </button>
        </div>

        <div
          className={`w-7 h-7 rounded-full ${
            isBlue ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-[#dc0037]'
          } border flex items-center justify-center text-[11px] font-bold`}
        >
          AD
        </div>
      </div>
    </header>
  );
}
