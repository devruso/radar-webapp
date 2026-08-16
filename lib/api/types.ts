/**
 * DTOs do Backend RADAR
 * Sincronizado com o contrato OpenAPI local do RADAR.
 */

// ==================== CORE ENTITIES ====================

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  matricula?: string;
  anoIngresso?: number;
  mesIngresso?: number;
  periodoAtual?: number;
  perfilInicial?: number;
  periodosRegularesCursados?: number;
  coeficienteRendimento?: number;
  statusFormando?: boolean;
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
  coordenador?: string | null;
  nivel?: string | null;
  turno?: string | null;
  estruturaId?: number;
  guiaId?: number;
}

export interface ComponenteCurricularDTO {
  id: number;
  codigo: string;
  nome: string;
  nivel?: number | null;
  ementa?: string | null;
  tipo?: string | null;
  prerequisito?: string | null;
  corequisito?: string | null;
  posrequisito?: string | null;
  departamento?: string | null;
  nivelAcademico?: string | null;
  semestre?: string | null;
  programa?: string | null;
  objetivo?: string | null;
  metodologia?: string | null;
  avaliacaoAprendizagem?: string | null;
  bibliografia?: string | null;
  cargaHoraria?: number | null;
  ementasSources?: string | null;
  ementasUpdatedAt?: string | null;
  ementasSyncedAt?: string | null;
  turmasIds?: number[];
}

export interface AuthResponseDTO {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  usuario: UsuarioDTO;
}

export interface TurmaDTO {
  id: number;
  local: string;
  professor: string;
  numero: string;
  tipo: number;
  componenteId: number;
  componenteCodigo?: string;
  componenteNome?: string;
  horarioId?: number;
  vagasId?: number;
  guiaId?: number;
  turno?: string;
  horarios?: Record<string, string>;
  totalVagas?: number | null;
  vagasDisponiveis?: number | null;
  periodoLetivo?: string | null;
  source?: string | null;
  externalKey?: string | null;
  ativa?: boolean;
}

export interface HorarioDTO {
  id: number;
  codigo: string;
  turno: string;
  horarios: Record<string, string>;
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
  componentePreRequisitoId: number;
  tipo: string;
}

// ==================== RECOMENDAÇÕES ====================

export interface RecomendacaoTurmaDTO {
  turma: TurmaDTO;
  dificuldade: 'FACIL' | 'INTERMEDIO' | 'DIFICIL';
  scoreProfessor: number;
  motivo: string;
  posicao: number;
  prioridadeMatricula: 1 | 2 | 3 | 4 | 5;
  categoriaPrioridade: string;
  semestreCurricular?: number | null;
  semestreAcademico: number;
  criterioDesempate: string;
}

export interface SimulacaoGradeDTO {
  id: number;
  usuarioId: number;
  nome: string;
  metodo: 'guloso' | 'busca';
  criadaEm: string;
  turmas: TurmaDTO[];
}

export interface SalvarSimulacaoGradePayload {
  usuarioId: number;
  nome: string;
  metodo: 'guloso' | 'busca';
  turmaIds: number[];
}

// ==================== PAYLOADS ====================

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cursoId: number;
  mesIngresso: number;
  anoIngresso: number;
  perfilInicial: number;
  periodosRegularesCursados: number;
  coeficienteRendimento: number;
  statusFormando: boolean;
}

export interface UsuarioTestePayload {
  cursoId: number;
  anoIngresso: number;
  mesIngresso: number;
  perfilInicial: number;
  periodosRegularesCursados: number;
  coeficienteRendimento?: number;
  statusFormando: boolean;
}

export interface AtualizarDisciplinasPayload {
  disciplinasFeitas: string[];
}

export interface AtualizarTurnosPayload {
  turnosLivres: boolean[]; // [matutino, vespertino, noturno]
}

export interface AtualizarPerfilPayload {
  nome: string;
  email: string;
  senhaAtual?: string;
  novaSenha?: string;
  perfilInicial: number;
  periodosRegularesCursados: number;
  coeficienteRendimento: number;
  statusFormando: boolean;
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
