import { api } from '../client';
import { PreferenciasUsuarioDTO } from '../types';

export const preferenciasService = {
  async getByUsuario(usuarioId: number): Promise<PreferenciasUsuarioDTO> {
    return api.get(`/preferencias/usuario/${usuarioId}`);
  },

  async create(data: Omit<PreferenciasUsuarioDTO, 'id' | 'dataAtualizacao'>): Promise<PreferenciasUsuarioDTO> {
    return api.post('/preferencias', data);
  },

  async update(id: number, data: Partial<PreferenciasUsuarioDTO>): Promise<PreferenciasUsuarioDTO> {
    return api.put(`/preferencias/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/preferencias/${id}`);
  },
};
