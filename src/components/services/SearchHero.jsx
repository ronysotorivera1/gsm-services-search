import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Zap, Loader2 } from 'lucide-react';
import ServicesSlider from './ServicesSlider';
import ServiceCard from './ServiceCard';

export default function SearchHero({ searchQuery, onSearchChange, results = [], isLoading = false, exchangeRate }) {
  const hasQuery = searchQuery.length > 0;
  const inputRef = useRef(null);

  // Mantener el foco en el input cuando cambia hasQuery
  useEffect(() => {
    if (hasQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasQuery]);

  return (
    <div className="flex flex-col min-h-screen">



      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">

        {/* Hero + Input único SIEMPRE montado */}
        <div className={`transition-all duration-500 px-4 text-center ${hasQuery ? 'py-4' : 'flex-1 flex flex-col items-center justify-center py-16 sm:py-24'}`}>
          <div className={`w-full mx-auto transition-all duration-500 ${hasQuery ? 'max-w-xl' : 'max-w-3xl'}`}>

            {/* Título - se oculta suavemente */}
            <div className={`transition-all duration-500 overflow-hidden ${hasQuery ? 'max-h-0 opacity-0 mb-0' : 'max-h-64 opacity-100 mb-0'}`}>
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
            </div>

            {/* Input único — siempre en el DOM, siempre enfocable */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Buscar IMEI, Unlock, MDM, FRP..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`pl-12 pr-4 text-base bg-white/70 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300 ${hasQuery ? 'h-12' : 'h-14'}`}
              />
            </div>

            {!hasQuery && <ServicesSlider onSearchChange={onSearchChange} />}
          </div>
        </div>

        {/* Resultados */}
        {hasQuery && (
          <div className="max-w-7xl mx-auto w-full px-4 pb-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No se encontraron servicios para "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} para "<span className="text-foreground">{searchQuery}</span>"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map(service => (
                    <ServiceCard key={service.id} service={service} exchangeRate={exchangeRate} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}