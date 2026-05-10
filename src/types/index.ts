// ============================================================
// INTERFACES GLOBAIS
// ============================================================

export interface Empresa {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  senha: string; 
  criadoEm: string;
}

export interface Funcionario {
  id: string;
  empresaId: string;
  nome: string;
  setor: string;
  cargo: string;
  criadoEm: string;
}

export interface EPI {
  id: string;
  empresaId: string;
  nome: string;
  ca: string; 
  dataValidade: string;
  quantidade: number;
  criadoEm: string;
}

export interface Entrega {
  id: string;
  empresaId: string;
  funcionarioId: string;
  funcionarioNome: string;
  epiId: string;
  epiNome: string;
  data: string;
}

export interface SessaoAtiva {
  empresaId: string;
  empresaNome: string;
  email: string;
}
