'use client';

import React, { useState } from 'react';
import { UniversalTopbar } from '@erp/ui';
import { ShoppingBag, QrCode, Trash2, Check, Plus, Package } from 'lucide-react';

export default function PosAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [posProducts] = useState([
    { id: '1', sku: 'SRV-01', name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', price: 450000, category: 'Dịch vụ Spa', stock: 999 },
    { id: '2', sku: 'PRD-02', name: 'Serum Dưỡng Ẩm Phục Hồi B5 50ml', price: 620000, category: 'Mỹ phẩm', stock: 85 },
    { id: '3', sku: 'SRV-03', name: 'Massage Body Đá Nóng Himalaya 90p', price: 550000, category: 'Dịch vụ Spa', stock: 999 },
    { id: '4', sku: 'PRD-04', name: 'Kem Chống Nắng Phổ Rộng SPF50+', price: 480000, category: 'Mỹ phẩm', stock: 120 },
    { id: '5', sku: 'SRV-05', name: 'Combo HIFU Trẻ Hóa Công Nghệ Cao', price: 2400000, category: 'Trị Liệu', stock: 999 }
  ]);

  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([
    { id: '1', name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell', price: 450000, quantity: 1 }
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

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
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <UniversalTopbar
        currentZoneName="ERP / POS Bán Hàng (Zone 4)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-[#dc0037] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Phân Hệ Thu Ngân POS & Quản Lý Kho Vận</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận đơn bán lẻ, trừ tồn kho tức thì, quét mã VietQR động và kết nối hóa đơn điện tử
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-400" />
              <span>Danh Mục Sản Phẩm & Dịch Vụ Tại Quầy</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posProducts.map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.sku}
                      </span>
                      <span className="text-[10px] text-slate-400">Tồn: {item.stock}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mt-2">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                    <button
                      onClick={() => addToCart(item)}
                      className={`${primaryBtn} px-3 py-1.5 rounded-lg text-xs font-semibold transition`}
                    >
                      + Thêm Đơn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cashier Invoice Register */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-fit space-y-4">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Hóa Đơn Thu Ngân</h3>
                <span className="text-[10px] font-mono text-slate-400">#ORD-{Date.now().toString(36).slice(-4).toUpperCase()}</span>
              </div>

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">Chưa có sản phẩm nào trong hóa đơn</div>
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
                <span className={`font-bold ${brandText}`}>+{Math.floor(cartTotal / 100000)} pts</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Tổng thanh toán:</span>
                <span className={brandText}>{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>

              {paymentSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đã thanh toán thành công! NATS Broker đã phát event `order.paid`.</span>
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`w-full ${primaryBtn} disabled:opacity-50 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Thanh Toán VietQR & Tiền Mặt</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
