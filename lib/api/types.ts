/**
 * DTOs do Backend RADAR
 * Sincronizado com: http://localhost:9090/v3/api-docs
 * Última atualização: 18/12/2025
 */

// ==================== CORE ENTITIES ====================

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  matricula?: string;
  anoIngresso?: number;
  mesIngresso?: number;
  isTeste?: boolean;
  cursoId?: number;
  cursoNome?: string;
  disciplinasFeitas?: string[];
  professoresExcluidos?: string[];
  turnosLivres?: boolean[]; // [matutino, vespertino, noturno]
  turmasSelecionadasIds?: number[];
}

export interface CursoDTO {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  estruturaId?: number;
  guiaId?: number;
}

export interface ComponenteCurricularDTO {
  id: number;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  nivel: number;
  descricao?: string;
  estruturaId?: number;
}

export interface TurmaDTO {
  id: number;
  codigoTurma: string;
  professor: string;
  vagas: number;
  componenteId: number;
  componenteNome?: string;
  horarioId: number;
}

export interface HorarioDTO {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  turno: string; // MATUTINO, VESPERTINO, NOTURNO
}

export interface VagasDTO {
  id: number;
  totalVagas: number;
  vagasDisponiveis: number;
  turmaId: number;
}

export interface EstruturaCursoDTO {
  id: number;
  cursoId: number;
  descricao?: string;
  anoVigencia: number;
}

export interface GuiaMatriculaDTO {
  id: number;
  cursoId: number;
  descricao?: string;
  periodo: number;
}

// ==================== HISTORICO & PREFERENCIAS ====================

export interface HistoricoEstudanteDTO {
  id: number;
  usuarioId: number;
  componenteId: number;
  componenteNome?: string;
  componenteCodigo?: string;
  semestre: string; // "2024.1"
  nota?: number;
  status: 'APROVADO' | 'REPROVADO' | 'TRANCADO';
  dataConclusao?: string;
}

export interface PreferenciasUsuarioDTO {
  id: number;
  usuarioId: number;
  turnosDisponiveis: string[]; // ["MATUTINO", "VESPERTINO", "NOTURNO"]
  professoresBanidos: string[];
  dataAtualizacao: string;
}

// ==================== RATING & PREREQUISITOS ====================

export interface AvaliacaoProfessorDTO {
  id: number;
  usuarioId: number;
  professorNome: string;
  componenteId: number;
  componenteNome?: string;
  nota: number; // 1-5
  comentario?: string;
  dataAvaliacao: string;
}

export interface PreRequisitoDTO {
  id: number;
  componenteId: number;
  componenteNome?: string;
  preRequisitoId: number;
  preRequisitoNome?: string;
  tipo: 'PREREQUISITO' | 'COREQUISITO' | 'POSREQUISITO';
}

// ==================== RECOMENDAÇÕES ====================

export interface RecomendacaoTurmaDTO {
  turma: TurmaDTO;
  dificuldade: 'FACIL' | 'INTERMEDIO' | 'DIFICIL';
  scoreProfessor: number;
  motivoRecomendacao: string;
}

// ==================== PAYLOADS ====================

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  matricula?: string;
}

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cursoId: number;
  mesIngresso: number;
  anoIngresso: number;
}

export interface UsuarioTestePayload {
  cursoId: number;
  anoIngresso: number;
}

export interface AtualizarDisciplinasPayload {
  disciplinasFeitas: string[];
}

export interface AtualizarTurnosPayload {
  turnosLivres: boolean[]; // [matutino, vespertino, noturno]
}

export interface BanirProfessorPayload {
  professorNome: string;
}

export interface AvaliarProfessorPayload {
  usuarioId: number;
  professorNome: string;
  componenteId: number;
  nota: number; // 1-5
  comentario?: string;
}
