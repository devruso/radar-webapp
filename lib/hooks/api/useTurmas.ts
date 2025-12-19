import { useEffect, useState } from 'react';
import { turmasService } from '@/lib/api/services/turmas';
import { TurmaDTO } from '@/lib/api/types';

interface UseTurmasReturn {
  data: TurmaDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTurmas(): UseTurmasReturn {
  const [data, setData] = useState<TurmaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await turmasService.listAll();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar turmas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
}

export function useTurmasByCurso(cursoId: number | null): UseTurmasReturn {
  const [data, setData] = useState<TurmaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!cursoId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await turmasService.getByCurso(cursoId);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar turmas do curso';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cursoId) {
      refetch();
    }
  }, [cursoId]);

  return { data, loading, error, refetch };
}
