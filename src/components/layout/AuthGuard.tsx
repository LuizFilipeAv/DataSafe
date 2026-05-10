"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEPI } from "@/context/EPIContext";
import { ShieldCheck } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { sessao, isLoading } = useEPI();
  const router = useRouter();

  // Redireciona para login se não houver sessão ativa
  useEffect(() => {
    if (!isLoading && !sessao) {
      router.replace("/login");
    }
  }, [sessao, isLoading, router]);

  // Tela de carregamento enquanto verifica a sessão
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF8C00] flex items-center justify-center animate-pulse">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <p className="text-slate-400 text-sm">Carregando DataSafe...</p>
        </div>
      </div>
    );
  }

  if (!sessao) return null;

  return <>{children}</>;
}
