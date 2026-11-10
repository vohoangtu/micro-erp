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
  ArrowUpRight,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Palette,
  Plus,
  Trash2,
  QrCode,
  Check,
  X,
  Search,
  Grid,
  Home,
  Settings,
  Bell,
  Fingerprint,
  Umbrella,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Server,
  Command,
  HelpCircle,
  Smartphone
} from 'lucide-react';

export default function ShellLauncherPage() {
  // Current active view: 'launcher' (home screen) OR any active app workspace
  const [currentView, setCurrentView] = useState<
    'launcher' | 'bi' | 'crm' | 'booking' | 'pos' | 'hr' | 'ai' | 'system'
  >('launcher');

  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);

  // Live Clock & Date State
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Employee Self-Service Quick Check-in
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  // CRM State
  const [customers, setCustomers] = useState([
    { name: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', tier: 'PLATINUM', points: 640, spent: '18.500.000 ₫' },
    { name: 'Trần Văn Hoàng', phone: '0912 888 999', tier: 'GOLD', points: 320, spent: '9.200.000 ₫' },
    { name: 'Phạm Thu Hằng', phone: '0988 777 666', tier: 'SILVER', points: 80, spent: '2.800.000 ₫' },
    { name: 'Lê Minh Tuấn', phone: '0933 445 566', tier: 'DIAMOND', points: 1250, spent: '35.000.000 ₫' }
  ]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Booking State
  const [bookings, setBookings] = useState([
    { id: 1, time: '16:30 - Hôm nay', customer: 'Nguyễn Thị Mai Lan', service: 'Gói Chăm Sóc Da Mặt Cao Cấp', staff: 'KTV. Trần Mai', status: 'CONFIRMED' },
    { id: 2, time: '17:30 - Hôm nay', customer: 'Lê Minh Tuấn', service: 'Massage Body Đá Nóng Himalaya 90p', staff: 'KTV. Hoàng Quân', status: 'IN_PROGRESS' },
    { id: 3, time: '18:45 - Hôm nay', customer: 'Đỗ Phương Thảo', service: 'Trị Liệu Phục Hồi Chuyên Sâu', staff: 'KTV. Thanh Tâm', status: 'PENDING' }
  ]);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newBookingCust, setNewBookingCust] = useState('');
  const [newBookingService, setNewBookingService] = useState('Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell');
  const [newBookingTime, setNewBookingTime] = useState('19:30 - Hôm nay');

  // POS State
  const [posProducts] = useState([
    { id: '1', sku: 'SRV-01', name: 'Gói Chăm Sóc Da Mặt Cao Cấp', price: 450000, category: 'Dịch vụ Spa' },
    { id: '2', sku: 'PRD-02', name: 'Serum Dưỡng Ẩm Phục Hồi B5 50ml', price: 620000, category: 'Mỹ phẩm' },
    { id: '3', sku: 'SRV-03', name: 'Massage Body Đá Nóng 90 phút', price: 550000, category: 'Dịch vụ Spa' },
    { id: '4', sku: 'PRD-04', name: 'Kem Chống Nắng SPF50+ 60ml', price: 480000, category: 'Mỹ phẩm' },
    { id: '5', sku: 'SRV-05', name: 'Combo HIFU Trẻ Hóa Công Nghệ Cao', price: 2400000, category: 'Trị Liệu' }
  ]);
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([
    { id: '1', name: 'Gói Chăm Sóc Da Mặt Cao Cấp', price: 450000, quantity: 1 }
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // HR State
  const [payrollSuccess, setPayrollSuccess] = useState(false);

  // AI State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Xin chào Ban Quản Trị! Tôi là BHN AI Copilot. Tôi đã kết nối trực tiếp với PostgreSQL 17 và NATS Event Bus của hệ thống. Bạn có câu hỏi nào về doanh thu, điều phối booking hay chăm sóc khách hàng hôm nay không?',
      time: '16:00'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Clock Update
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

  // Shortcut Ctrl + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAppSwitcherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isBlue = themeColor === 'blue';

  // Dynamic Theme Tokens
  const theme = {
    brandGradient: isBlue
      ? 'from-blue-600 to-indigo-700 shadow-blue-600/20'
      : 'from-[#dc0037] to-[#990026] shadow-[#dc0037]/25',
    brandText: isBlue ? 'text-blue-600' : 'text-[#dc0037]',
    brandSubtext: isBlue ? 'text-blue-700' : 'text-[#dc0037]',
    activeNav: isBlue
      ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200'
      : 'bg-[#fef1f3] text-[#dc0037] font-semibold border-[#fcd0d8]',
    navIconActive: isBlue ? 'text-blue-600' : 'text-[#dc0037]',
    badgeBg: isBlue ? 'bg-blue-100 text-blue-700' : 'bg-[#fef1f3] text-[#dc0037] border border-[#fcd0d8]',
    pingBg: isBlue ? 'bg-blue-500' : 'bg-[#dc0037]',
    primaryBtn: isBlue
      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
      : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-md shadow-[#dc0037]/25',
    cardInsightBg: isBlue
      ? 'from-blue-50/70 to-indigo-50/40 border-blue-100'
      : 'from-[#fef1f3] to-rose-50/50 border-[#fcd0d8]',
    cardInsightTitle: isBlue ? 'text-blue-800' : 'text-[#dc0037]',
    chatBubbleUser: isBlue ? 'bg-blue-600 text-white' : 'bg-[#dc0037] text-white',
    inputFocus: isBlue
      ? 'focus:border-blue-600 focus:ring-blue-500/20'
      : 'focus:border-[#dc0037] focus:ring-[#dc0037]/20'
  };

  // Apps List Definition for Software Launcher
  const launcherApps = [
    {
      id: 'bi',
      name: 'Management BI',
      shortName: 'Quản Trị BI',
      description: 'Báo cáo doanh thu, occupancy và tài chính realtime',
      icon: BarChart3,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      badge: 'Live',
      category: 'Điều Hành'
    },
    {
      id: 'crm',
      name: 'CRM & Khách Hàng',
      shortName: 'CRM',
      description: 'Hồ sơ thành viên, phễu lead, phân hạng & tích điểm',
      icon: Users,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      badge: `${customers.length}`,
      category: 'Bán Hàng'
    },
    {
      id: 'booking',
      name: 'Booking & Lịch Hẹn',
      shortName: 'Booking',
      description: 'Lịch hẹn chăm sóc, xếp kỹ thuật viên và phòng dịch vụ',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      badge: `${bookings.length} ca`,
      category: 'Vận Hành'
    },
    {
      id: 'pos',
      name: 'ERP / POS Bán Hàng',
      shortName: 'POS Bán Hàng',
      description: 'Thu ngân quầy, quét mã VietQR, xuất nhập kho hóa đơn',
      icon: ShoppingBag,
      gradient: isBlue
        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        : 'linear-gradient(135deg, #dc0037 0%, #990026 100%)',
      badge: cart.length > 0 ? `${cart.length}` : undefined,
      category: 'Tài Chính'
    },
    {
      id: 'hr',
      name: 'HR & Bảng Lương',
      shortName: 'Nhân Sự HR',
      description: 'Hồ sơ nhân viên, chấm công và tự động tính hoa hồng',
      icon: Briefcase,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      category: 'Nhân Sự'
    },
    {
      id: 'ai',
      name: 'AI Copilot 2026',
      shortName: 'AI Copilot',
      description: 'Trợ lý điều hành thông minh RAG trên PostgreSQL 17',
      icon: Bot,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      badge: '2026',
      category: 'Trí Tuệ Nhân Tạo'
    },
    {
      id: 'system',
      name: 'Hệ Thống & VPS Node',
      shortName: 'Cấu Hình',
      description: 'Quản trị phân quyền RBAC, Docker Node & License Key',
      icon: Settings,
      gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
      category: 'Hạ Tầng'
    },
    {
      id: 'member-portal',
      name: 'Cổng Hội Viên Member',
      shortName: 'Member App',
      description: 'Cổng Web / PWA dành riêng cho khách hàng trải nghiệm',
      icon: Smartphone,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      category: 'Khách Hàng',
      isExternal: true,
      url: 'http://localhost:3001'
    }
  ];

  const filteredApps = launcherApps.filter(
    app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendAi = async (textToSend?: string) => {
    const q = textToSend || aiQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, userMsg]);
    setAiQuery('');
    setAiLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `${data.answer}\n\n💡 Đề xuất hành động:\n${(data.suggestedActions || []).map((a: string) => `• ${a}`).join('\n')}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('API offline');
      }
    } catch {
      setTimeout(() => {
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `[AI Copilot Analysis - RAG on Postgres 17]\nDựa trên số liệu tổng hợp hôm nay:\n• Doanh thu POS: 28.450.000 ₫ (+18.4% so với cùng kỳ tuần trước)\n• Tỉ lệ lấp đầy lịch hẹn (Occupancy): 88%\n• Dịch vụ Chăm Sóc Da Cao Cấp chiếm 58% cơ cấu doanh thu.\n\n💡 Đề xuất hành động:\n• Mở thêm 2 ca chăm sóc da vào khung giờ vàng 18h00 - 20h00.\n• Tự động gửi tin nhắn Zalo ZNS ưu đãi cho khách hàng hạng Platinum.`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setAiLoading(false);
    }
  };

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPaymentSuccess(true);
    setTimeout(() => {
      setCart([]);
      setPaymentSuccess(false);
    }, 3500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f5] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
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
                placeholder="Tìm nhanh phân hệ, tính năng, khách hàng, đơn hàng... (ESC để đóng)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Các Phân Hệ ERP
              </div>
              {filteredApps.map(app => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      if (app.isExternal) {
                        window.open(app.url, '_blank');
                      } else {
                        setCurrentView(app.id as any);
                      }
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
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
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {app.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* UNIVERSAL TOPBAR (Chuẩn Enterprise Frosted Glass Light) */}
        <header className="h-14 border-b border-[#eae6df] bg-[#faf8f5]/90 backdrop-blur-md px-5 flex items-center justify-between z-20 shrink-0">
          {/* Left: App Switcher & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* 9-Dots App Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setIsAppSwitcherOpen(prev => !prev)}
                className={`p-2 rounded-xl transition ${
                  isAppSwitcherOpen || currentView === 'launcher'
                    ? 'bg-slate-200/80 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
                title="Mở App Launcher Grid"
              >
                <Grid className="w-4 h-4" />
              </button>

              {/* App Switcher Dropdown Drawer */}
              {isAppSwitcherOpen && (
                <div className="absolute top-12 left-0 w-80 bg-white border border-slate-200 rounded-3xl shadow-xl p-4 z-50 animate-in fade-in duration-100 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Chuyển Đổi Phân Hệ ERP</span>
                    <button
                      onClick={() => {
                        setCurrentView('launcher');
                        setIsAppSwitcherOpen(false);
                      }}
                      className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Home className="w-3 h-3" /> Về Launcher
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {launcherApps.map(app => {
                      const Icon = app.icon;
                      return (
                        <button
                          key={app.id}
                          onClick={() => {
                            if (app.isExternal) {
                              window.open(app.url, '_blank');
                            } else {
                              setCurrentView(app.id as any);
                            }
                            setIsAppSwitcherOpen(false);
                          }}
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
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Home Launcher Icon */}
            <button
              onClick={() => setCurrentView('launcher')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentView === 'launcher'
                  ? 'bg-white shadow-2xs text-slate-900 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md bg-gradient-to-br ${theme.brandGradient} flex items-center justify-center text-white`}
              >
                <Layers className="w-3 h-3" />
              </div>
              <span>BHN CORE</span>
            </button>

            {currentView !== 'launcher' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className={`text-xs font-bold capitalize ${theme.brandText}`}>
                  {launcherApps.find(a => a.id === currentView)?.name || currentView}
                </span>
              </>
            )}
          </div>

          {/* Center: Global Search Trigger (Ctrl + K) */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 w-72 bg-white/80 hover:bg-white border border-[#eae6df] px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs transition text-slate-400 text-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-slate-500">Tìm kiếm nhanh...</span>
            <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-500">
              Ctrl K
            </span>
          </div>

          {/* Right: Color Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Color Tone Switcher */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setThemeColor('red')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition ${
                  !isBlue ? 'bg-slate-100 text-[#dc0037] font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tone Đỏ lab(45 79.29 35.14)"
              >
                <span className="w-2 h-2 rounded-full bg-[#dc0037]"></span>
                <span className="text-[11px]">Đỏ Ruby</span>
              </button>
              <button
                onClick={() => setThemeColor('blue')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition ${
                  isBlue ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tone Xanh Biếc"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-[11px]">Xanh Biếc</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentView('ai')}
              className={`hidden sm:flex items-center gap-1.5 ${theme.primaryBtn} px-3 py-1.5 rounded-xl text-xs font-semibold transition`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>

            <div
              className={`w-7 h-7 rounded-full ${
                isBlue ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-[#dc0037]'
              } border flex items-center justify-center text-[11px] font-bold`}
            >
              AD
            </div>
          </div>
        </header>

        {/* VIEW 1: MASTER SOFTWARE LAUNCHER (HOME SCREEN) */}
        {currentView === 'launcher' && (
          <main className="flex-1 overflow-y-auto flex flex-col items-center justify-between py-8 px-4 relative">
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
              {/* Minimalist Clock & Date Widget (iPhone / iPad Style) */}
              <div className="text-center mb-6 select-none">
                <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-sans">
                  {timeStr || '16:00'}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 mt-2 text-xs font-medium text-slate-600 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{dateStr || 'Hôm nay'}</span>
                </div>
              </div>

              {/* EMPLOYEE SELF-SERVICE QUICK BAR (1-CLICK DAILY ESS ACTIONS) */}
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

                  <button
                    onClick={() => setCurrentView('hr')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                  >
                    <Umbrella className="w-3 h-3 text-amber-500" />
                    <span>Phép: 12d</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('hr')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                  >
                    <Receipt className="w-3 h-3 text-emerald-600" />
                    <span>Lương T11</span>
                  </button>
                </div>
              </div>

              {/* SQUIRCLE APP LAUNCHER GRID (76x76 SQUIRCLE ICONS) */}
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl justify-items-center mb-8">
                {launcherApps.map(app => {
                  const Icon = app.icon;
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        if (app.isExternal) {
                          window.open(app.url, '_blank');
                        } else {
                          setCurrentView(app.id as any);
                        }
                      }}
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
                            className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold text-white px-1 shadow-md ring-2 ring-white ${
                              isBlue ? 'bg-blue-600' : 'bg-[#dc0037]'
                            }`}
                          >
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-2.5 text-center group-hover:text-blue-600 transition">
                        {app.shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DOCK BAR (BOTTOM QUICK LAUNCH BAR) */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-3xl px-4 py-2.5 shadow-lg flex items-center gap-4">
              <button
                onClick={() => setCurrentView('pos')}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
                title="POS Quầy Thu Ngân"
              >
                <ShoppingBag className="w-5 h-5 text-[#dc0037]" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">POS</span>
              </button>

              <button
                onClick={() => setCurrentView('booking')}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
                title="Đặt Lịch Nhanh"
              >
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">Booking</span>
              </button>

              <button
                onClick={() => setCurrentView('bi')}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
                title="Báo Cáo Doanh Thu"
              >
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">BI</span>
              </button>

              <button
                onClick={() => setCurrentView('ai')}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-700 transition flex flex-col items-center gap-1 group"
                title="Hỏi AI Copilot"
              >
                <Bot className="w-5 h-5 text-pink-600" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">AI</span>
              </button>
            </div>
          </main>
        )}

        {/* VIEW 2: DEDICATED APP WORKSPACE (WHEN AN APP IS OPENED) */}
        {currentView !== 'launcher' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Sub-workspace Sidebar */}
            <aside className="w-56 border-r border-[#eae6df] bg-white flex flex-col justify-between p-3 shrink-0">
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Phân Hệ
                </div>
                {launcherApps
                  .filter(a => !a.isExternal)
                  .map(app => {
                    const Icon = app.icon;
                    const isActive = currentView === app.id;
                    return (
                      <button
                        key={app.id}
                        onClick={() => setCurrentView(app.id as any)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? `${theme.activeNav} border shadow-2xs`
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? theme.navIconActive : 'text-slate-400'}`} />
                          <span className="truncate">{app.shortName}</span>
                        </div>
                        {app.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${theme.badgeBg}`}>
                            {app.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentView('launcher')}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Quay Về Launcher</span>
              </button>
            </aside>

            {/* Sub-workspace Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: MANAGEMENT BI */}
              {currentView === 'bi' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Management BI Dashboard</h2>
                    <p className="text-sm text-slate-500">Báo cáo hợp nhất số liệu thời gian thực từ CRM, Booking, POS và HR</p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        title: 'Doanh thu POS hôm nay',
                        value: '28.450.000 ₫',
                        sub: '+18.4% so với tuần trước',
                        icon: TrendingUp,
                        color: isBlue ? 'bg-blue-50 text-blue-600' : 'bg-[#fef1f3] text-[#dc0037]'
                      },
                      {
                        title: 'Lịch hẹn đã xác nhận',
                        value: `${bookings.length} ca`,
                        sub: 'Tỉ lệ kín phòng: 88%',
                        icon: Calendar,
                        color: isBlue ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                      },
                      {
                        title: 'Hội viên CRM',
                        value: `${customers.length} khách`,
                        sub: 'Tăng trưởng: +15%',
                        icon: Users,
                        color: isBlue ? 'bg-sky-50 text-sky-600' : 'bg-orange-50 text-orange-600'
                      },
                      {
                        title: 'Chi phí hoa hồng NV',
                        value: '3.620.000 ₫',
                        sub: 'Tự động tính theo đơn POS',
                        icon: CreditCard,
                        color: 'bg-amber-50 text-amber-600'
                      }
                    ].map((kpi, idx) => {
                      const Icon = kpi.icon;
                      return (
                        <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                            <div className={`p-2 rounded-xl ${kpi.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                          <div className={`text-[11px] font-medium mt-1.5 flex items-center gap-1 ${theme.brandText}`}>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>{kpi.sub}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Transactions & Quick Insight */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-base text-slate-900">Giao dịch POS & Đơn hàng mới nhất</h3>
                        <button
                          onClick={() => setCurrentView('pos')}
                          className={`text-xs font-semibold hover:underline ${theme.brandText}`}
                        >
                          Mở POS quầy thu ngân &rarr;
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { code: 'ORD-K891', customer: 'Chị Nguyễn Thanh Hương', item: 'Gói Chăm Sóc Da Mặt Cao Cấp + Serum B5', amount: '1.070.000 ₫', time: '5 phút trước' },
                          { code: 'ORD-K890', customer: 'Anh Trần Minh Tuấn', item: 'Massage Body Đá Nóng 90p', amount: '550.000 ₫', time: '22 phút trước' },
                          { code: 'ORD-K889', customer: 'Chị Lê Thị Ngọc Ánh', item: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao', amount: '2.400.000 ₫', time: '1 giờ trước' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition">
                            <div>
                              <div className="font-semibold text-sm text-slate-900">{row.customer}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {row.item} • <span className={`font-mono font-medium ${theme.brandText}`}>{row.code}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm text-slate-900">{row.amount}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                                <Clock className="w-3 h-3" /> {row.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`bg-gradient-to-br ${theme.cardInsightBg} border rounded-2xl p-6 flex flex-col justify-between shadow-xs`}>
                      <div>
                        <div className={`flex items-center gap-2 font-bold mb-2 ${theme.cardInsightTitle}`}>
                          <Sparkles className="w-4 h-4" />
                          <span>AI Copilot Quick Insights</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Phân tích tổng hợp ngày hôm nay chỉ ra rằng lượng đặt hẹn khung giờ tối (18h-20h) đang vượt tải 120%. Đề xuất điều động thêm 1 kỹ thuật viên tăng cường để tối ưu trải nghiệm khách hàng.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('ai');
                          handleSendAi('Phân tích chi tiết điều phối lịch hẹn tối nay');
                        }}
                        className={`w-full mt-4 ${theme.primaryBtn} font-semibold py-2.5 rounded-xl text-xs transition shadow-xs`}
                      >
                        Mở Trợ Lý AI Phân Tích &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRM */}
              {currentView === 'crm' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">CRM & Quản Lý Khách Hàng</h2>
                      <p className="text-sm text-slate-500">Danh sách thành viên, tích lũy điểm thưởng và phân hạng hội viên</p>
                    </div>
                    <button
                      onClick={() => setShowAddCustomer(true)}
                      className={`${theme.primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Khách Hàng</span>
                    </button>
                  </div>

                  {showAddCustomer && (
                    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-900">Thêm Thành Viên Mới vào CRM</h3>
                        <button onClick={() => setShowAddCustomer(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Họ và tên khách hàng"
                          value={newCustName}
                          onChange={e => setNewCustName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Số điện thoại"
                          value={newCustPhone}
                          onChange={e => setNewCustPhone(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddCustomer(false)} className="px-3 py-1.5 text-xs text-slate-600">
                          Hủy
                        </button>
                        <button
                          onClick={() => {
                            if (newCustName.trim()) {
                              setCustomers(prev => [
                                { name: newCustName, phone: newCustPhone || '0901 000 111', tier: 'SILVER', points: 50, spent: '0 ₫' },
                                ...prev
                              ]);
                              setNewCustName('');
                              setNewCustPhone('');
                              setShowAddCustomer(false);
                              showToast('Đã thêm khách hàng vào CRM!');
                            }
                          }}
                          className={`${theme.primaryBtn} px-4 py-1.5 rounded-lg text-xs font-semibold`}
                        >
                          Lưu Thành Viên
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                        <tr>
                          <th className="p-4">Họ và tên</th>
                          <th className="p-4">Số điện thoại</th>
                          <th className="p-4">Hạng Hội Viên</th>
                          <th className="p-4">Điểm Tích Lũy</th>
                          <th className="p-4">Tổng Chi Tiêu</th>
                          <th className="p-4">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {customers.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition">
                            <td className="p-4 font-semibold text-slate-900">{c.name}</td>
                            <td className="p-4 font-mono text-xs text-slate-600">{c.phone}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {c.tier}
                              </span>
                            </td>
                            <td className={`p-4 font-bold ${theme.brandText}`}>{c.points} pts</td>
                            <td className="p-4 font-semibold text-slate-900">{c.spent}</td>
                            <td className="p-4">
                              <button
                                onClick={() => setCurrentView('pos')}
                                className={`text-xs font-semibold hover:underline ${theme.brandText}`}
                              >
                                Lên đơn POS &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKING */}
              {currentView === 'booking' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Booking & Điều Phối Lịch Hẹn</h2>
                      <p className="text-sm text-slate-500">Lịch trình chăm sóc, phân bổ kỹ thuật viên và phòng dịch vụ</p>
                    </div>
                    <button
                      onClick={() => setShowAddBooking(true)}
                      className={`${theme.primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Đặt Lịch Mới</span>
                    </button>
                  </div>

                  {showAddBooking && (
                    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-900">Tạo Lịch Hẹn Dịch Vụ Mới</h3>
                        <button onClick={() => setShowAddBooking(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Tên khách hàng"
                          value={newBookingCust}
                          onChange={e => setNewBookingCust(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                        />
                        <select
                          value={newBookingService}
                          onChange={e => setNewBookingService(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                        >
                          <option>Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell</option>
                          <option>Massage Body Đá Nóng Himalaya 90p</option>
                          <option>Trị Liệu Phục Hồi Chuyên Sâu</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Khung giờ (vd: 19:30 - Hôm nay)"
                          value={newBookingTime}
                          onChange={e => setNewBookingTime(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddBooking(false)} className="px-3 py-1.5 text-xs text-slate-600">
                          Hủy
                        </button>
                        <button
                          onClick={() => {
                            if (newBookingCust.trim()) {
                              setBookings(prev => [
                                ...prev,
                                {
                                  id: Date.now(),
                                  customer: newBookingCust,
                                  service: newBookingService,
                                  time: newBookingTime,
                                  staff: 'KTV. Trần Mai',
                                  status: 'CONFIRMED'
                                }
                              ]);
                              setNewBookingCust('');
                              setShowAddBooking(false);
                              showToast('Đã lên lịch hẹn và phát sự kiện booking.created!');
                            }
                          }}
                          className={`${theme.primaryBtn} px-4 py-1.5 rounded-lg text-xs font-semibold`}
                        >
                          Xác Nhận Lịch
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bookings.map(b => (
                      <div key={b.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-mono font-semibold flex items-center gap-1 ${theme.brandText}`}>
                            <Clock className="w-3.5 h-3.5" /> {b.time}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${theme.badgeBg}`}>
                            {b.status}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{b.customer}</div>
                          <div className="text-xs text-slate-600 mt-1">{b.service}</div>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                          <span>Phụ trách: <strong className="text-slate-800">{b.staff}</strong></span>
                          <CheckCircle2 className={`w-4 h-4 ${theme.brandText}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: POS */}
              {currentView === 'pos' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">ERP / POS Bán Hàng Tại Quầy</h2>
                    <p className="text-sm text-slate-500">Quét chọn sản phẩm, tính điểm và tạo mã VietQR thanh toán tự động</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="font-bold text-sm text-slate-700">Danh Mục Sản Phẩm & Dịch Vụ</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posProducts.map(item => (
                          <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                            <div>
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                                {item.sku}
                              </span>
                              <h4 className="font-bold text-slate-900 mt-2">{item.name}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                              <span className="font-bold text-slate-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                              <button
                                onClick={() => addToCart(item)}
                                className={`${theme.primaryBtn} px-3 py-1.5 rounded-lg text-xs font-semibold transition`}
                              >
                                + Thêm
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-fit space-y-4">
                      <div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                          <h3 className="font-bold text-sm text-slate-900">Hóa Đơn Thu Ngân</h3>
                          <span className="text-[10px] font-mono text-slate-400">#ORD-K992</span>
                        </div>

                        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                          {cart.length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-400">Chưa có sản phẩm nào trong đơn</div>
                          ) : (
                            cart.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl">
                                <div className="truncate pr-2">
                                  <div className="font-medium text-slate-800">{item.name}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {item.quantity} x {item.price.toLocaleString('vi-VN')} ₫
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                                  <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Điểm tích lũy dự kiến:</span>
                          <span className={`font-bold ${theme.brandText}`}>+{Math.floor(cartTotal / 100000)} pts</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900">
                          <span>Tổng thanh toán:</span>
                          <span className={theme.brandText}>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                        </div>

                        {paymentSuccess ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Thanh toán thành công! NATS đã phát event `order.paid`.</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className={`w-full ${theme.primaryBtn} disabled:opacity-50 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition`}
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Thanh Toán VietQR & Tiền Mặt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HR */}
              {currentView === 'hr' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">HR & Quản Trị Nhân Sự & Bảng Lương</h2>
                      <p className="text-sm text-slate-500">Tự động tính hoa hồng theo đơn POS và ca phục vụ Booking</p>
                    </div>
                    <button
                      onClick={() => {
                        setPayrollSuccess(true);
                        setTimeout(() => setPayrollSuccess(false), 3500);
                      }}
                      className={`${theme.primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Chạy Tính Lương & Hoa Hồng Tự Động</span>
                    </button>
                  </div>

                  {payrollSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bảng lương tháng đã được tính toán tự động dựa trên doanh số POS và ca phục vụ hoàn tất!</span>
                    </div>
                  )}

                  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                        <tr>
                          <th className="p-4">Mã NV</th>
                          <th className="p-4">Họ và tên</th>
                          <th className="p-4">Vị trí</th>
                          <th className="p-4">Lương Cơ Bản</th>
                          <th className="p-4">Tỉ lệ Hoa Hồng</th>
                          <th className="p-4">Hoa hồng tháng này</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {[
                          { code: 'EMP-001', name: 'Nguyễn Thị Mai', dept: 'KTV Trị Liệu', salary: '10.000.000 ₫', rate: '8.0%', comm: '3.420.000 ₫' },
                          { code: 'EMP-002', name: 'Trần Văn Hoàng', dept: 'Tư Vấn KH', salary: '9.000.000 ₫', rate: '5.0%', comm: '2.150.000 ₫' },
                          { code: 'EMP-003', name: 'Bác sĩ Lê Đình Trọng', dept: 'Chuyên Khoa Da Liễu', salary: '25.000.000 ₫', rate: '10.0%', comm: '6.800.000 ₫' }
                        ].map((e, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition">
                            <td className={`p-4 font-mono text-xs font-semibold ${theme.brandText}`}>{e.code}</td>
                            <td className="p-4 font-semibold text-slate-900">{e.name}</td>
                            <td className="p-4 text-xs text-slate-500">{e.dept}</td>
                            <td className="p-4 font-semibold text-slate-800">{e.salary}</td>
                            <td className="p-4 font-mono text-xs text-amber-700 font-bold">{e.rate}</td>
                            <td className={`p-4 font-bold ${theme.brandText}`}>{e.comm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: AI COPILOT */}
              {currentView === 'ai' && (
                <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bot className={`w-6 h-6 ${theme.brandText}`} />
                      <h2 className="text-2xl font-bold text-slate-900">AI Copilot Điều Hành Doanh Nghiệp (2026)</h2>
                    </div>
                    <p className="text-sm text-slate-500">
                      Truy vấn dữ liệu thời gian thực từ Postgres 17 (pgvector) kết hợp trí tuệ nhân tạo Gemini 2.5 Flash / GPT-4o
                    </p>
                  </div>

                  <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 overflow-y-auto space-y-4 min-h-[420px] max-h-[520px] shadow-xs">
                    {aiMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                            msg.sender === 'user'
                              ? `${theme.chatBubbleUser} font-medium rounded-tr-none`
                              : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className={`flex items-center gap-2 text-xs italic ${theme.brandText}`}>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        AI Copilot đang phân tích dữ liệu ERP từ PostgreSQL...
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      'Báo cáo doanh thu và occupancy hôm nay',
                      'Khách hàng nào sắp hết hạn liệu trình cần chăm sóc?',
                      'Đề xuất tối ưu ca trực kỹ thuật viên tối nay',
                      'Top 3 sản phẩm bán chạy nhất tuần qua'
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendAi(prompt)}
                        className="text-xs bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg shadow-2xs transition"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={e => setAiQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendAi()}
                      placeholder="Đặt câu hỏi cho AI Copilot về doanh thu, khách hàng, booking..."
                      className={`flex-1 bg-white border border-slate-300 ${theme.inputFocus} focus:ring-2 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs`}
                    />
                    <button
                      onClick={() => handleSendAi()}
                      disabled={aiLoading}
                      className={`${theme.primaryBtn} disabled:opacity-50 px-6 rounded-xl font-bold flex items-center gap-2 transition shadow-xs`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: SYSTEM CONFIG */}
              {currentView === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Cấu Hình Hệ Thống & Hạ Tầng VPS Node</h2>
                    <p className="text-sm text-slate-500">Giám sát container Docker, phân quyền RBAC và bản quyền bàn giao</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <Server className="w-4 h-4 text-emerald-600" />
                        <span>Trạng Thái Cụm Container</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>PostgreSQL 17:</span>
                          <span className="font-semibold text-emerald-600">Healthy (Port 5432)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>NATS 2.29 JetStream:</span>
                          <span className="font-semibold text-emerald-600">Running (Port 4222)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Valkey 8 Cache:</span>
                          <span className="font-semibold text-emerald-600">Connected (Port 6379)</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Traefik v3 Proxy:</span>
                          <span className="font-semibold text-emerald-600">SSL Auto (Port 443)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Giấy Phép Bản Quyền (License)</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Hình thức:</span>
                          <span className="font-semibold text-slate-800">Source-Available Enterprise</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Pháp nhân cấp:</span>
                          <span className="font-semibold text-slate-800">BHN Enterprise Global</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Hạn bảo dưỡng AMC:</span>
                          <span className="font-semibold text-emerald-600">31/12/2027</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <Command className="w-4 h-4 text-purple-600" />
                        <span>Phân Quyền Ma Trận (RBAC)</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Super Administrator:</span>
                          <span className="font-semibold text-slate-800">Toàn quyền hệ thống</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span>Quản Lý Chi Nhánh:</span>
                          <span className="font-semibold text-slate-800">BI, Booking, CRM, HR</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Thu Ngân (Cashier):</span>
                          <span className="font-semibold text-slate-800">POS, Đơn hàng, VietQR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
