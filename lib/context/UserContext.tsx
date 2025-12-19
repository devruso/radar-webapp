'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsuarioDTO, LoginPayload, RegisterPayload, CadastroPayload } from '@/lib/api/types';
import { usuariosService } from '@/lib/api/services/usuarios';

interface UserContextType {
  usuarioId: number | null;
  usuario: UsuarioDTO | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  cadastro: (payload: CadastroPayload) => Promise<void>;
  criarTeste: (cursoId: number, anoIngresso: number) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário do localStorage ao montar
  useEffect(() => {
    const storedId = localStorage.getItem('usuarioId');
    if (storedId) {
      loadUser(parseInt(storedId));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (id: number) => {
    try {
      const userData = await usuariosService.getById(id);
      setUsuario(userData);
      setUsuarioId(id);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('usuarioId');
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const userData = await usuariosService.login(payload);
      setUsuario(userData);
      setUsuarioId(userData.id);
      localStorage.setItem('usuarioId', String(userData.id));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const userData = await usuariosService.register(payload);
      setUsuario(userData);
      setUsuarioId(userData.id);
      localStorage.setItem('usuarioId', String(userData.id));
    } finally {
      setLoading(false);
    }
  };

  const cadastro = async (payload: CadastroPayload) => {
    setLoading(true);
    try {
      const userData = await usuariosService.cadastro(payload);
      setUsuario(userData);
      setUsuarioId(userData.id);
      localStorage.setItem('usuarioId', String(userData.id));
    } finally {
      setLoading(false);
    }
  };

  const criarTeste = async (cursoId: number, anoIngresso: number) => {
    setLoading(true);
    try {
      const userData = await usuariosService.criarTeste({ cursoId, anoIngresso });
      setUsuario(userData);
      setUsuarioId(userData.id);
      localStorage.setItem('usuarioId', String(userData.id));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuarioId(null);
    setUsuario(null);
    localStorage.removeItem('usuarioId');
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
        register,
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
