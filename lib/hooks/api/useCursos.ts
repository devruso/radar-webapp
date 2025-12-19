import { useEffect, useState } from 'react';
import { cursosService } from '@/lib/api/services/cursos';
import { CursoDTO } from '@/lib/api/types';

interface UseCursosReturn {
  data: CursoDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCursos(): UseCursosReturn {
  const [data, setData] = useState<CursoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await cursosService.listAll();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar cursos';
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
