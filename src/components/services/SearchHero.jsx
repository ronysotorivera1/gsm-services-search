import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Zap } from 'lucide-react';

export default function SearchHero({ searchQuery, onSearchChange }) {
  return (
    <div className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">GSM CHECK CENTER</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-3 leading-tight">
          Buscador de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Servicios GSM
          </span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-lg mx-auto">
          Busca servicios IMEI, Unlock, MDM, FRP y renta de herramientas profesionales
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar IMEI, Unlock, MDM, FRP..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 h-14 text-base bg-card/80 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {['Samsung', 'iPhone', 'Xiaomi', 'Honor', 'Motorola'].map(brand => (
            <button
              key={brand}
              onClick={() => onSearchChange(brand)}
              className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}