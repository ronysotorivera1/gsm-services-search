import React, { useState } from 'react';
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

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-created_date', 200),
  });

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await base44.entities.Service.delete(id);
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Service.update(editing.id, data);
    } else {
      await base44.entities.Service.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['services'] });
    setShowForm(false);
    setEditing(null);
  };

  const statusColors = { active: 'text-green-400', delay: 'text-yellow-400', offline: 'text-red-400' };

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
        <div className="space-y-2">
          {services.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.brand} · ${s.price_usd} · <span className={statusColors[s.status]}>{s.status}</span></p>
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
      )}
    </div>
  );
}