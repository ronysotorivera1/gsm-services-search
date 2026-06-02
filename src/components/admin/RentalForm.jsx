import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUSES = ['active', 'delay', 'offline'];

export default function RentalForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    tool_name: initial?.tool_name || '',
    description: initial?.description || '',
    price_1h: initial?.price_1h || '',
    price_6h: initial?.price_6h || '',
    price_12h: initial?.price_12h || '',
    price_24h: initial?.price_24h || '',
    status: initial?.status || 'active',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Nombre *</Label>
          <Input value={form.tool_name} onChange={e => set('tool_name', e.target.value)} placeholder="Nombre de la herramienta" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Estado</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio 1h (USD) *</Label>
          <Input type="number" step="0.01" value={form.price_1h} onChange={e => set('price_1h', parseFloat(e.target.value))} placeholder="0.00" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio 6h (USD)</Label>
          <Input type="number" step="0.01" value={form.price_6h} onChange={e => set('price_6h', parseFloat(e.target.value))} placeholder="0.00" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio 12h (USD)</Label>
          <Input type="number" step="0.01" value={form.price_12h} onChange={e => set('price_12h', parseFloat(e.target.value))} placeholder="0.00" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio 24h (USD) *</Label>
          <Input type="number" step="0.01" value={form.price_24h} onChange={e => set('price_24h', parseFloat(e.target.value))} placeholder="0.00" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Descripción</Label>
        <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descripción opcional" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.tool_name || !form.price_1h || !form.price_24h}>Guardar</Button>
      </div>
    </div>
  );
}