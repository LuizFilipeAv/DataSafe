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
      <div className="min-h-[100dvh] app-background">
        <Sidebar />
        <main className="min-h-[100dvh] pb-28 pt-7 md:ml-72 md:pb-10 md:pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 animate-fade-in">
          {/* Cabeçalho da Página */}
          <div className="mb-8 flex flex-col gap-2 border-b border-slate-700/60 pb-6 sm:mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8C00]">DataSafe</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{title}</h1>
            {subtitle && (
              <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{subtitle}</p>
            )}
          </div>
          {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
