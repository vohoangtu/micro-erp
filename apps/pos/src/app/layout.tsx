import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ERP / POS Bán Hàng — BHN CORE Zone 4',
  description: 'Phân hệ điểm bán hàng POS, xuất nhập tồn kho, hóa đơn và quét mã VietQR'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#faf8f5] text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
