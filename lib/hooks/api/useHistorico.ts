import { useEffect, useState } from 'react';
import { historicoService } from '@/lib/api/services/historico';
import { HistoricoEstudanteDTO } from '@/lib/api/types';

interface UseHistoricoReturn {
  data: HistoricoEstudanteDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHistorico(usuarioId?: number | null, status?: 'APROVADO' | 'REPROVADO' | 'TRANCADO'): UseHistoricoReturn {
  const [data, setData] = useState<HistoricoEstudanteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError(null);

    try {
      const result = status
        ? await historicoService.getByUsuarioEStatus(usuarioId, status)
        : await historicoService.getByUsuario(usuarioId);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      refetch();
    }
  }, [usuarioId, status]);

  return { data, loading, error, refetch };
}
