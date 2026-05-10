"use client";

import Sidebar from "./Sidebar";
import AuthGuard from "./AuthGuard";

interface PrivateLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function PrivateLayout({ children, title, subtitle }: PrivateLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 animate-fade-in">
          {/* Cabeçalho da Página */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
