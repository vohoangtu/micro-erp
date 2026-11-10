'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';

export interface SubpageItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeColor?: string;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  appName: string;
  appCode?: string;
  appIcon: LucideIcon;
  gradient?: string;
  themeColor: 'blue' | 'red';
  subpages: SubpageItem[];
  activeSubpageId: string;
  onSelectSubpage?: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  appName,
  appCode = 'ZONE',
  appIcon: AppIcon,
  gradient,
  themeColor,
  subpages,
  activeSubpageId,
  onSelectSubpage,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isBlue = themeColor === 'blue';
  const primaryColorHex = isBlue ? '#0066cc' : '#dc0037';
  const defaultGradient = isBlue
    ? 'linear-gradient(135deg, #0066cc 0%, #1e40af 100%)'
    : 'linear-gradient(135deg, #dc0037 0%, #990026 100%)';

  const activeGradient = gradient || defaultGradient;

  const renderNavItems = () => (
    <nav className="space-y-1 px-3 py-3 flex-1 overflow-y-auto">
      <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {!isCollapsed ? 'Phân Hệ Nghiệp Vụ' : '•'}
      </div>

      {subpages.map((item) => {
        const isActive = item.id === activeSubpageId;
        const Icon = item.icon;

        const handleClick = (e: React.MouseEvent) => {
          if (item.onClick) {
            e.preventDefault();
            item.onClick();
          } else if (onSelectSubpage) {
            e.preventDefault();
            onSelectSubpage(item.id);
          }
          setIsMobileOpen(false);
        };

        return (
          <a
            key={item.id}
            href={item.href || '#'}
            onClick={handleClick}
            title={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
            style={isActive ? { backgroundColor: primaryColorHex } : {}}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-transform ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
              }`}
            />
            {!isCollapsed && (
              <span className="truncate flex-1">{item.label}</span>
            )}
            {!isCollapsed && item.badge !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.badgeColor || 'bg-slate-200 text-slate-600'
                }`}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Trigger Float Button */}
      <div className="md:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: primaryColorHex }}
          title="Mở menu điều hướng phân hệ"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white border-r border-slate-200 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ background: activeGradient }}
                >
                  <AppIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{appName}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{appCode}</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            {renderNavItems()}

            {/* Footer */}
            <div className="p-3 border-t border-slate-100">
              <a
                href="/"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <Home className="w-4 h-4" />
                <span>Về Màn Hình Launcher</span>
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white/95 backdrop-blur-md border-r border-slate-200/90 h-[calc(100vh-3.5rem)] sticky top-14 shrink-0 transition-all duration-200 select-none ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Top Header of App */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs shrink-0"
              style={{ background: activeGradient }}
            >
              <AppIcon className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-900 text-xs leading-tight truncate">{appName}</h3>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{appCode}</span>
              </div>
            )}
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation List */}
        {renderNavItems()}

        {/* Bottom Shortcut to Launcher */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <a
            href="/"
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition group"
            title="Quay về Software Launcher chính"
          >
            <Home className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
            {!isCollapsed && <span>Về Launcher</span>}
          </a>

          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400 font-mono">
              <span>BHN CORE 2026</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
