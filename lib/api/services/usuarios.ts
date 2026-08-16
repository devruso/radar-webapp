import { api } from '../client';
import { 
  UsuarioDTO, 
  LoginPayload, 
  CadastroPayload,
  UsuarioTestePayload,
  AtualizarDisciplinasPayload,
  AtualizarTurnosPayload,
  BanirProfessorPayload,
  AtualizarPerfilPayload,
  AuthResponseDTO
} from '../types';

export const usuariosService = {
  async getById(id: number): Promise<UsuarioDTO> {
    return api.get(`/usuarios/${id}`);
  },

  async login(payload: LoginPayload): Promise<AuthResponseDTO> {
    return api.post('/usuarios/login', payload);
  },

  async cadastro(payload: CadastroPayload): Promise<AuthResponseDTO> {
    return api.post('/usuarios/cadastro', payload);
  },

  async criarTeste(payload: UsuarioTestePayload): Promise<AuthResponseDTO> {
    return api.post('/usuarios/teste', payload);
  },

  async atualizarDisciplinas(id: number, payload: AtualizarDisciplinasPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/disciplinas`, payload);
  },

  async atualizarTurnos(id: number, payload: AtualizarTurnosPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/turnos`, payload);
  },

  async atualizarPerfil(id: number, payload: AtualizarPerfilPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/perfil`, payload);
  },

  async banirProfessor(id: number, payload: BanirProfessorPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/professores/banir`, payload);
  },

  async desbanirProfessor(id: number, payload: BanirProfessorPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/professores/desbanir`, payload);
  },

  async listarProfessoresBanidos(id: number): Promise<string[]> {
    return api.get(`/usuarios/${id}/professores/banidos`);
  },
};
