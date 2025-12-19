import { api } from '../client';
import { HorarioDTO } from '../types';

export const horariosService = {
  async listAll(): Promise<HorarioDTO[]> {
    return api.get('/horarios');
  },

  async getById(id: number): Promise<HorarioDTO> {
    return api.get(`/horarios/${id}`);
  },
};
