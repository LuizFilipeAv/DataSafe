"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import { Funcionario } from "@/types";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { Button, Input, Modal, EmptyState, Badge } from "@/components/ui";

type FormData = { nome: string; setor: string; cargo: string };
const FORM_INICIAL: FormData = { nome: "", setor: "", cargo: "" };

export default function FuncionariosPage() {
  const { funcionarios, adicionarFuncionario, atualizarFuncionario, removerFuncionario } = useEPI();

  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [confirmarRemocao, setConfirmarRemocao] = useState<string | null>(null);

  // Filtra funcionários pela busca
  const funcionariosFiltrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.setor.toLowerCase().includes(busca.toLowerCase()) ||
      f.cargo.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (func?: Funcionario) => {
    if (func) {
      setEditando(func);
      setForm({ nome: func.nome, setor: func.setor, cargo: func.cargo });
    } else {
      setEditando(null);
      setForm(FORM_INICIAL);
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
    setForm(FORM_INICIAL);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.setor || !form.cargo) return;

    if (editando) {
      atualizarFuncionario(editando.id, form);
    } else {
      adicionarFuncionario(form);
    }
    fecharModal();
  };

  const handleRemover = (id: string) => {
    removerFuncionario(id);
    setConfirmarRemocao(null);
  };

  return (
    <PrivateLayout
      title="Funcionários"
      subtitle="Gerencie a equipe da sua empresa."
    >
      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, setor ou cargo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#FF8C00] transition-all"
          />
        </div>
        <Button onClick={() => abrirModal()}>
          <Plus size={16} />
          Novo Funcionário
        </Button>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {funcionariosFiltrados.length === 0 ? (
          <EmptyState
            icon={<Users size={24} />}
            title="Nenhum funcionário encontrado"
            description={busca ? "Tente outros termos na busca." : "Adicione o primeiro funcionário clicando em 'Novo Funcionário'."}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/30">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Nome</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Setor</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Cargo</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {funcionariosFiltrados.map((f) => (
                <tr key={f.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-200">{f.nome}</td>
                  <td className="px-5 py-3.5">
                    <Badge color="slate">{f.setor}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{f.cargo}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => abrirModal(f)}>
                        <Pencil size={14} />
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmarRemocao(f.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Total */}
      {funcionarios.length > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {funcionariosFiltrados.length} de {funcionarios.length} funcionário(s) exibido(s)
        </p>
      )}

      {/* Modal de formulário */}
      {modalAberto && (
        <Modal
          title={editando ? "Editar Funcionário" : "Novo Funcionário"}
          onClose={fecharModal}
        >
          <form onSubmit={handleSalvar} className="space-y-4">
            <Input label="Nome Completo" name="nome" placeholder="Ex: João da Silva" value={form.nome} onChange={handleChange} required />
            <Input label="Setor" name="setor" placeholder="Ex: Operações, TI, RH..." value={form.setor} onChange={handleChange} required />
            <Input label="Cargo" name="cargo" placeholder="Ex: Técnico de Segurança" value={form.cargo} onChange={handleChange} required />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={fecharModal} className="flex-1 justify-center">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 justify-center">
                {editando ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmarRemocao && (
        <Modal title="Confirmar Remoção" onClose={() => setConfirmarRemocao(null)}>
          <p className="text-slate-400 text-sm mb-5">
            Tem certeza que deseja remover este funcionário? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setConfirmarRemocao(null)} className="flex-1 justify-center">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => handleRemover(confirmarRemocao)} className="flex-1 justify-center">
              Remover
            </Button>
          </div>
        </Modal>
      )}
    </PrivateLayout>
  );
}
