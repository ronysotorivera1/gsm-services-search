import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Search, X } from 'lucide-react';
import ServiceForm from './ServiceForm';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['myServices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await base44.entities.Service.filter({ created_by_id: user.id }, '-created_date', 200);
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['myServices', user?.id] });
      const prev = queryClient.getQueryData(['myServices', user?.id]);
      queryClient.setQueryData(['myServices', user?.id], old => (old || []).filter(s => s.id !== id));
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['myServices', user?.id], ctx.prev),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Service.update(editing.id, data)
      : base44.entities.Service.create(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['myServices', user?.id] });
      const prev = queryClient.getQueryData(['myServices', user?.id]);
      if (editing) {
        queryClient.setQueryData(['myServices', user?.id], old =>
          (old || []).map(s => s.id === editing.id ? { ...s, ...data } : s)
        );
      }
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['myServices', user?.id], ctx.prev),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    deleteMutation.mutate(id);
  };

  const handleSave = (data) => {
    const clean = { ...data };
    // Limpiar campos numéricos vacíos que la API rechaza como string vacío
    if (clean.credits_quantity === '' || clean.credits_quantity === null) delete clean.credits_quantity;
    if (clean.price_usd === '' || clean.price_usd === null) delete clean.price_usd;
    // Si la categoría no usa duration, limpiarla
    if (clean.category !== 'renta' && clean.category !== 'activacion') clean.duration = '';
    // Si la categoría no usa credits, limpiarla
    if (clean.category !== 'creditos') delete clean.credits_quantity;
    saveMutation.mutate(clean);
  };

  const statusColors = { active: 'text-green-500', inactive: 'text-yellow-500', out_of_stock: 'text-red-500' };

  const q = search.toLowerCase();
  const filtered = q
    ? services.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.brand?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      )
    : services;

  const groupedServices = filtered.reduce((acc, service) => {
    const group = acc.find(g => g.name === service.name);
    if (group) group.items.push(service);
    else acc.push({ name: service.name, items: [service] });
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <p className="text-sm text-muted-foreground shrink-0">{filtered.length} servicios</p>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar servicio..."
            className="pl-9 pr-8 h-8 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo
        </Button>
      </div>

      {/* Modal para crear / editar */}
      <Dialog open={showForm} onOpenChange={open => { if (!open) { setShowForm(false); setEditing(null); } }}>
        <DialogContent className="max-w-2xl w-full max-h-[85dvh] flex flex-col rounded-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0 border-b border-border">
            <DialogTitle>{editing ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 py-4 overscroll-contain">
            <ServiceForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : groupedServices.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-10">
          {search ? `Sin resultados para "${search}"` : 'No hay servicios aún.'}
        </p>
      ) : (
        <div className="space-y-4">
          {groupedServices.map(group => (
            <div key={group.name} className="border-l-2 border-primary/30 pl-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{group.name}</h3>
              <div className="space-y-2">
                {group.items.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {s.brand && <span>{s.brand} · </span>}
                        ${s.price_usd} · <span className={statusColors[s.status]}>{s.status}</span>
                      </p>
                      {s.category && <p className="text-xs text-primary mt-1">{s.category}{s.duration && ` · ${s.duration}`}{s.credits_quantity && ` · ${s.credits_quantity} créditos`}</p>}
                      {s.delivery_time && <p className="text-xs text-muted-foreground mt-0.5">⏱ {s.delivery_time}</p>}
                      {s.note_html && <p className="text-xs text-muted-foreground mt-0.5 truncate" dangerouslySetInnerHTML={{ __html: s.note_html }} />}
                    </div>
                    <div className="flex gap-1 ml-3">
                      <Button size="icon" variant="ghost" className="min-w-[44px] min-h-[44px]" onClick={() => { setEditing(s); setShowForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="min-w-[44px] min-h-[44px] text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}