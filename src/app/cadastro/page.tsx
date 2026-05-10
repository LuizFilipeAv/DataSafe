"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Building2, Mail, Hash, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import { Input, Button } from "@/components/ui";

export default function CadastroPage() {
  const router = useRouter();
  const { cadastrarEmpresa } = useEPI();

  const [form, setForm] = useState({ nome: "", email: "", cnpj: "", senha: "", confirmarSenha: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErro("");
  };

  const handleCNPJ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 14);
    const formatted = raw
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
    setForm((prev) => ({ ...prev, cnpj: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (form.senha !== form.confirmarSenha) { setErro("As senhas não coincidem."); return; }
    if (form.senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    setCarregando(true);
    const ok = await cadastrarEmpresa({ nome: form.nome, email: form.email, cnpj: form.cnpj, senha: form.senha });
    if (ok) {
      setSucesso(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setErro("Este e-mail já está em uso. Tente outro.");
    }
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF8C00] shadow-lg shadow-orange-900/40 mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Criar Conta Empresarial</h1>
          <p className="text-slate-400 text-sm mt-1">DataSafe — Gestão de EPIs</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 shadow-2xl">
          {sucesso ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle size={48} className="text-green-400" />
              <p className="font-semibold text-slate-100">Empresa cadastrada com sucesso!</p>
              <p className="text-slate-400 text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none" />
                <Input label="Nome da Empresa" name="nome" placeholder="Empresa Exemplo Ltda." value={form.nome} onChange={handleChange} className="pl-9" required />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none" />
                <Input label="E-mail Corporativo" name="email" type="email" placeholder="contato@empresa.com" value={form.email} onChange={handleChange} className="pl-9" required />
              </div>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none" />
                <Input label="CNPJ" name="cnpj" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={handleCNPJ} className="pl-9" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none" />
                  <Input label="Senha" name="senha" type="password" placeholder="••••••" value={form.senha} onChange={handleChange} className="pl-9" required />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-[2.6rem] text-slate-500 pointer-events-none" />
                  <Input label="Confirmar Senha" name="confirmarSenha" type="password" placeholder="••••••" value={form.confirmarSenha} onChange={handleChange} className="pl-9" required />
                </div>
              </div>
              {erro && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{erro}</p>
                </div>
              )}
              <Button type="submit" className="w-full justify-center mt-2" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Criar Conta Empresarial"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[#FF8C00] hover:text-orange-400 font-medium transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}