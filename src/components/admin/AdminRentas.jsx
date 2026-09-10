import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Globe, User, MessageCircle, Clock, StickyNote, Hourglass } from 'lucide-react';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

const emptyForm = { ip: '', nombre: '', whatsapp: '', tiempo_renta: '', nota: '' };

export default function AdminRentas() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: rentas = [], isLoading } = useQuery({
    queryKey: ['rentas-admin'],
    queryFn: () => base44.entities.Renta.list('-created_date'),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const createMut = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Renta.update(editing.id, data)
      : base44.entities.Renta.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentas-admin'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Renta.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentas-admin'] });
    },
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...emptyForm, ...r }); setShowForm(true); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.ip || !form.nombre || !form.whatsapp || !form.tiempo_renta) return;
    createMut.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{rentas.length} renta(s) registrada(s)</p>
        <Button onClick={openNew} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Agregar renta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : rentas.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No hay rentas. Agrega la primera.</p>
      ) : (
        <div className="space-y-2">
          {rentas.map(r => {
            const restante = r.created_date
              ? differenceInCalendarDays(addDays(new Date(r.created_date), Number(r.tiempo_renta) || 0), new Date())
              : null;
            return (
              <div key={r.id} className="p-3 rounded-lg border border-border bg-card/50 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-1.5">
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase"><Globe className="w-3 h-3" /> IP</span>
                      <p className="text-sm font-medium truncate">{r.ip}</p>
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase"><User className="w-3 h-3" /> Nombre</span>
                      <p className="text-sm font-medium truncate">{r.nombre}</p>
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase"><MessageCircle className="w-3 h-3" /> WhatsApp</span>
                      <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate text-primary hover:underline block">
                        {r.whatsapp}
                      </a>
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase"><Clock className="w-3 h-3" /> Tiempo</span>
                      <p className="text-sm font-medium truncate">{r.tiempo_renta} {Number(r.tiempo_renta) === 1 ? 'día' : 'días'}</p>
                      {r.created_date && (
                        <p className="text-xs text-muted-foreground truncate">
                          {format(new Date(r.created_date), 'dd/MM/yyyy')} → {format(addDays(new Date(r.created_date), Number(r.tiempo_renta) || 0), 'dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold uppercase"><Hourglass className="w-3 h-3" /> Restante</span>
                      {restante === null ? (
                        <p className="text-sm font-medium text-muted-foreground">—</p>
                      ) : restante <= 0 ? (
                        <p className="text-sm font-semibold text-destructive">Vencida</p>
                      ) : (
                        <p className={`text-sm font-semibold ${restante <= 3 ? 'text-accent' : 'text-foreground'}`}>
                          {restante} {restante === 1 ? 'día' : 'días'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteMut.mutate(r.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                {r.nota && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground min-w-0">
                    <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
                    <span className="break-words line-clamp-2">{r.nota}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar renta' : 'Nueva renta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label>IP *</Label>
              <Input value={form.ip} onChange={e => set('ip', e.target.value)} placeholder="192.168.1.1" required />
            </div>
            <div>
              <Label>Nombre *</Label>
              <Input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre del cliente" required />
            </div>
            <div>
              <Label>WhatsApp *</Label>
              <Input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="51999999999" required />
            </div>
            <div>
              <Label>Tiempo de renta (días) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={form.tiempo_renta}
                  onChange={e => {
                    const val = parseInt(e.target.value) || '';
                    set('tiempo_renta', val === '' ? '' : Math.max(1, Math.min(30, val)));
                  }}
                  className="w-24"
                  required
                />
                <span className="text-sm text-muted-foreground">días (1 a 30)</span>
              </div>
            </div>
            <div>
              <Label>Nota</Label>
              <Textarea
                value={form.nota || ''}
                onChange={e => set('nota', e.target.value)}
                placeholder="Nota opcional (ej: fecha de pago, detalles del cliente...)"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}