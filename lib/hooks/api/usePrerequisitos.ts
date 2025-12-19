import { useEffect, useState } from 'react';
import { prerequisitosService } from '@/lib/api/services/prerequisitos';
import { PreRequisitoDTO } from '@/lib/api/types';

interface UsePrerequisitosReturn {
  data: PreRequisitoDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePrerequisitos(componenteId: number | null): UsePrerequisitosReturn {
  const [data, setData] = useState<PreRequisitoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!componenteId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await prerequisitosService.getByComponente(componenteId);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar pré-requisitos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (componenteId) {
      refetch();
    }
  }, [componenteId]);

  return { data, loading, error, refetch };
}
