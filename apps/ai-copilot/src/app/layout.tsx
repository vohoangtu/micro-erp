import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Copilot 2026 — BHN CORE Zone 6',
  description: 'Trợ lý điều hành doanh nghiệp thế hệ mới tích hợp RAG trên PostgreSQL 17 và Gemini 2.5 Flash'
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
