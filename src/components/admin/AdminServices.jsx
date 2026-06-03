import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import ServiceForm from './ServiceForm';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

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

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await base44.entities.Service.delete(id);
    queryClient.resetQueries({ queryKey: ['services'] });
    queryClient.resetQueries({ queryKey: ['myServices'] });
  };

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Service.update(editing.id, data);
    } else {
      await base44.entities.Service.create(data);
    }
    queryClient.resetQueries({ queryKey: ['services'] });
    queryClient.resetQueries({ queryKey: ['myServices'] });
    setShowForm(false);
    setEditing(null);
  };

  const statusColors = { active: 'text-green-400', delay: 'text-yellow-400', offline: 'text-red-400' };

  // Agrupar servicios por nombre
  const groupedServices = services.reduce((acc, service) => {
    const group = acc.find(g => g.name === service.name);
    if (group) {
      group.items.push(service);
    } else {
      acc.push({ name: service.name, items: [service] });
    }
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{services.length} servicios</p>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo
        </Button>
      </div>

      {showForm && (
        <ServiceForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {groupedServices.map(group => (
            <div key={group.name} className="border-l-2 border-primary/30 pl-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{group.name}</h3>
              <div className="space-y-2">
                {group.items.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{s.brand} · ${s.price_usd} · <span className={statusColors[s.status]}>{s.status}</span></p>
                      {s.category && <p className="text-xs text-primary mt-1">{s.category}</p>}
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => { setEditing(s); setShowForm(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
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