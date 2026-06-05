import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AdminAIQueries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState({});

  const { data: queries = [], isLoading } = useQuery({
    queryKey: ['aiQueries'],
    queryFn: () => base44.entities.AIQuery.list('-created_date', 50),
  });

  const pending = queries.filter(q => q.status === 'pending');
  const answered = queries.filter(q => q.status === 'answered');

  const handleAnswer = async (query) => {
    const answer = answers[query.id];
    if (!answer?.trim()) return;
    setSaving(s => ({ ...s, [query.id]: true }));
    try {
      await base44.entities.AIQuery.update(query.id, {
        status: 'answered',
        admin_answer: answer.trim()
      });

      // Añadir la respuesta al contexto IA automáticamente
      const settings = await base44.entities.AppSettings.list();
      if (settings.length > 0) {
        const currentContext = settings[0].ai_context || '';
        const newEntry = `\nP: ${query.question}\nR: ${answer.trim()}`;
        await base44.entities.AppSettings.update(settings[0].id, {
          ai_context: currentContext + newEntry
        });
      }

      queryClient.invalidateQueries({ queryKey: ['aiQueries'] });
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      setAnswers(a => ({ ...a, [query.id]: '' }));
      toast({ title: '✓ Respuesta guardada y añadida al contexto IA' });
    } finally {
      setSaving(s => ({ ...s, [query.id]: false }));
    }
  };

  const handleDelete = async (id) => {
    await base44.entities.AIQuery.delete(id);
    queryClient.invalidateQueries({ queryKey: ['aiQueries'] });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Pendientes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-accent" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Consultas sin respuesta
          </p>
          {pending.length > 0 && (
            <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">{pending.length}</Badge>
          )}
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
            Sin consultas pendientes 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map(query => (
              <div key={query.id} className="border border-accent/20 rounded-xl p-4 bg-accent/5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">"{query.question}"</p>
                  <button onClick={() => handleDelete(query.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(query.created_date).toLocaleString('es-PE')}
                </p>
                <Textarea
                  value={answers[query.id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [query.id]: e.target.value }))}
                  placeholder="Escribe la respuesta — se añadirá automáticamente al contexto del asistente IA..."
                  className="text-sm min-h-[80px]"
                />
                <Button
                  size="sm"
                  onClick={() => handleAnswer(query)}
                  disabled={!answers[query.id]?.trim() || saving[query.id]}
                >
                  {saving[query.id] ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                  Guardar y enseñar a la IA
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Respondidas */}
      {answered.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Respondidas</p>
          <div className="space-y-2">
            {answered.map(query => (
              <div key={query.id} className="border border-border rounded-lg p-3 bg-card/50 flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-medium text-foreground">"{query.question}"</p>
                  <p className="text-xs text-muted-foreground">{query.admin_answer}</p>
                </div>
                <button onClick={() => handleDelete(query.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}