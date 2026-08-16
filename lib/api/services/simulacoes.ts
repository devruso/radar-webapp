import { api } from '../client';
import type { SalvarSimulacaoGradePayload, SimulacaoGradeDTO } from '../types';

export const simulacoesService = {
  async salvar(payload: SalvarSimulacaoGradePayload): Promise<SimulacaoGradeDTO> {
    return api.post('/simulacoes', payload);
  },

  async listar(usuarioId: number): Promise<SimulacaoGradeDTO[]> {
    return api.get(`/simulacoes/usuario/${usuarioId}`);
  },

  async buscar(id: number): Promise<SimulacaoGradeDTO> {
    return api.get(`/simulacoes/${id}`);
  },

  async excluir(id: number, usuarioId: number): Promise<void> {
    return api.delete(`/simulacoes/${id}`, { params: { usuarioId } });
  },
};
