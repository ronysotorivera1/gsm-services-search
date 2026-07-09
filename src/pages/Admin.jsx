import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Download, Loader2 } from 'lucide-react';
import AdminServices from '../components/admin/AdminServices';
import AdminSettings from '../components/admin/AdminSettings';


export default function Admin() {
  const { user } = useAuth();
  const isMainAdmin = user?.role === 'admin';
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await base44.functions.invoke('exportDatabase', {});
      const binary = atob(response.data.file);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
           <Shield className="w-5 h-5 text-primary" />
         </div>
         <div className="flex-1">
           <h1 className="font-bold text-xl text-foreground">Panel Admin</h1>
           <p className="text-xs text-muted-foreground">Gestión de servicios y configuración</p>
         </div>
         {isMainAdmin && (
           <button
             onClick={handleExport}
             disabled={exporting}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-sm font-semibold transition-colors disabled:opacity-50"
           >
             {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             <span className="hidden sm:inline">{exporting ? 'Exportando...' : 'Exportar Excel'}</span>
           </button>
         )}
       </div>

      <Tabs defaultValue="services">
         <TabsList className="mb-6">
           <TabsTrigger value="services">Servicios</TabsTrigger>
           {isMainAdmin && <TabsTrigger value="settings">Configuración</TabsTrigger>}
         </TabsList>

         <TabsContent value="services">
           <AdminServices />
         </TabsContent>
         {isMainAdmin && (
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
         )}
       </Tabs>
    </div>);

}