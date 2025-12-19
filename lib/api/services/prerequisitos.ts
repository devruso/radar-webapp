import { api } from '../client';
import { PreRequisitoDTO } from '../types';

export const prerequisitosService = {
  async listAll(): Promise<PreRequisitoDTO[]> {
    return api.get('/prerequisitos');
  },

  async getByComponente(componenteId: number): Promise<PreRequisitoDTO[]> {
    return api.get(`/prerequisitos/componente/${componenteId}`);
  },

  async getByComponenteETipo(componenteId: number, tipo: 'PREREQUISITO' | 'COREQUISITO' | 'POSREQUISITO'): Promise<PreRequisitoDTO[]> {
    return api.get(`/prerequisitos/componente/${componenteId}/tipo/${tipo}`);
  },

  async create(data: PreRequisitoDTO): Promise<PreRequisitoDTO> {
    return api.post('/prerequisitos', data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/prerequisitos/${id}`);
  },
};
