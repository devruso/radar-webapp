import { api } from '../client';
import { RecomendacaoTurmaDTO, AvaliarProfessorPayload, AvaliacaoProfessorDTO } from '../types';

export const recomendacoesService = {
  async gerar(usuarioId: number, metodo: 'guloso' | 'burrinho' | 'busca' = 'busca'): Promise<RecomendacaoTurmaDTO[]> {
    return api.post(`/recomendacoes/gerar/${usuarioId}`, null, { params: { metodo } });
  },

  async avaliarProfessor(payload: AvaliarProfessorPayload): Promise<AvaliacaoProfessorDTO> {
    return api.post('/recomendacoes/avaliar-professor', null, { params: payload });
  },

  async getScoreProfessor(professorNome: string, componenteId: number): Promise<{ score: number; qualidade: string }> {
    return api.get(`/recomendacoes/professor/${encodeURIComponent(professorNome)}/score`, {
      params: { componenteId },
    });
  },
};
