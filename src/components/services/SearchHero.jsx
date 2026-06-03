import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Zap, Loader2, X } from 'lucide-react';
import ServicesSlider from './ServicesSlider';
import ServiceCard from './ServiceCard';

const PROMO_MESSAGES = [
'⚡ Precios vía WhatsApp · Para mejores precios y procesamiento automático visita gsmservicess.com',
'🚀 ¿Quieres procesar más rápido y más barato? Visita gsmservicess.com',
'💡 Procesamiento automático 24/7 en gsmservicess.com — sin esperas',
'🔥 Mejores precios garantizados en gsmservicess.com · Pago automático'];


export default function SearchHero({ searchQuery, onSearchChange, results = [], isLoading = false, exchangeRate }) {
  const hasQuery = searchQuery.length > 0;
  const inputRef = useRef(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);

  // Mantener el foco en el input cuando cambia hasQuery
  useEffect(() => {
    if (hasQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasQuery]);

  // Rotar mensajes promo
  useEffect(() => {
    if (!hasQuery) return;
    const interval = setInterval(() => {
      setPromoVisible(false);
      setTimeout(() => {
        setPromoIndex((i) => (i + 1) % PROMO_MESSAGES.length);
        setPromoVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
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
                <span className="text-xs font-semibold text-primary tracking-wide">GSM SERVICES ORDERS</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold mb-3 leading-tight text-foreground">
                Buscador de Servicios <span className="text-accent font-bold">GSM</span>
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
                className={`pl-12 pr-12 text-base bg-white/70 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300 ${hasQuery ? 'h-12' : 'h-14'}`} />
              {hasQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!hasQuery && <ServicesSlider onSearchChange={onSearchChange} />}

            {/* Banner promo slider — solo con búsqueda activa */}
            {hasQuery &&
            <a
              href="https://gsmservicess.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/15 hover:border-primary/30 hover:from-primary/15 transition-all duration-300 group overflow-hidden">
              
                <span className="shrink-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span
                className="text-[11.5px] text-muted-foreground/80 truncate transition-opacity duration-400"
                style={{ opacity: promoVisible ? 1 : 0 }}>
                
                  {PROMO_MESSAGES[promoIndex].split('gsmservicess.com').map((part, i, arr) =>
                i < arr.length - 1 ?
                <span key={i}>{part}<span className="font-semibold text-primary group-hover:underline">gsmservicess.com</span></span> :
                <span key={i}>{part}</span>
                )}
                </span>
              </a>
            }
          </div>
        </div>

        {/* Resultados */}
        {hasQuery &&
        <div className="max-w-7xl mx-auto w-full px-4 pb-8">
            {isLoading ?
          <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div> :
          results.length === 0 ?
          <p className="text-center text-muted-foreground py-12">No se encontraron servicios para "{searchQuery}"</p> :

          <>
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} para "<span className="text-foreground">{searchQuery}</span>"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((service) =>
              <ServiceCard key={service.id} service={service} exchangeRate={exchangeRate} />
              )}
                </div>
              </>
          }
          </div>
        }
      </div>
    </div>);

}