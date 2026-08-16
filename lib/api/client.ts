import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9090/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/**
 * Response interceptor: extrai dados do envelope ApiResponseDTO
 * Se falhar, rejeita com mensagem de erro padronizada
 */
api.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuarioId');
      window.dispatchEvent(new Event('radar:unauthorized'));
    }
    const message = error.response?.data?.message ?? error.message ?? 'Erro na requisição';
    return Promise.reject(new Error(message));
  }
);

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
};
