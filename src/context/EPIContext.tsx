"use client";

// ============================================================
// EPIContext.tsx — CONTEXTO GLOBAL DO DATASAFE
// Gerencia toda a lógica de estado e persistência do sistema.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Empresa,
  Funcionario,
  EPI,
  Entrega,
  SessaoAtiva,
} from "@/types";
import {
  getEmpresas,
  saveEmpresa,
  findEmpresaByEmailSenha,
  getSessao,
  saveSessao,
  clearSessao,
  getFuncionariosByEmpresa,
  saveFuncionarios,
  getEPIsByEmpresa,
  saveEPIs,
  getEntregasByEmpresa,
  saveEntregas,
  generateId,
} from "@/lib/storage";

// ── Tipagem do Contexto ─────────────────────────────────────
interface EPIContextType {
  // Estado de Autenticação
  sessao: SessaoAtiva | null;
  isLoading: boolean;

  // Dados da empresa logada
  funcionarios: Funcionario[];
  epis: EPI[];
  entregas: Entrega[];

  // Ações de Autenticação
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrarEmpresa: (dados: Omit<Empresa, "id" | "criadoEm">) => Promise<boolean>;
  logout: () => void;

  // CRUD Funcionários
  adicionarFuncionario: (dados: Omit<Funcionario, "id" | "empresaId" | "criadoEm">) => void;
  atualizarFuncionario: (id: string, dados: Partial<Funcionario>) => void;
  removerFuncionario: (id: string) => void;

  // CRUD EPIs
  adicionarEPI: (dados: Omit<EPI, "id" | "empresaId" | "criadoEm">) => void;
  atualizarEPI: (id: string, dados: Partial<EPI>) => void;
  removerEPI: (id: string) => void;

  // Entregas
  registrarEntrega: (funcionarioId: string, epiId: string) => boolean;
}

// ── Criação do Contexto ─────────────────────────────────────
const EPIContext = createContext<EPIContextType | null>(null);

// ── Hook de acesso ao contexto ──────────────────────────────
export function useEPI(): EPIContextType {
  const ctx = useContext(EPIContext);
  if (!ctx) throw new Error("useEPI deve ser usado dentro de <EPIProvider>");
  return ctx;
}

// ── Provider ────────────────────────────────────────────────
export function EPIProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<SessaoAtiva | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [epis, setEpis] = useState<EPI[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  // ──────────────────────────────────────────────────────────
  // useEffect #1: INICIALIZAÇÃO DA SESSÃO
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    const sessaoSalva = getSessao();
    if (sessaoSalva) {
      setSessao(sessaoSalva);
    }
    setIsLoading(false);
  }, []);

  // ──────────────────────────────────────────────────────────
  // useEffect #2: CARREGAMENTO DE DADOS POR EMPRESA
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (sessao?.empresaId) {
      setFuncionarios(getFuncionariosByEmpresa(sessao.empresaId));
      setEpis(getEPIsByEmpresa(sessao.empresaId));
      setEntregas(getEntregasByEmpresa(sessao.empresaId));
    } else {
      // Limpa os dados quando não há sessão ativa
      setFuncionarios([]);
      setEpis([]);
      setEntregas([]);
    }
  }, [sessao]);

  // ── Autenticação ────────────────────────────────────────
  const login = useCallback(async (email: string, senha: string): Promise<boolean> => {
    const empresa = findEmpresaByEmailSenha(email, senha);
    if (!empresa) return false;

    const novaSessao: SessaoAtiva = {
      empresaId: empresa.id,
      empresaNome: empresa.nome,
      email: empresa.email,
    };
    saveSessao(novaSessao);
    setSessao(novaSessao);
    return true;
  }, []);

  const cadastrarEmpresa = useCallback(
    async (dados: Omit<Empresa, "id" | "criadoEm">): Promise<boolean> => {
      // Verifica se o email já está em uso
      const empresas = getEmpresas();
      if (empresas.some((e) => e.email === dados.email)) return false;

      const nova: Empresa = {
        ...dados,
        id: generateId(),
        criadoEm: new Date().toISOString(),
      };
      saveEmpresa(nova);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    clearSessao();
    setSessao(null);
  }, []);

  // ── CRUD Funcionários ───────────────────────────────────
  const adicionarFuncionario = useCallback(
    (dados: Omit<Funcionario, "id" | "empresaId" | "criadoEm">) => {
      if (!sessao) return;
      const novo: Funcionario = {
        ...dados,
        id: generateId(),
        empresaId: sessao.empresaId,
        criadoEm: new Date().toISOString(),
      };
      // Atualiza o estado local e persiste no LocalStorage
      setFuncionarios((prev) => {
        const atualizados = [...prev, novo];
        saveFuncionarios(sessao.empresaId, atualizados);
        return atualizados;
      });
    },
    [sessao]
  );

  const atualizarFuncionario = useCallback(
    (id: string, dados: Partial<Funcionario>) => {
      if (!sessao) return;
      setFuncionarios((prev) => {
        const atualizados = prev.map((f) => (f.id === id ? { ...f, ...dados } : f));
        saveFuncionarios(sessao.empresaId, atualizados);
        return atualizados;
      });
    },
    [sessao]
  );

  const removerFuncionario = useCallback(
    (id: string) => {
      if (!sessao) return;
      setFuncionarios((prev) => {
        const filtrados = prev.filter((f) => f.id !== id);
        saveFuncionarios(sessao.empresaId, filtrados);
        return filtrados;
      });
    },
    [sessao]
  );

  // ── CRUD EPIs ───────────────────────────────────────────
  const adicionarEPI = useCallback(
    (dados: Omit<EPI, "id" | "empresaId" | "criadoEm">) => {
      if (!sessao) return;
      const novo: EPI = {
        ...dados,
        id: generateId(),
        empresaId: sessao.empresaId,
        criadoEm: new Date().toISOString(),
      };
      setEpis((prev) => {
        const atualizados = [...prev, novo];
        saveEPIs(sessao.empresaId, atualizados);
        return atualizados;
      });
    },
    [sessao]
  );

  const atualizarEPI = useCallback(
    (id: string, dados: Partial<EPI>) => {
      if (!sessao) return;
      setEpis((prev) => {
        const atualizados = prev.map((e) => (e.id === id ? { ...e, ...dados } : e));
        saveEPIs(sessao.empresaId, atualizados);
        return atualizados;
      });
    },
    [sessao]
  );

  const removerEPI = useCallback(
    (id: string) => {
      if (!sessao) return;
      setEpis((prev) => {
        const filtrados = prev.filter((e) => e.id !== id);
        saveEPIs(sessao.empresaId, filtrados);
        return filtrados;
      });
    },
    [sessao]
  );

  // ── Entregas ─────────────────────────────────────────────
  const registrarEntrega = useCallback(
    (funcionarioId: string, epiId: string): boolean => {
      if (!sessao) return false;

      const funcionario = funcionarios.find((f) => f.id === funcionarioId);
      const epi = epis.find((e) => e.id === epiId);

      if (!funcionario || !epi) return false;
      if (epi.quantidade <= 0) return false; // Sem estoque

      // Registra a entrega
      const novaEntrega: Entrega = {
        id: generateId(),
        empresaId: sessao.empresaId,
        funcionarioId,
        funcionarioNome: funcionario.nome,
        epiId,
        epiNome: epi.nome,
        data: new Date().toISOString(),
      };

      setEntregas((prev) => {
        const atualizadas = [...prev, novaEntrega];
        saveEntregas(sessao.empresaId, atualizadas);
        return atualizadas;
      });

      // Decrementa -1 do estoque do EPI
      atualizarEPI(epiId, { quantidade: epi.quantidade - 1 });

      return true;
    },
    [sessao, funcionarios, epis, atualizarEPI]
  );

  const value: EPIContextType = {
    sessao,
    isLoading,
    funcionarios,
    epis,
    entregas,
    login,
    cadastrarEmpresa,
    logout,
    adicionarFuncionario,
    atualizarFuncionario,
    removerFuncionario,
    adicionarEPI,
    atualizarEPI,
    removerEPI,
    registrarEntrega,
  };

  return <EPIContext.Provider value={value}>{children}</EPIContext.Provider>;
}
