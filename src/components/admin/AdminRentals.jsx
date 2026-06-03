import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import RentalForm from './RentalForm';

export default function AdminRentals() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['myRentals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await base44.entities.ToolRental.filter({ created_by_id: user.id }, '-created_date', 100);
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ToolRental.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['myRentals', user?.id] });
      const prev = queryClient.getQueryData(['myRentals', user?.id]);
      queryClient.setQueryData(['myRentals', user?.id], old => (old || []).filter(r => r.id !== id));
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['myRentals', user?.id], ctx.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['myRentals'] }),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.ToolRental.update(editing.id, data)
      : base44.entities.ToolRental.create(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['myRentals', user?.id] });
      const prev = queryClient.getQueryData(['myRentals', user?.id]);
      if (editing) {
        queryClient.setQueryData(['myRentals', user?.id], old =>
          (old || []).map(r => r.id === editing.id ? { ...r, ...data } : r)
        );
      }
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['myRentals', user?.id], ctx.prev),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myRentals'] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta herramienta?')) return;
    deleteMutation.mutate(id);
  };

  const handleSave = (data) => saveMutation.mutate(data);

  const statusColors = { active: 'text-green-400', delay: 'text-yellow-400', offline: 'text-red-400' };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{rentals.length} herramientas</p>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Nueva
        </Button>
      </div>

      {showForm && (
        <RentalForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-2">
          {rentals.map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.tool_name}</p>
                <p className="text-xs text-muted-foreground">1h: ${r.price_1h} · 24h: ${r.price_24h} · <span className={statusColors[r.status]}>{r.status}</span></p>
              </div>
              <div className="flex gap-1 ml-3">
                <Button size="icon" variant="ghost" className="min-w-[44px] min-h-[44px]" onClick={() => { setEditing(r); setShowForm(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="min-w-[44px] min-h-[44px] text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}