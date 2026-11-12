'use client';

import React, { useState } from 'react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import {
  ShoppingBag,
  Receipt,
  Clock,
  Package,
  Sliders,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  QrCode,
  Printer,
  Check,
  RotateCcw,
  DollarSign,
  AlertCircle,
  UserCheck,
  FileText,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
}

export default function PosAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState('register');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isBlue = themeColor === 'blue';
  const primaryColorHex = isBlue ? '#2563eb' : '#dc0037';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';
  const brandBg = isBlue ? 'bg-blue-50' : 'bg-[#fef1f3]';
  const brandBorder = isBlue ? 'border-blue-200' : 'border-[#fcd0d8]';

  // Subpages without badges (clean SaaS style)
  const posSubpages: SubpageItem[] = [
    { id: 'register', label: 'Quầy Thu Ngân POS', icon: ShoppingBag },
    { id: 'orders', label: 'Lịch Sử Hóa Đơn', icon: Receipt },
    { id: 'shifts', label: 'Quản Lý Ca Làm Việc', icon: Clock },
    { id: 'inventory', label: 'Tồn Kho Tại Quầy', icon: Package },
    { id: 'settings', label: 'Cấu Hình Máy In & QR', icon: Sliders }
  ];

  // Mock Products & Services Catalog
  const [posProducts] = useState([
    { id: '1', sku: 'SRV-01', name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', price: 450000, category: 'Dịch vụ Spa', stock: 999 },
    { id: '2', sku: 'PRD-02', name: 'Serum Dưỡng Ẩm Phục Hồi B5 50ml', price: 620000, category: 'Mỹ phẩm', stock: 42 },
    { id: '3', sku: 'SRV-03', name: 'Massage Body Đá Nóng Himalaya 90p', price: 550000, category: 'Dịch vụ Spa', stock: 999 },
    { id: '4', sku: 'PRD-04', name: 'Kem Chống Nắng Phổ Rộng SPF50+', price: 480000, category: 'Mỹ phẩm', stock: 18 },
    { id: '5', sku: 'SRV-05', name: 'Combo HIFU Nâng Cơ Trẻ Hóa 2026', price: 2400000, category: 'Trị Liệu', stock: 999 },
    { id: '6', sku: 'PRD-06', name: 'Toner Cân Bằng Cấp Ẩm Hoa Cúc 200ml', price: 380000, category: 'Mỹ phẩm', stock: 5 },
    { id: '7', sku: 'SRV-07', name: 'Liệu Trình Trị Mụn Chuẩn Y Khoa 60p', price: 650000, category: 'Trị Liệu', stock: 999 },
    { id: '8', sku: 'PRD-08', name: 'Mặt Nạ Tế Bào Gốc EGF Hộp 5 Miếng', price: 520000, category: 'Mỹ phẩm', stock: 65 }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', sku: 'SRV-01', name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', price: 450000, quantity: 1, category: 'Dịch vụ Spa' }
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState('Chị Mai Lan (0903 123 456 - Platinum)');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cash' | 'card'>('vietqr');

  // Orders History Mock
  const [orders, setOrders] = useState([
    { id: 'ORD-8921', customer: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', total: 1070000, method: 'VietQR', cashier: 'Thu Ngân 01 - Thu Hằng', time: '10:45 - Hôm nay', status: 'PAID' },
    { id: 'ORD-8920', customer: 'Trần Văn Hoàng', phone: '0912 888 999', total: 480000, method: 'Tiền mặt', cashier: 'Thu Ngân 01 - Thu Hằng', time: '10:15 - Hôm nay', status: 'PAID' },
    { id: 'ORD-8919', customer: 'Lê Minh Tuấn', phone: '0933 445 566', total: 2400000, method: 'Thẻ POS', cashier: 'Thu Ngân 02 - Mai Trang', time: '09:30 - Hôm nay', status: 'PAID' },
    { id: 'ORD-8918', customer: 'Phạm Thu Hằng', phone: '0988 777 666', total: 620000, method: 'VietQR', cashier: 'Thu Ngân 01 - Thu Hằng', time: '09:05 - Hôm nay', status: 'PAID' }
  ]);

  // Printer & VietQR Settings State
  const [printerConfig, setPrinterConfig] = useState({
    paperSize: 'K80',
    autoCut: true,
    bankName: 'MBBank (Quân Đội)',
    accountNumber: '999908882026',
    accountHolder: 'BHN SPA CLINIC JSC',
    footerGreeting: 'Cảm ơn Quý Khách đã tin chọn BHN Spa & Clinic! Hẹn gặp lại quý khách.'
  });

  const categories = ['ALL', 'Dịch vụ Spa', 'Mỹ phẩm', 'Trị Liệu'];

  const filteredProducts = posProducts.filter(item => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const addToCart = (product: (typeof posProducts)[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Đã thêm: ${product.name}`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPaymentSuccess(true);
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      customer: selectedCustomer.split(' (')[0],
      phone: '0903 123 456',
      total: cartTotal,
      method: paymentMethod === 'vietqr' ? 'VietQR' : paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ POS',
      cashier: 'Thu Ngân 01 - Thu Hằng',
      time: 'Vừa xong',
      status: 'PAID'
    };

    setTimeout(() => {
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setPaymentSuccess(false);
      showToast(`✅ Đã thanh toán đơn ${newOrderId} thành công (${cartTotal.toLocaleString('vi-VN')} ₫)! NATS Event Bus phát 'order.paid'.`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased w-full overflow-x-hidden">
      {/* Topbar chung: Chuyển đổi giữa các phân hệ ERP qua 9-dots App Switcher */}
      <UniversalTopbar
        currentZoneName="POS Bán Hàng & Thu Ngân (Zone 4)"
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

      {/* Main SaaS Layout: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 w-full relative">
        <Sidebar
          appName="POS Bán Hàng"
          appCode="ZONE 4 • CASHIER"
          appIcon={ShoppingBag}
          gradient="linear-gradient(135deg, #dc0037 0%, #990026 100%)"
          themeColor={themeColor}
          subpages={posSubpages}
          activeSubpageId={activeTab}
          onSelectSubpage={(id) => setActiveTab(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: QUẦY THU NGÂN POS */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-[#dc0037] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Quầy Thu Ngân & Điểm Bán Hàng POS</h1>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Ghi nhận đơn bán lẻ, trừ tồn kho tức thì, quét mã VietQR động 2026 và kết nối hóa đơn điện tử
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Ca trực:</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ca Sáng (08:00 - 16:30)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Catalog side (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Category Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên dịch vụ, mã sản phẩm hoặc SKU..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#dc0037]/20 transition"
                      />
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                            selectedCategory === cat
                              ? `${primaryBtn}`
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat === 'ALL' ? 'Tất Cả' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map(item => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition group"
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {item.sku}
                            </span>
                            <span
                              className={`text-[10px] font-medium ${
                                item.stock < 10 ? 'text-amber-600 font-bold' : 'text-slate-400'
                              }`}
                            >
                              Tồn: {item.stock} {item.stock < 10 && '(Sắp hết)'}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-[#dc0037] transition">
                            {item.name}
                          </h4>
                          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.price.toLocaleString('vi-VN')} ₫
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className={`${primaryBtn} px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice / Cashier Register Register (1 col) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-fit space-y-4 sticky top-20">
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">Hóa Đơn Thu Ngân</h3>
                        <p className="text-[11px] text-slate-400 font-mono">Quầy 01 — Chi Nhánh Trung Tâm</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-700">
                        #ORD-2026
                      </span>
                    </div>

                    {/* Customer Selection */}
                    <div className="mt-3">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                        Khách hàng hội viên
                      </label>
                      <select
                        value={selectedCustomer}
                        onChange={e => setSelectedCustomer(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden"
                      >
                        <option>Chị Mai Lan (0903 123 456 - Platinum)</option>
                        <option>Anh Hoàng (0912 888 999 - Gold)</option>
                        <option>Khách Vãng Lai (Không tích điểm)</option>
                      </select>
                    </div>

                    {/* Cart Items List */}
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                      {cart.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                          Chưa có sản phẩm nào trong đơn hàng
                        </div>
                      ) : (
                        cart.map(item => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl"
                          >
                            <div className="truncate pr-2 flex-1">
                              <div className="font-medium text-slate-900 truncate">{item.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {item.price.toLocaleString('vi-VN')} ₫
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment Method Selector & Totals */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                        Hình thức thanh toán
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setPaymentMethod('vietqr')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition ${
                            paymentMethod === 'vietqr'
                              ? `${brandBg} ${brandBorder} ${brandText} font-bold ring-2 ring-[#dc0037]/20`
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          VietQR
                        </button>
                        <button
                          onClick={() => setPaymentMethod('cash')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition ${
                            paymentMethod === 'cash'
                              ? `${brandBg} ${brandBorder} ${brandText} font-bold ring-2 ring-[#dc0037]/20`
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Tiền mặt
                        </button>
                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition ${
                            paymentMethod === 'card'
                              ? `${brandBg} ${brandBorder} ${brandText} font-bold ring-2 ring-[#dc0037]/20`
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Thẻ POS
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Điểm thưởng tích lũy:</span>
                        <span className={`font-bold ${brandText}`}>
                          +{Math.floor(cartTotal / 100000)} pts
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
                        <span>Tổng thanh toán:</span>
                        <span className={`text-lg font-black ${brandText}`}>
                          {cartTotal.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>

                    {paymentSuccess ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-pulse">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Đang xác nhận mã VietQR và gửi event NATS...</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCheckout}
                          disabled={cart.length === 0}
                          className={`flex-1 ${primaryBtn} disabled:opacity-50 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition`}
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Thu Tiền Ngay</span>
                        </button>
                        <button
                          onClick={() => showToast('Đang gửi lệnh in hóa đơn qua máy in nhiệt K80...')}
                          disabled={cart.length === 0}
                          className="px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                          title="In hóa đơn tạm tính"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LỊCH SỬ HÓA ĐƠN */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Lịch Sử Hóa Đơn Bán Hàng</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Tra cứu và đối soát toàn bộ các đơn hàng đã thanh toán tại quầy trong ngày
                  </p>
                </div>
                <button
                  onClick={() => showToast('Đang xuất file Excel danh sách hóa đơn POS...')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  Xuất Excel Báo Cáo
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Mã Hóa Đơn</th>
                        <th className="py-3 px-4">Khách Hàng</th>
                        <th className="py-3 px-4">Tổng Tiền</th>
                        <th className="py-3 px-4">Phương Thức</th>
                        <th className="py-3 px-4">Thu Ngân</th>
                        <th className="py-3 px-4">Thời Gian</th>
                        <th className="py-3 px-4">Trạng Thái</th>
                        <th className="py-3 px-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      {orders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{ord.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{ord.customer}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{ord.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {ord.total.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                              {ord.method}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{ord.cashier}</td>
                          <td className="py-3.5 px-4 text-slate-500">{ord.time}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đã Hoàn Tất
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => showToast(`Đang in lại biên lai cho mã đơn ${ord.id}...`)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                              In Lại Bill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ CA LÀM VIỆC & KẾT CA */}
          {activeTab === 'shifts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quản Lý Ca Làm Việc & Bàn Giao Tiền Mặt</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kiểm soát dòng tiền mặt, chuyển khoản VietQR và chốt sổ cuối ca thu ngân
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tiền mặt quỹ đầu ca</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">2.000.000 ₫</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Bàn giao từ ca tối hôm trước</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tổng thu VietQR / Thẻ trong ca</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">4.090.000 ₫</div>
                  <span className="text-[11px] text-emerald-500 mt-1 block">Đã đối soát khớp lệnh ngân hàng</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Tổng tiền mặt thu tại két</span>
                  <div className="text-2xl font-bold text-[#dc0037] mt-1">480.000 ₫</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Két hiện có: 2.480.000 ₫</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Biên Bản Kết Ca & Bàn Giao Thu Ngân</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Thu ngân bàn giao</label>
                    <input
                      type="text"
                      disabled
                      value="Nguyễn Thu Hằng (TN-01)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Thu ngân nhận ca kế tiếp</label>
                    <input
                      type="text"
                      defaultValue="Trần Mai Trang (TN-02)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 text-xs block mb-1">Ghi chú bàn giao ca</label>
                  <textarea
                    rows={2}
                    defaultValue="Két tiền mặt khớp số liệu. Hóa đơn ORD-8920 khách trả tiền mặt đã cất ngăn khóa."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('✅ Đã kết ca sáng và in biên bản bàn giao két tiền mặt thành công!')}
                    className={`${primaryBtn} px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chốt Kết Ca & Bàn Giao</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TỒN KHO TẠI QUẦY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Kiểm Soát Tồn Kho Tại Quầy Thu Ngân</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Cảnh báo mặt hàng sắp hết và tự động tạo phiếu đề xuất nhập hàng từ kho tổng
                  </p>
                </div>
                <button
                  onClick={() => showToast('Đã gửi phiếu đề nghị xuất kho tổng cho 2 mặt hàng sắp hết!')}
                  className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Đề Xuất Nhập Hàng</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Mã SKU</th>
                      <th className="py-3 px-4">Tên Sản Phẩm / Mỹ Phẩm</th>
                      <th className="py-3 px-4">Đơn Giá Niêm Yết</th>
                      <th className="py-3 px-4">Tồn Thực Tế</th>
                      <th className="py-3 px-4">Định Mức Tối Thiểu</th>
                      <th className="py-3 px-4">Trạng Thái Kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {posProducts
                      .filter(p => p.category === 'Mỹ phẩm')
                      .map(p => {
                        const isLow = p.stock < 20;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{p.sku}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">{p.name}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {p.price.toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{p.stock} Hộp/Chai</td>
                            <td className="py-3.5 px-4 text-slate-500">20 Hộp/Chai</td>
                            <td className="py-3.5 px-4">
                              {isLow ? (
                                <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Cảnh Báo Hết Hàng</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Đầy Đủ Tồn
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CẤU HÌNH MÁY IN BILL & VIETQR */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Cấu Hình Máy In Bill & Cổng VietQR Quầy</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Thiết lập mẫu in hóa đơn nhiệt và tài khoản ngân hàng thụ hưởng mã QR động
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Printer className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-sm text-slate-900">Máy In Hóa Đơn Nhiệt (Thermal Printer)</h3>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Khổ giấy in</label>
                    <select
                      value={printerConfig.paperSize}
                      onChange={e => setPrinterConfig({ ...printerConfig, paperSize: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    >
                      <option value="K80">K80 (Khổ rộng tiêu chuẩn 80mm)</option>
                      <option value="K58">K58 (Khổ nhỏ 58mm)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-700 font-medium">Tự động cắt giấy khi in xong</span>
                    <input
                      type="checkbox"
                      checked={printerConfig.autoCut}
                      onChange={e => setPrinterConfig({ ...printerConfig, autoCut: e.target.checked })}
                      className="w-4 h-4 rounded-sm text-[#dc0037]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Lời chào chân trang bill</label>
                    <textarea
                      rows={2}
                      value={printerConfig.footerGreeting}
                      onChange={e => setPrinterConfig({ ...printerConfig, footerGreeting: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                    />
                  </div>
                  <button
                    onClick={() => showToast('Đang gửi lệnh in test ra máy in K80...')}
                    className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                  >
                    In Thử Nghiệm Mẫu Hóa Đơn (Test Print)
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <QrCode className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-sm text-slate-900">Cổng Nhận Tiền VietQR Động</h3>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Ngân hàng thụ hưởng</label>
                    <input
                      type="text"
                      value={printerConfig.bankName}
                      onChange={e => setPrinterConfig({ ...printerConfig, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Số tài khoản nhận</label>
                    <input
                      type="text"
                      value={printerConfig.accountNumber}
                      onChange={e => setPrinterConfig({ ...printerConfig, accountNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      value={printerConfig.accountHolder}
                      onChange={e => setPrinterConfig({ ...printerConfig, accountHolder: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <button
                    onClick={() => showToast('✅ Đã lưu cấu hình máy in và VietQR thành công!')}
                    className={`w-full ${primaryBtn} py-2.5 rounded-xl text-xs font-bold transition`}
                  >
                    Lưu Cấu Hình Quầy Thu Ngân
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
