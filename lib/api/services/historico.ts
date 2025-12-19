import { api } from '../client';
import { HistoricoEstudanteDTO } from '../types';

export const historicoService = {
  async getByUsuario(usuarioId: number): Promise<HistoricoEstudanteDTO[]> {
    return api.get(`/historico/usuario/${usuarioId}`);
  },

  async getByUsuarioEStatus(usuarioId: number, status: 'APROVADO' | 'REPROVADO' | 'TRANCADO'): Promise<HistoricoEstudanteDTO[]> {
    return api.get(`/historico/usuario/${usuarioId}/status/${status}`);
  },

  async create(data: Omit<HistoricoEstudanteDTO, 'id'>): Promise<HistoricoEstudanteDTO> {
    return api.post('/historico', data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/historico/${id}`);
  },
};
