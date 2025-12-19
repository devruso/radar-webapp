import { api } from '../client';
import { 
  UsuarioDTO, 
  LoginPayload, 
  RegisterPayload,
  CadastroPayload,
  UsuarioTestePayload,
  AtualizarDisciplinasPayload,
  AtualizarTurnosPayload,
  BanirProfessorPayload
} from '../types';

export const usuariosService = {
  async listAll(): Promise<UsuarioDTO[]> {
    return api.get('/usuarios');
  },

  async getById(id: number): Promise<UsuarioDTO> {
    return api.get(`/usuarios/${id}`);
  },

  async login(payload: LoginPayload): Promise<UsuarioDTO> {
    return api.post('/usuarios/login', payload);
  },

  async register(payload: RegisterPayload): Promise<UsuarioDTO> {
    return api.post('/usuarios/register', payload);
  },

  async cadastro(payload: CadastroPayload): Promise<UsuarioDTO> {
    return api.post('/usuarios/cadastro', payload);
  },

  async criarTeste(payload: UsuarioTestePayload): Promise<UsuarioDTO> {
    return api.post('/usuarios/teste', payload);
  },

  async atualizarDisciplinas(id: number, payload: AtualizarDisciplinasPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/disciplinas`, payload);
  },

  async atualizarTurnos(id: number, payload: AtualizarTurnosPayload): Promise<UsuarioDTO> {
    return api.post(`/usuarios/${id}/turnos`, payload);
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
