"use client";

import { useMemo } from "react";
import {
  Users,
  Package,
  TruckIcon,
  Building2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useEPI } from "@/context/EPIContext";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { Card, Badge } from "@/components/ui";

// ── Card de resumo reutilizável ─────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  sub,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-50 mt-2">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon size={22} className="text-white" />
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { sessao, funcionarios, epis, entregas } = useEPI();

  // Calcula métricas derivadas dos dados do contexto
  const totalEstoque = useMemo(
    () => epis.reduce((acc, e) => acc + e.quantidade, 0),
    [epis],
  );

  const episCriticos = useMemo(
    () => epis.filter((e) => e.quantidade <= 2),
    [epis],
  );

  // Últimas 5 entregas para o feed de atividades
  const ultimasEntregas = useMemo(
    () =>
      [...entregas]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 5),
    [entregas],
  );

  return (
    <PrivateLayout
      title={`Olá, ${sessao?.empresaNome}`}
      subtitle="Aqui está o resumo do seu sistema de gestão de EPIs."
    >
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total de Funcionários"
          value={funcionarios.length}
          icon={Users}
          color="bg-blue-500"
          sub="cadastrados no sistema"
        />
        <StatCard
          title="EPIs em Estoque"
          value={totalEstoque}
          icon={Package}
          color="bg-[#FF8C00]"
          sub={`${epis.length} tipo(s) cadastrado(s)`}
        />
        <StatCard
          title="Entregas Realizadas"
          value={entregas.length}
          icon={TruckIcon}
          color="bg-green-500"
          sub="total histórico"
        />
        <StatCard
          title="Status da Empresa"
          value="Ativa"
          icon={Building2}
          color="bg-purple-500"
          sub={`CNPJ registrado`}
        />
      </div>

      {/* Linha inferior: Alertas + Atividade recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* EPIs com estoque crítico */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-[#FF8C00]" />
            <h3 className="font-semibold text-slate-100">Alertas de Estoque</h3>
          </div>
          {episCriticos.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">
              Todos os estoques estão em níveis adequados.
            </p>
          ) : (
            <ul className="space-y-2">
              {episCriticos.map((epi) => (
                <li
                  key={epi.id}
                  className="flex items-center justify-between bg-slate-700/40 rounded-lg px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {epi.nome}
                    </p>
                    <p className="text-xs text-slate-500">CA: {epi.ca}</p>
                  </div>
                  <Badge color={epi.quantidade === 0 ? "red" : "orange"}>
                    {epi.quantidade === 0
                      ? "Sem estoque"
                      : `${epi.quantidade} restante(s)`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Atividade recente */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[#FF8C00]" />
            <h3 className="font-semibold text-slate-100">Atividade Recente</h3>
          </div>
          {ultimasEntregas.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">
              Nenhuma entrega registrada ainda.
            </p>
          ) : (
            <ul className="space-y-3">
              {ultimasEntregas.map((e) => (
                <li key={e.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C00] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">
                      <span className="font-medium text-slate-100">
                        {e.funcionarioNome}
                      </span>{" "}
                      recebeu{" "}
                      <span className="text-[#FF8C00]">{e.epiNome}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(e.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PrivateLayout>
  );
}
