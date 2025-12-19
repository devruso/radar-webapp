import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecomendacaoTurmaDTO } from '@/lib/api/types';

interface RecommendationCardProps {
  recomendacao: RecomendacaoTurmaDTO;
}

export function RecommendationCard({ recomendacao }: RecommendationCardProps) {
  const { turma, dificuldade, scoreProfessor, motivo, posicao } = recomendacao;

  const dificuldadeColor = {
    FACIL: 'bg-green-100 text-green-800',
    INTERMEDIO: 'bg-yellow-100 text-yellow-800',
    DIFICIL: 'bg-red-100 text-red-800',
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-lg">Posição {posicao}</p>
          <p className="text-sm text-gray-600">{turma.codigo}</p>
        </div>
        <Badge className={dificuldadeColor[dificuldade]}>
          {dificuldade === 'FACIL' ? 'Fácil' : dificuldade === 'INTERMEDIO' ? 'Intermediário' : 'Difícil'}
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Professor</p>
          <p className="text-sm">{turma.professor}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Score do Professor</p>
          <div className="flex items-center gap-2">
            {renderStars(scoreProfessor)}
            <span className="text-sm font-semibold">{scoreProfessor.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Motivo da Recomendação</p>
          <p className="text-sm text-gray-600 italic">{motivo}</p>
        </div>

        {turma.vagas && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Vagas Disponíveis</p>
            <p className="text-sm">{turma.vagas.vagasDisponiveis} de {turma.vagas.totalVagas}</p>
          </div>
        )}
      </div>
    </div>
  );
}
