import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, Wrench } from 'lucide-react';
import RentalCard from '../components/rentals/RentalCard';
import { useSettings } from '../hooks/useSettings';

export default function Rentals() {
  const settings = useSettings();

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['toolRentals'],
    queryFn: () => base44.entities.ToolRental.list('-created_date', 100),
    initialData: [],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Wrench className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent tracking-wide">TOOL RENTALS</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Renta de Herramientas</h1>
        <p className="text-muted-foreground text-sm">
          Acceso remoto a herramientas profesionales GSM por horas
          {settings.usd_to_pen && (
            <span className="ml-2">· TC: S/ {settings.usd_to_pen}</span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">No hay herramientas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rentals.map(rental => (
            <RentalCard
              key={rental.id}
              rental={rental}
              exchangeRate={settings.usd_to_pen || 3.70}
            />
          ))}
        </div>
      )}
    </div>
  );
}