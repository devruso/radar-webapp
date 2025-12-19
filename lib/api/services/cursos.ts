import { api } from '../client';
import { CursoDTO } from '../types';

export const cursosService = {
  async listAll(): Promise<CursoDTO[]> {
    return api.get('/cursos');
  },

  async getById(id: number): Promise<CursoDTO> {
    return api.get(`/cursos/${id}`);
  },
};
