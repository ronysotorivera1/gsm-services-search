import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ usd_to_pen: '', whatsapp_number: '' });

  const { data: settings = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      setForm({
        usd_to_pen: settings[0].usd_to_pen || '',
        whatsapp_number: settings[0].whatsapp_number || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    if (settings.length > 0) {
      await base44.entities.AppSettings.update(settings[0].id, form);
    } else {
      await base44.entities.AppSettings.create(form);
    }
    queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    setSaving(false);
  };

  return (
    <div className="max-w-md space-y-5">
      <div className="space-y-2">
        <Label>Tipo de cambio USD → PEN (S/)</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="3.70"
          value={form.usd_to_pen}
          onChange={e => setForm(f => ({ ...f, usd_to_pen: parseFloat(e.target.value) }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Número WhatsApp (con código país)</Label>
        <Input
          placeholder="51901745069"
          value={form.whatsapp_number}
          onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
        />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar
      </Button>
    </div>
  );
}