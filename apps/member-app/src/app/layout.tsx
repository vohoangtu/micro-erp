import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BHN Member App - Cổng Hội Viên',
  description: 'Đặt lịch chăm sóc, quản lý thẻ thành viên và ưu đãi tích điểm'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#051311] text-slate-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-[#071917] border-x border-[#14332f] flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
