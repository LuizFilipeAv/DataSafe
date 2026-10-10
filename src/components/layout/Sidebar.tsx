"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useEPI } from "@/context/EPIContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/funcionarios", label: "Funcionários", icon: Users },
  { href: "/epis", label: "Estoque de EPIs", icon: Package },
  { href: "/relatorios", label: "Relatórios", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sessao, logout } = useEPI();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 flex h-[4.75rem] flex-row border-t border-slate-700/80 bg-slate-900/95 px-2 backdrop-blur-xl md:inset-y-0 md:left-0 md:right-auto md:h-[100dvh] md:w-72 md:flex-col md:border-r md:border-t-0 md:px-0">
      {/* Logo */}
      <div className="hidden border-b border-slate-700/80 p-6 md:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF8C00] shadow-lg shadow-orange-950/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-50 text-sm tracking-wide uppercase">
              DataSafe
            </p>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
              {sessao?.empresaNome || "Empresa"}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 items-center justify-around gap-1 md:block md:space-y-1 md:p-4">
        <p className="hidden text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3 md:block">
          Menu Principal
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-[color,background-color,transform] duration-150 active:scale-95 md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5 md:text-sm group ${
                isActive
                  ? "bg-[#FF8C00]/15 text-[#FF8C00] border border-[#FF8C00]/30"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-[#FF8C00]"
                    : "text-slate-500 group-hover:text-slate-300"
                }
              />
              <span className="md:flex-1">{label}</span>
              {isActive && (
                <ChevronRight size={14} className="hidden text-[#FF8C00] md:block" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé — Usuário e Logout */}
      <div className="hidden p-4 border-t border-slate-700/80 md:block">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-slate-400 truncate">{sessao?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut size={18} className="group-hover:text-red-400" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
