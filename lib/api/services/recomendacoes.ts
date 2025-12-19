import { api } from '../client';
import { RecomendacaoTurmaDTO, AvaliarProfessorPayload, AvaliacaoProfessorDTO } from '../types';

export const recomendacoesService = {
  async gerar(usuarioId?: number, metodo: 'burrinho' | 'busca' = 'burrinho'): Promise<RecomendacaoTurmaDTO[]> {
    const path = usuarioId
      ? `/recomendacoes/gerar/${usuarioId}?metodo=${metodo}`
      : `/recomendacoes/gerar?metodo=${metodo}`;
    return api.post(path);
  },

  async avaliarProfessor(payload: AvaliarProfessorPayload): Promise<AvaliacaoProfessorDTO> {
    return api.post('/recomendacoes/avaliar-professor', payload);
  },

  async getAvaliacoesProfessor(professorNome: string): Promise<AvaliacaoProfessorDTO[]> {
    return api.get(`/recomendacoes/professor/${professorNome}/avaliacoes`);
  },

  async getScoreProfessor(professorNome: string, componenteId?: number): Promise<{ score: number; quantidade: number }> {
    const params = componenteId ? `?componenteId=${componenteId}` : '';
    return api.get(`/recomendacoes/professor/${professorNome}/score${params}`);
  },
};
