"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package, Search, AlertTriangle } from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import { EPI } from "@/types";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { Button, Input, Modal, EmptyState, Badge } from "@/components/ui";

type FormData = { nome: string; ca: string; dataValidade: string; quantidade: string };
const FORM_INICIAL: FormData = { nome: "", ca: "", dataValidade: "", quantidade: "" };

export default function EPIsPage() {
  const { epis, adicionarEPI, atualizarEPI, removerEPI } = useEPI();

  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<EPI | null>(null);
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [confirmarRemocao, setConfirmarRemocao] = useState<string | null>(null);

  const episFiltrados = epis.filter(
    (e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.ca.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (epi?: EPI) => {
    if (epi) {
      setEditando(epi);
      setForm({
        nome: epi.nome,
        ca: epi.ca,
        dataValidade: epi.dataValidade,
        quantidade: String(epi.quantidade),
      });
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
    const dados = {
      nome: form.nome,
      ca: form.ca,
      dataValidade: form.dataValidade,
      quantidade: parseInt(form.quantidade, 10) || 0,
    };
    if (editando) {
      atualizarEPI(editando.id, dados);
    } else {
      adicionarEPI(dados);
    }
    fecharModal();
  };

  // Verifica se o EPI está vencido ou próximo do vencimento
  const getStatusValidade = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diff = (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: "Vencido", color: "red" as const };
    if (diff <= 30) return { label: "Próximo do venc.", color: "orange" as const };
    return { label: "Válido", color: "green" as const };
  };

  return (
    <PrivateLayout
      title="Estoque de EPIs"
      subtitle="Gerencie os equipamentos de proteção individual da empresa."
    >
      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou CA..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#FF8C00] transition-all"
          />
        </div>
        <Button onClick={() => abrirModal()}>
          <Plus size={16} />
          Novo EPI
        </Button>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {episFiltrados.length === 0 ? (
          <EmptyState
            icon={<Package size={24} />}
            title="Nenhum EPI encontrado"
            description={busca ? "Tente outros termos na busca." : "Cadastre o primeiro EPI clicando em 'Novo EPI'."}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/30">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Equipamento</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">CA</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Validade</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Estoque</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {episFiltrados.map((epi) => {
                const status = getStatusValidade(epi.dataValidade);
                return (
                  <tr key={epi.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-200">{epi.nome}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{epi.ca}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {status.label !== "Válido" && <AlertTriangle size={14} className="text-orange-400" />}
                        <span className="text-slate-400 text-xs">
                          {new Date(epi.dataValidade + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                        <Badge color={status.color}>{status.label}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge color={epi.quantidade === 0 ? "red" : epi.quantidade <= 2 ? "orange" : "green"}>
                        {epi.quantidade} un.
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => abrirModal(epi)}>
                          <Pencil size={14} />
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setConfirmarRemocao(epi.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {epis.length > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {episFiltrados.length} de {epis.length} EPI(s) exibido(s)
        </p>
      )}

      {/* Modal formulário */}
      {modalAberto && (
        <Modal
          title={editando ? "Editar EPI" : "Novo EPI"}
          onClose={fecharModal}
        >
          <form onSubmit={handleSalvar} className="space-y-4">
            <Input label="Nome do Equipamento" name="nome" placeholder="Ex: Capacete de Segurança" value={form.nome} onChange={handleChange} required />
            <Input label="CA (Certificado de Aprovação)" name="ca" placeholder="Ex: 12345" value={form.ca} onChange={handleChange} required />
            <Input label="Data de Validade" name="dataValidade" type="date" value={form.dataValidade} onChange={handleChange} required />
            <Input label="Quantidade em Estoque" name="quantidade" type="number" min="0" placeholder="Ex: 50" value={form.quantidade} onChange={handleChange} required />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={fecharModal} className="flex-1 justify-center">Cancelar</Button>
              <Button type="submit" className="flex-1 justify-center">{editando ? "Salvar" : "Adicionar"}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal confirmação remoção */}
      {confirmarRemocao && (
        <Modal title="Confirmar Remoção" onClose={() => setConfirmarRemocao(null)}>
          <p className="text-slate-400 text-sm mb-5">Tem certeza que deseja remover este EPI do estoque?</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setConfirmarRemocao(null)} className="flex-1 justify-center">Cancelar</Button>
            <Button variant="danger" onClick={() => { removerEPI(confirmarRemocao!); setConfirmarRemocao(null); }} className="flex-1 justify-center">Remover</Button>
          </div>
        </Modal>
      )}
    </PrivateLayout>
  );
}
