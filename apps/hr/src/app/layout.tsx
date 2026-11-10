import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HR & Bảng Lương — BHN CORE Zone 5',
  description: 'Phân hệ quản trị nhân sự, chấm công, tự động hóa hoa hồng và tính lương'
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
