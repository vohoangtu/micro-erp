import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BHN CORE — Enterprise Management BI & ERP',
  description: 'Trung tâm điều hành doanh nghiệp tích hợp dữ liệu & AI Copilot'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
