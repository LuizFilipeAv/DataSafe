"use client";

import { useState, useMemo } from "react";
import { FileText, Send, ClipboardList, CheckCircle, XCircle, Search } from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { Button, Select, Card, EmptyState } from "@/components/ui";

export default function RelatoriosPage() {
  const { funcionarios, epis, entregas, registrarEntrega } = useEPI();

  const [funcionarioId, setFuncionarioId] = useState("");
  const [epiId, setEpiId] = useState("");
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; msg: string } | null>(null);
  const [buscaHistorico, setBuscaHistorico] = useState("");

  // Filtra somente EPIs com estoque disponível
  const episDisponiveis = useMemo(
    () => epis.filter((e) => e.quantidade > 0),
    [epis]
  );

  // Filtra histórico de entregas pela busca
  const entregasFiltradas = useMemo(() => {
    const q = buscaHistorico.toLowerCase();
    return [...entregas]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .filter(
        (e) =>
          e.funcionarioNome.toLowerCase().includes(q) ||
          e.epiNome.toLowerCase().includes(q)
      );
  }, [entregas, buscaHistorico]);

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!funcionarioId || !epiId) return;

    const ok = registrarEntrega(funcionarioId, epiId);

    if (ok) {
      const funcionario = funcionarios.find((f) => f.id === funcionarioId);
      const epi = epis.find((e) => e.id === epiId);
      setFeedback({
        tipo: "sucesso",
        msg: `Entrega de "${epi?.nome}" para ${funcionario?.nome} registrada com sucesso! Estoque atualizado.`,
      });
      // Limpa o formulário
      setFuncionarioId("");
      setEpiId("");
    } else {
      setFeedback({
        tipo: "erro",
        msg: "Erro: EPI sem estoque disponível ou dados inválidos.",
      });
    }

    // Remove o feedback após 4 segundos
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <PrivateLayout
      title="Relatórios e Entregas"
      subtitle="Registre entregas de EPIs e consulte o histórico completo."
    >
      {/* Formulário de Registro de Entrega */}
      <Card className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid size-9 place-items-center rounded-xl bg-orange-500/10 text-[#FF8C00]"><Send size={17} /></div>
          <h3 className="font-semibold text-slate-100">Registrar Nova Entrega</h3>
        </div>

        <form onSubmit={handleRegistrar}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label="Funcionário"
              value={funcionarioId}
              onChange={(e) => setFuncionarioId(e.target.value)}
              required
            >
              <option value="">Selecione o funcionário...</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} — {f.cargo}
                </option>
              ))}
            </Select>

            <Select
              label="EPI (com estoque disponível)"
              value={epiId}
              onChange={(e) => setEpiId(e.target.value)}
              required
            >
              <option value="">Selecione o EPI...</option>
              {episDisponiveis.length === 0 ? (
                <option disabled>Nenhum EPI com estoque</option>
              ) : (
                episDisponiveis.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome} (CA: {e.ca}) — {e.quantidade} un.
                  </option>
                ))
              )}
            </Select>

            <Button
              type="submit"
              className="h-[42px]"
              disabled={funcionarios.length === 0 || episDisponiveis.length === 0}
            >
              <Send size={15} />
              Registrar Entrega
            </Button>
          </div>

          {/* Aviso se não houver dados suficientes */}
          {(funcionarios.length === 0 || episDisponiveis.length === 0) && (
            <p className="text-xs text-slate-500 mt-3">
              {funcionarios.length === 0
                ? "⚠️ Cadastre funcionários antes de registrar uma entrega."
                : "⚠️ Não há EPIs com estoque disponível. Atualize o estoque na tela de EPIs."}
            </p>
          )}

          {/* Feedback de resultado */}
          {feedback && (
            <div
              className={`flex items-start gap-2 mt-4 rounded-lg px-4 py-3 text-sm border ${
                feedback.tipo === "sucesso"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {feedback.tipo === "sucesso"
                ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                : <XCircle size={16} className="flex-shrink-0 mt-0.5" />
              }
              {feedback.msg}
            </div>
          )}
        </form>
      </Card>

      {/* Histórico de Entregas */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-[#FF8C00]" />
            <h3 className="font-semibold text-slate-100">Histórico de Entregas</h3>
            <span className="text-xs text-slate-500">({entregas.length} registro(s))</span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrar histórico..."
              value={buscaHistorico}
              onChange={(e) => setBuscaHistorico(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-800/70 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-[border-color,box-shadow] focus:border-[#FF8C00]/80 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-700/70 bg-slate-800/70 shadow-panel">
          {entregasFiltradas.length === 0 ? (
            <EmptyState
              icon={<FileText size={24} />}
              title="Nenhuma entrega registrada"
              description={buscaHistorico ? "Nenhum resultado para o filtro aplicado." : "As entregas registradas aparecerão aqui."}
            />
          ) : (
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-950/30">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Data e Hora</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Funcionário</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">EPI Entregue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {entregasFiltradas.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(entrega.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      <span className="text-slate-600">
                        {new Date(entrega.data).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">{entrega.funcionarioNome}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C00]" />
                        <span className="text-slate-300">{entrega.epiNome}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}
