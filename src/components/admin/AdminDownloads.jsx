import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';

const CATEGORIES = [
  { value: 'software', label: 'Software' },
  { value: 'manual', label: 'Manual' },
  { value: 'driver', label: 'Driver' },
  { value: 'tool', label: 'Herramienta' },
  { value: 'other', label: 'Otros' },
];

const emptyForm = { name: '', description: '', category: 'other', file_url: '', image_url: '', file_size: '', version: '', status: 'active' };

export default function AdminDownloads() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['downloads-admin'],
    queryFn: () => base44.entities.Download.list('-created_date'),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const createMut = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Download.update(editing.id, data)
      : base44.entities.Download.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads-admin'] });
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Download.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads-admin'] });
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set('file_url', file_url);
      if (!form.file_size) {
        const mb = (file.size / (1024 * 1024)).toFixed(1);
        set('file_size', `${mb} MB`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set('image_url', file_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (d) => { setEditing(d); setForm({ ...emptyForm, ...d }); setShowForm(true); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.file_url || !form.category) return;
    createMut.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{downloads.length} archivo(s) en total</p>
        <Button onClick={openNew} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Agregar descarga
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : downloads.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No hay descargas. Agrega la primera.</p>
      ) : (
        <div className="space-y-2">
          {downloads.map(d => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {CATEGORIES.find(c => c.value === d.category)?.label || d.category}
                  {d.version ? ` · ${d.version}` : ''}{d.file_size ? ` · ${d.file_size}` : ''}
                </p>
              </div>
              {d.status === 'inactive' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">Inactivo</span>
              )}
              <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => deleteMut.mutate(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar descarga' : 'Nueva descarga'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoría *</Label>
                <Select value={form.category} onValueChange={v => set('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Versión</Label>
                <Input value={form.version} onChange={e => set('version', e.target.value)} placeholder="v1.0.0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={v => set('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tamaño</Label>
                <Input value={form.file_size} onChange={e => set('file_size', e.target.value)} placeholder="2.5 MB" />
              </div>
            </div>
            <div>
              <Label>Imagen de portada</Label>
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2 border border-border" />
              )}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold cursor-pointer">
                  {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploadingImage ? 'Subiendo...' : 'Subir imagen'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
                {form.image_url && <span className="text-xs text-green-600 truncate">✓ Imagen cargada</span>}
              </div>
              <Input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="o pega la URL de la imagen" className="mt-2" />
            </div>
            <div>
              <Label>Archivo *</Label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold cursor-pointer">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? 'Subiendo...' : 'Subir archivo'}
                  <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
                {form.file_url && <span className="text-xs text-green-600 truncate">✓ Archivo cargado</span>}
              </div>
              <Input value={form.file_url} onChange={e => set('file_url', e.target.value)} placeholder="o pega la URL del archivo" className="mt-2" required />
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