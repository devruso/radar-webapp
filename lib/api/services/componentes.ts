import { api } from '../client';
import { ComponenteCurricularDTO } from '../types';

export const componentesService = {
  async listAll(): Promise<ComponenteCurricularDTO[]> {
    return api.get('/componentes');
  },

  async getById(id: number): Promise<ComponenteCurricularDTO> {
    return api.get(`/componentes/${id}`);
  },

  async getByCodigo(codigo: string): Promise<ComponenteCurricularDTO> {
    return api.get(`/componentes/codigo/${codigo}`);
  },
};
