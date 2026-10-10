"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import { Input, Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useEPI();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const sucesso = await login(email, senha);
    if (sucesso) {
      router.push("/dashboard");
    } else {
      setErro("E-mail ou senha inválidos. Verifique seus dados.");
    }
    setCarregando(false);
  };

  return (
    <div className="min-h-[100svh] app-background flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF8C00] shadow-xl shadow-orange-950/40 mb-5">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
            DataSafe
          </h1>
          <p className="text-slate-400 text-sm mt-2 tracking-wide">
            Gestão Inteligente de EPIs
          </p>
        </div>
        <div className="bg-slate-800/75 border border-slate-700/80 rounded-3xl p-6 shadow-panel backdrop-blur-sm sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF8C00]">Área segura</p>
            <h2 className="text-xl font-semibold text-slate-100 mt-2">
            Acesso ao Sistema
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none"
              />
              <Input
                label="E-mail corporativo"
                type="email"
                placeholder="empresa@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none"
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pl-9"
                required
              />
            </div>
            {erro && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{erro}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full justify-center mt-2"
              disabled={carregando}
            >
              {carregando ? "Autenticando..." : "Entrar no Sistema"}
              {!carregando && <ArrowRight size={16} />}
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Ainda não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="text-[#FF8C00] hover:text-orange-300 font-semibold transition-colors"
          >
            Cadastrar empresa
          </Link>
        </p>
      </div>
    </div>
  );
}
