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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FF8C00] shadow-lg shadow-orange-900/40 mb-5">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
            DataSafe
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Gestão Inteligente de EPIs
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">
            Acesso ao Sistema
          </h2>
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
              className="w-full justify-center"
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
            className="text-[#FF8C00] hover:text-orange-400 font-medium transition-colors"
          >
            Cadastrar empresa
          </Link>
        </p>
      </div>
    </div>
  );
}
