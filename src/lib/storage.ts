// ============================================================
// UTILITÁRIOS DE LOCALSTORAGE
// Funções auxiliares para ler e escrever dados persistidos
// ============================================================

import { Empresa, Funcionario, EPI, Entrega, SessaoAtiva } from "@/types";

// ── Chaves do LocalStorage ──────────────────────────────────
const KEYS = {
  EMPRESAS: "datasafe:empresas",
  FUNCIONARIOS: "datasafe:funcionarios",
  EPIS: "datasafe:epis",
  ENTREGAS: "datasafe:entregas",
  SESSAO: "datasafe:sessao",
};

// ── Helpers genéricos ───────────────────────────────────────
function getItem<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Empresas ────────────────────────────────────────────────
export const getEmpresas = (): Empresa[] => getItem<Empresa>(KEYS.EMPRESAS);

export const saveEmpresa = (empresa: Empresa): void => {
  const empresas = getEmpresas();
  empresas.push(empresa);
  setItem(KEYS.EMPRESAS, empresas);
};

export const findEmpresaByEmailSenha = (
  email: string,
  senha: string
): Empresa | undefined => {
  return getEmpresas().find((e) => e.email === email && e.senha === senha);
};

// ── Sessão ──────────────────────────────────────────────────
export const getSessao = (): SessaoAtiva | null => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEYS.SESSAO) || "null");
  } catch {
    return null;
  }
};

export const saveSessao = (sessao: SessaoAtiva): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.SESSAO, JSON.stringify(sessao));
};

export const clearSessao = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.SESSAO);
};

// ── Funcionários ────────────────────────────────────────────
export const getFuncionariosByEmpresa = (empresaId: string): Funcionario[] =>
  getItem<Funcionario>(KEYS.FUNCIONARIOS).filter(
    (f) => f.empresaId === empresaId
  );

export const saveFuncionarios = (
  empresaId: string,
  novos: Funcionario[]
): void => {
  // Mantém funcionários de outras empresas e substitui os da empresa atual
  const todos = getItem<Funcionario>(KEYS.FUNCIONARIOS).filter(
    (f) => f.empresaId !== empresaId
  );
  setItem(KEYS.FUNCIONARIOS, [...todos, ...novos]);
};

// ── EPIs ────────────────────────────────────────────────────
export const getEPIsByEmpresa = (empresaId: string): EPI[] =>
  getItem<EPI>(KEYS.EPIS).filter((e) => e.empresaId === empresaId);

export const saveEPIs = (empresaId: string, novos: EPI[]): void => {
  const todos = getItem<EPI>(KEYS.EPIS).filter((e) => e.empresaId !== empresaId);
  setItem(KEYS.EPIS, [...todos, ...novos]);
};

// ── Entregas ────────────────────────────────────────────────
export const getEntregasByEmpresa = (empresaId: string): Entrega[] =>
  getItem<Entrega>(KEYS.ENTREGAS).filter((e) => e.empresaId === empresaId);

export const saveEntregas = (empresaId: string, novas: Entrega[]): void => {
  const todas = getItem<Entrega>(KEYS.ENTREGAS).filter(
    (e) => e.empresaId !== empresaId
  );
  setItem(KEYS.ENTREGAS, [...todas, ...novas]);
};

// ── Gerador de ID simples ───────────────────────────────────
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
