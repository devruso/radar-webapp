import { api } from '../client';
import { TurmaDTO } from '../types';

export const turmasService = {
  async listAll(): Promise<TurmaDTO[]> {
    return api.get('/turmas');
  },

  async getById(id: number): Promise<TurmaDTO> {
    return api.get(`/turmas/${id}`);
  },

  async getByCurso(cursoId: number): Promise<TurmaDTO[]> {
    return api.get(`/turmas/curso/${cursoId}`);
  },

  async getByComponente(componenteId: number): Promise<TurmaDTO[]> {
    return api.get(`/turmas/componente/${componenteId}`);
  },
};
