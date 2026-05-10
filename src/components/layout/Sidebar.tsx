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
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FF8C00] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-50 text-sm tracking-wider uppercase">
              DataSafe
            </p>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
              {sessao?.empresaNome || "Empresa"}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Menu Principal
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
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
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight size={14} className="text-[#FF8C00]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé — Usuário e Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-slate-400 truncate">{sessao?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={18} className="group-hover:text-red-400" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
