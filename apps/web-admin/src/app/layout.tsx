import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BHN CORE - Management BI & Microservice ERP',
  description: 'Trung tâm điều hành doanh nghiệp tích hợp dữ liệu & AI Copilot'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#071615] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
