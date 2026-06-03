import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Upload } from 'lucide-react';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const [form, setForm] = useState({
    site_name: '',
    logo_url: '',
    subtitle: '',
    usd_to_pen: '',
    whatsapp_number: '',
    footer_contact: '',
    allow_new_registrations: true,
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      const s = settings[0];
      setForm({
        site_name: s.site_name || '',
        logo_url: s.logo_url || '',
        subtitle: s.subtitle || '',
        usd_to_pen: s.usd_to_pen || '',
        whatsapp_number: s.whatsapp_number || '',
        footer_contact: s.footer_contact || '',
        allow_new_registrations: s.allow_new_registrations !== false,
      });
    }
  }, [settings]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('logo_url', file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, usd_to_pen: parseFloat(form.usd_to_pen) || 3.70 };
    if (settings.length > 0) {
      await base44.entities.AppSettings.update(settings[0].id, data);
    } else {
      await base44.entities.AppSettings.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    setSaving(false);
  };

  return (
    <div className="max-w-lg space-y-5">

      <div className="pb-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Identidad</p>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Nombre de la Página</Label>
            <Input value={form.site_name} onChange={e => set('site_name', e.target.value)} placeholder="GSM Services" />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Marketplace de servicios GSM" />
          </div>
          <div className="space-y-1">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              {form.logo_url && (
                <img src={form.logo_url} alt="Logo" className="h-10 w-10 object-contain rounded border border-border" />
              )}
              <Button size="sm" variant="outline" onClick={() => fileRef.current.click()} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                Subir Logo
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              {form.logo_url && (
                <Input value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="o pega URL..." className="text-xs" />
              )}
            </div>
            {!form.logo_url && (
              <Input value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="o pega URL del logo..." className="mt-2 text-xs" />
            )}
          </div>
        </div>
      </div>

      <div className="pb-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Moneda y Contacto</p>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Tipo de Cambio USD → PEN (S/)</Label>
            <Input type="number" step="0.01" value={form.usd_to_pen} onChange={e => set('usd_to_pen', e.target.value)} placeholder="3.70" />
          </div>
          <div className="space-y-1">
            <Label>Número WhatsApp (con código país)</Label>
            <Input value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} placeholder="51901745069" />
          </div>
        </div>
      </div>

      <div className="pb-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Footer</p>
        <div className="space-y-1">
          <Label>Datos de Contacto (HTML permitido)</Label>
          <Textarea
            value={form.footer_contact}
            onChange={e => set('footer_contact', e.target.value)}
            placeholder={'ej:\n<p>Email: contacto@gsm.com</p>\n<p>Tel: +51 900 000 000</p>'}
            className="font-mono text-xs min-h-[100px]"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Registro de Usuarios</p>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
          <div className="flex-1">
            <Label className="font-medium text-sm">Permitir nuevos registros</Label>
            <p className="text-xs text-muted-foreground mt-1">Los nuevos usuarios podrán crear cuentas en la plataforma</p>
          </div>
          <Switch
            checked={form.allow_new_registrations}
            onCheckedChange={(checked) => set('allow_new_registrations', checked)}
            className="ml-4"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar Configuración
      </Button>
    </div>
  );
}