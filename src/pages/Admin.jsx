import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import AdminServices from '../components/admin/AdminServices';
import AdminRentals from '../components/admin/AdminRentals';
import AdminSettings from '../components/admin/AdminSettings';

export default function Admin() {
  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-foreground">Panel Admin</h1>
          <p className="text-xs text-muted-foreground">Gestión de servicios, herramientas y configuración</p>
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="mb-6">
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="rentals">Herramientas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <AdminServices />
        </TabsContent>
        <TabsContent value="rentals">
          <AdminRentals />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}