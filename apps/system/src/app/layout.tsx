import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hệ Thống & Tháp Điều Khiển — Viet Travel Enterprise Group (Zone 8)',
  description: 'Quản trị cơ cấu tổ chức công ty du lịch lữ hành đa chi nhánh, nhân sự, phân quyền RBAC và hệ thống'
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
