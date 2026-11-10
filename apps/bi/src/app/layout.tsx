import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Management BI — BHN CORE Zone 1',
  description: 'Phân hệ quản trị thông minh, phân tích doanh thu, tài chính và công suất phục vụ'
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
