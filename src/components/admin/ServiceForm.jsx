import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = [
  { value: 'renta', label: 'RENTA' },
  { value: 'activacion', label: 'ACTIVACIÓN LICENCIA' },
  { value: 'imei', label: 'IMEI' },
  { value: 'remoto', label: 'REMOTO' },
];

const DURATION_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: `${i + 1} mes${i > 0 ? 'es' : ''}`,
  label: `${i + 1} mes${i > 0 ? 'es' : ''}`
}));

const STATUSES = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'out_of_stock', label: 'Sin Stock' },
];

export default function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    brand: initial?.brand || '',
    category: initial?.category || 'imei',
    service_type: initial?.service_type || 'service',
    price_usd: initial?.price_usd || '',
    duration: initial?.duration || '',
    delivery_time: initial?.delivery_time || '',
    status: initial?.status || 'active',
    description: initial?.description || '',
    note_html: initial?.note_html || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const showDuration = form.category === 'renta' || form.category === 'activacion';

  return (
    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div className="space-y-1">
          <Label className="text-xs">Servicio *</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del servicio" />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Tipo de Servicio</Label>
          <Select value={form.category} onValueChange={v => set('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Valor (USD) *</Label>
          <Input type="number" step="0.01" value={form.price_usd} onChange={e => set('price_usd', parseFloat(e.target.value))} placeholder="0.00" />
        </div>

        {showDuration && (
          <div className="space-y-1">
            <Label className="text-xs">Duración {form.category === 'activacion' ? '(Meses)' : ''}</Label>
            {form.category === 'activacion' ? (
              <Select value={form.duration} onValueChange={v => set('duration', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona duración" /></SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="ej: 1h, 6h, 12h, 24h, 1 mes, anual" />
            )}
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs">Tiempo de Entrega</Label>
          <Input value={form.delivery_time} onChange={e => set('delivery_time', e.target.value)} placeholder="ej: 1-24 Hours" />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Estado</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="space-y-1">
        <Label className="text-xs">Descripción</Label>
        <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descripción breve opcional" />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Nota (HTML permitido)</Label>
        <Textarea
          value={form.note_html}
          onChange={e => set('note_html', e.target.value)}
          placeholder='ej: <b>Requiere IMEI limpio</b> o texto libre'
          className="font-mono text-xs min-h-[80px]"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.name || !form.price_usd}>Guardar</Button>
      </div>
    </div>
  );
}