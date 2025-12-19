import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9090/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor: extrai dados do envelope ApiResponseDTO
 * Se falhar, rejeita com mensagem de erro padronizada
 */
api.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => {
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
