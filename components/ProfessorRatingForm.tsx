'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { recomendacoesService } from '@/lib/api/services/recomendacoes';
import { useToast } from '@/hooks/use-toast';

interface ProfessorRatingFormProps {
  usuarioId: number;
  professorNome: string;
  componenteId: number;
  onSuccess?: () => void;
}

export function ProfessorRatingForm({
  usuarioId,
  professorNome,
  componenteId,
  onSuccess,
}: ProfessorRatingFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma nota',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await recomendacoesService.avaliarProfessor({
        usuarioId,
        professorNome,
        componenteId,
        nota: rating,
        comentario: comment || undefined,
      });

      toast({
        title: 'Sucesso',
        description: 'Avaliação registrada com sucesso!',
      });

      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao registrar avaliação',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Avaliar {professorNome}</h3>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Comentário (opcional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este professor..."
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </Button>
    </div>
  );
}
