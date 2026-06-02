import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = ['imei', 'unlock', 'frp', 'mdm', 'server', 'remote', 'premium'];
const STATUSES = ['active', 'delay', 'offline'];

export default function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    brand: initial?.brand || '',
    category: initial?.category || 'imei',
    price_usd: initial?.price_usd || '',
    delivery_time: initial?.delivery_time || '',
    description: initial?.description || '',
    status: initial?.status || 'active',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Nombre *</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del servicio" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Marca</Label>
          <Input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Samsung, iPhone..." />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Categoría</Label>
          <Select value={form.category} onValueChange={v => set('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio USD *</Label>
          <Input type="number" step="0.01" value={form.price_usd} onChange={e => set('price_usd', parseFloat(e.target.value))} placeholder="0.00" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tiempo de entrega</Label>
          <Input value={form.delivery_time} onChange={e => set('delivery_time', e.target.value)} placeholder="1-24 Hours" />
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
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Descripción</Label>
        <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descripción opcional" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={!form.name || !form.price_usd}>Guardar</Button>
      </div>
    </div>
  );
}