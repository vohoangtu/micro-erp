import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BHN Member App — Cổng Hội Viên',
  description: 'Đặt lịch chăm sóc, quản lý thẻ thành viên và ưu đãi tích điểm'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-100 text-slate-900 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-white border-x border-slate-200/80 shadow-md flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
