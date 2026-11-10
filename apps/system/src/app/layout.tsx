import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hệ Thống & Tháp Điều Khiển — BHN CORE Zone 8',
  description: 'Quản trị cơ cấu tổ chức, người dùng, phân quyền RBAC, tích hợp và giám sát VPS'
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
