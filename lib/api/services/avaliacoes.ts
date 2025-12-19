import { api } from '../client';
import { AvaliacaoProfessorDTO } from '../types';

export const avaliacoesService = {
  async listAll(): Promise<AvaliacaoProfessorDTO[]> {
    return api.get('/avaliacoes-professor');
  },

  async getById(id: number): Promise<AvaliacaoProfessorDTO> {
    return api.get(`/avaliacoes-professor/${id}`);
  },

  async getByUsuario(usuarioId: number): Promise<AvaliacaoProfessorDTO[]> {
    return api.get(`/avaliacoes-professor/usuario/${usuarioId}`);
  },

  async getByProfessor(professorNome: string): Promise<AvaliacaoProfessorDTO[]> {
    return api.get(`/avaliacoes-professor/professor/${professorNome}`);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/avaliacoes-professor/${id}`);
  },
};
