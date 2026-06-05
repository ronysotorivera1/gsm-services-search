import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import AdminServices from '../components/admin/AdminServices';
import AdminSettings from '../components/admin/AdminSettings';
import AdminAIQueries from '../components/admin/AdminAIQueries';

export default function Admin() {
  const { user } = useAuth();
  const isMainAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
           <Shield className="w-5 h-5 text-primary" />
         </div>
         <div>
           <h1 className="font-bold text-xl text-foreground">Panel Admin</h1>
           <p className="text-xs text-muted-foreground">Gestión de servicios y configuración</p>
         </div>
       </div>

      <Tabs defaultValue="services">
         <TabsList className="mb-6">
           <TabsTrigger value="services">Servicios</TabsTrigger>
           {isMainAdmin && <TabsTrigger value="ai-queries">Consultas IA</TabsTrigger>}
           {isMainAdmin && <TabsTrigger value="settings">Configuración</TabsTrigger>}
         </TabsList>

         <TabsContent value="services">
           <AdminServices />
         </TabsContent>
         {isMainAdmin && (
          <TabsContent value="ai-queries">
            <AdminAIQueries />
          </TabsContent>
         )}
         {isMainAdmin && (
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
         )}
       </Tabs>
    </div>);

}