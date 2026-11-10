import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CRM & Khách Hàng — BHN CORE Zone 2',
  description: 'Phân hệ quản trị quan hệ khách hàng, phân hạng & chăm sóc hội viên'
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
