import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Booking & Lịch Hẹn — BHN CORE Zone 3',
  description: 'Phân hệ quản trị lịch hẹn, điều phối kỹ thuật viên và phòng dịch vụ'
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
