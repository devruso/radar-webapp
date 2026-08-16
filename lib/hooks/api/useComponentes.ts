import { useCallback, useEffect, useState } from 'react';
import { componentesService } from '@/lib/api/services/componentes';
import { ComponenteCurricularDTO } from '@/lib/api/types';

interface UseComponentesReturn {
  data: ComponenteCurricularDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useComponentes(curso?: string): UseComponentesReturn {
  const [data, setData] = useState<ComponenteCurricularDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await componentesService.listAll(curso);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar componentes';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [curso]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
