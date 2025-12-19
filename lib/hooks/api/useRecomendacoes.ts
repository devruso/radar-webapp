import { useEffect, useState } from 'react';
import { recomendacoesService } from '@/lib/api/services/recomendacoes';
import { RecomendacaoTurmaDTO } from '@/lib/api/types';

interface UseRecomendacoesReturn {
  data: RecomendacaoTurmaDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Suporta uso com ou sem usuário autenticado; backend deve aceitar guest
export function useRecomendacoes(usuarioId?: number | null): UseRecomendacoesReturn {
  const [data, setData] = useState<RecomendacaoTurmaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await recomendacoesService.gerar(usuarioId ?? undefined, 'burrinho');
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar recomendações';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load apenas se houver usuário; convidado dispara manualmente
    if (usuarioId) {
      refetch();
    }
  }, [usuarioId]);

  return { data, loading, error, refetch };
}
