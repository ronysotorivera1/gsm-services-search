import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Zap, Loader2 } from 'lucide-react';
import ServicesSlider from './ServicesSlider';
import ServiceCard from './ServiceCard';

export default function SearchHero({ searchQuery, onSearchChange, results = [], isLoading = false }) {
  const hasQuery = searchQuery.length > 0;
  return (
    <div className={`relative overflow-hidden transition-all duration-500 ${hasQuery ? 'py-6 sm:py-8' : 'py-16 sm:py-24'}`}>
      {/* Wave SVG background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 220" preserveAspectRatio="none" fill="none">
          <path d="M0,120 C200,180 400,40 600,100 C800,160 1000,60 1200,110 C1320,140 1400,100 1440,90 L1440,220 L0,220 Z" fill="rgba(255,255,255,0.18)" />
          <path d="M0,160 C180,120 360,180 540,150 C720,120 900,170 1080,145 C1240,125 1360,155 1440,140 L1440,220 L0,220 Z" fill="rgba(255,255,255,0.12)" />
        </svg>
        <svg className="absolute top-0 right-0 w-full" viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none">
          <path d="M0,0 L1440,0 L1440,60 C1200,100 900,20 600,70 C300,120 100,50 0,80 Z" fill="rgba(255,255,255,0.15)" />
        </svg>
        {/* Fine wave lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none">
          {[0,18,36,54,72,90,108,126].map((offset, i) => (
            <path
              key={i}
              d={`M0,${180 + offset} C240,${140 + offset} 480,${220 + offset} 720,${170 + offset} C960,${120 + offset} 1200,${200 + offset} 1440,${160 + offset}`}
              stroke="#7aa8cc"
              strokeWidth="0.7"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        {!hasQuery && (
          <>
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
          </>
        )}

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

        {!hasQuery && <ServicesSlider onSearchChange={onSearchChange} />}

        {hasQuery && (
          <div className="mt-6 text-left">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No se encontraron servicios para "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{results.length} resultado{results.length !== 1 ? 's' : ''} para "<span className="text-foreground">{searchQuery}</span>"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map(service => (
                    <ServiceCard key={service.id} service={service} />
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