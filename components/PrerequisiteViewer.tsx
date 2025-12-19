import { TreePine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePrerequisitos } from '@/lib/hooks/api/usePrerequisitos';

interface PrerequisiteViewerProps {
  componenteId: number;
  componenteNome?: string;
}

export function PrerequisiteViewer({ componenteId, componenteNome }: PrerequisiteViewerProps) {
  const { data: prerequisitos, loading, error } = usePrerequisitos(componenteId);

  if (loading) {
    return <div className="text-center text-gray-500">Carregando pré-requisitos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Erro: {error}</div>;
  }

  if (prerequisitos.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm">
        Nenhum pré-requisito encontrado
      </div>
    );
  }

  const agrupar = (tipo: string) => prerequisitos.filter((p) => p.tipo === tipo);

  return (
    <div className="space-y-4">
      {/* PRÉ-REQUISITOS */}
      {agrupar('PREREQUISITO').length > 0 && (
        <div className="border-l-4 border-red-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <TreePine size={18} className="text-red-500" />
            <h4 className="font-semibold text-sm">Pré-requisitos (Obrigatórios)</h4>
          </div>
          <div className="space-y-1">
            {agrupar('PREREQUISITO').map((p) => (
              <Badge key={p.id} variant="outline" className="block w-fit">
                {p.componenteIdRequisito}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* CO-REQUISITOS */}
      {agrupar('COREQUISITO').length > 0 && (
        <div className="border-l-4 border-yellow-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <TreePine size={18} className="text-yellow-500" />
            <h4 className="font-semibold text-sm">Co-requisitos (Simultâneos)</h4>
          </div>
          <div className="space-y-1">
            {agrupar('COREQUISITO').map((p) => (
              <Badge key={p.id} variant="outline" className="block w-fit">
                {p.componenteIdRequisito}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* PÓS-REQUISITOS */}
      {agrupar('POSREQUISITO').length > 0 && (
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <TreePine size={18} className="text-green-500" />
            <h4 className="font-semibold text-sm">Pós-requisitos (Futuros)</h4>
          </div>
          <div className="space-y-1">
            {agrupar('POSREQUISITO').map((p) => (
              <Badge key={p.id} variant="outline" className="block w-fit">
                {p.componenteIdRequisito}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
