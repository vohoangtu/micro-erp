'use client';

import React, { useState } from 'react';
import { UniversalTopbar } from '@erp/ui';
import { Users, Plus, X, Search, Filter, ShieldCheck, Heart, Sparkles, MessageSquare } from 'lucide-react';

export default function CrmAppPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeTab, setActiveTab] = useState<'customers' | 'tiers' | 'zns'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [customers, setCustomers] = useState([
    { name: 'Nguyễn Thị Mai Lan', phone: '0903 123 456', email: 'mailan@gmail.com', tier: 'PLATINUM', points: 640, spent: '18.500.000 ₫' },
    { name: 'Trần Văn Hoàng', phone: '0912 888 999', email: 'hoang.tran@gmail.com', tier: 'GOLD', points: 320, spent: '9.200.000 ₫' },
    { name: 'Phạm Thu Hằng', phone: '0988 777 666', email: 'thuhang@yahoo.com', tier: 'SILVER', points: 80, spent: '2.800.000 ₫' },
    { name: 'Lê Minh Tuấn', phone: '0933 445 566', email: 'tuan.lm@corp.vn', tier: 'DIAMOND', points: 1250, spent: '35.000.000 ₫' }
  ]);

  const isBlue = themeColor === 'blue';
  const primaryBtn = isBlue
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
    : 'bg-[#dc0037] hover:bg-[#b9002e] text-white shadow-xs';
  const brandText = isBlue ? 'text-blue-600' : 'text-[#dc0037]';

  const filteredCustomers = customers.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <UniversalTopbar
        currentZoneName="CRM & Khách Hàng (Zone 2)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Phân Hệ CRM & Quản Lý Hội Viên</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phân hệ độc lập phụ trách dữ liệu khách hàng 360°, điểm thưởng loyalty và tích hợp tin nhắn Zalo ZNS
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddCustomer(true)}
              className={`${primaryBtn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition`}
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Khách Hàng</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'customers', label: `Danh Bạ Khách Hàng (${customers.length})` },
            { id: 'tiers', label: 'Quy Chuẩn Hạng Hội Viên (Tiering)' },
            { id: 'zns', label: 'Chăm Sóc Tự Động Zalo ZNS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Customer Modal */}
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
                      { name: newCustName, phone: newCustPhone || '0901 000 111', email: 'khachhang@bhn.vn', tier: 'SILVER', points: 50, spent: '0 ₫' },
                      ...prev
                    ]);
                    setNewCustName('');
                    setNewCustPhone('');
                    setShowAddCustomer(false);
                  }
                }}
                className={`${primaryBtn} px-4 py-1.5 rounded-lg text-xs font-semibold`}
              >
                Lưu Khách Hàng
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 pl-1" />
          <input
            type="text"
            placeholder="Tìm theo họ tên hoặc số điện thoại..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 text-xs text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        {/* TAB CONTENT: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Họ và tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Hạng Hội Viên</th>
                  <th className="p-4">Điểm Tích Lũy</th>
                  <th className="p-4">Tổng Chi Tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="p-4 font-mono text-xs text-slate-600">{c.phone}</td>
                    <td className="p-4 text-xs text-slate-500">{c.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {c.tier}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${brandText}`}>{c.points} pts</td>
                    <td className="p-4 font-semibold text-slate-900">{c.spent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB CONTENT: TIERS */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'Standard', min: '0 pts', discount: 'Mặc định', desc: 'Quyền lợi cơ bản cho khách mới' },
              { name: 'Silver', min: '50 pts', discount: 'Giảm 5%', desc: 'Tặng voucher sinh nhật 200.000 ₫' },
              { name: 'Gold', min: '200 pts', discount: 'Giảm 10%', desc: 'Miễn phí 1 buổi tư vấn da liễu' },
              { name: 'Platinum', min: '500 pts', discount: 'Giảm 15%', desc: 'Ưu tiên phòng VIP 1 và đặt hẹn giờ vàng' }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-mono text-amber-600 font-bold px-2 py-0.5 bg-amber-50 rounded-md">
                  TỪ {t.min}
                </span>
                <h3 className="font-bold text-base text-slate-900">{t.name}</h3>
                <div className={`text-sm font-bold ${brandText}`}>{t.discount}</div>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB CONTENT: ZNS */}
        {activeTab === 'zns' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Chiến Dịch Chăm Sóc Khách Hàng Tự Động (Zalo ZNS Template)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tích hợp chính thức với Zalo Cloud Account (ZCA). Hệ thống tự động phát tin nhắn xác nhận lịch hẹn, thông báo tích điểm hóa đơn POS và chúc mừng sinh nhật theo ID khách hàng CRM.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
              [Template ID: 3120] Kính gửi Quý khách {"{{customer_name}}"}, đơn hàng {"{{order_code}}"} tại BHN Core đã được xác nhận. Quý khách nhận được +{"{{points}}"} điểm thưởng!
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
