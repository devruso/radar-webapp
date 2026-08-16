'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsuarioDTO, LoginPayload, CadastroPayload, UsuarioTestePayload } from '@/lib/api/types';
import { usuariosService } from '@/lib/api/services/usuarios';
import { setAccessToken } from '@/lib/api/client';

interface UserContextType {
  usuarioId: number | null;
  usuario: UsuarioDTO | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  cadastro: (payload: CadastroPayload) => Promise<void>;
  criarTeste: (payload: UsuarioTestePayload) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser(id: number) {
    try {
      const userData = await usuariosService.getById(id);
      setUsuario(userData);
      setUsuarioId(id);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setAccessToken(null);
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  }

  // Carrega usuário do localStorage ao montar
  useEffect(() => {
    const storedId = localStorage.getItem('usuarioId');
    const storedToken = localStorage.getItem('accessToken');
    if (storedId && storedToken) {
      setAccessToken(storedToken);
      loadUser(parseInt(storedId));
    } else {
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('accessToken');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const clearExpiredSession = () => {
      setAccessToken(null);
      setUsuarioId(null);
      setUsuario(null);
      setLoading(false);
    };
    window.addEventListener('radar:unauthorized', clearExpiredSession);
    return () => window.removeEventListener('radar:unauthorized', clearExpiredSession);
  }, []);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const auth = await usuariosService.login(payload);
      setAccessToken(auth.accessToken);
      setUsuario(auth.usuario);
      setUsuarioId(auth.usuario.id);
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('usuarioId', String(auth.usuario.id));
    } finally {
      setLoading(false);
    }
  };

  const cadastro = async (payload: CadastroPayload) => {
    setLoading(true);
    try {
      const auth = await usuariosService.cadastro(payload);
      setAccessToken(auth.accessToken);
      setUsuario(auth.usuario);
      setUsuarioId(auth.usuario.id);
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('usuarioId', String(auth.usuario.id));
    } finally {
      setLoading(false);
    }
  };

  const criarTeste = async (payload: UsuarioTestePayload) => {
    setLoading(true);
    try {
      const auth = await usuariosService.criarTeste(payload);
      setAccessToken(auth.accessToken);
      setUsuario(auth.usuario);
      setUsuarioId(auth.usuario.id);
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('usuarioId', String(auth.usuario.id));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuarioId(null);
    setUsuario(null);
    setAccessToken(null);
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('accessToken');
  };

  const reloadUser = async () => {
    if (usuarioId) {
      await loadUser(usuarioId);
    }
  };

  return (
    <UserContext.Provider
      value={{
        usuarioId,
        usuario,
        loading,
        isAuthenticated: !!usuario,
        login,
        cadastro,
        criarTeste,
        logout,
        reloadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }
  return context;
}
