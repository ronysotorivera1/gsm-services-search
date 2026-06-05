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


export default function SearchHero({ searchQuery, onSearchChange, results = [], allServices = [], isLoading = false, exchangeRate }) {
  const hasQuery = searchQuery.length > 0;
  const inputRef = useRef(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueNames = Array.from(new Set(allServices.map(s => s.name))).sort();
  const suggestions = searchQuery ? uniqueNames.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : [];

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
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight text-foreground">
                Buscador de Servicios <span className="text-accent font-bold">GSM</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 max-w-lg mx-auto">
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
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/20 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {suggestions.map(name => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        onSearchChange(name);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 border-b border-primary/10 last:border-b-0 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!hasQuery && (
              <>
                <ServicesSlider onSearchChange={onSearchChange} />
                <div className="mt-5 flex justify-center">
                  <a
                    href="https://gsmservicess.com/app.apk"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/60 hover:bg-white/90 text-muted-foreground hover:text-foreground text-sm transition-all duration-200 shadow-sm backdrop-blur-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zm-2.5-1C2.67 17 2 17.67 2 18.5v-9C2 8.67 2.67 8 3.5 8S5 8.67 5 9.5v9c0 .83-.67 1.5-1.5 1.5zm17 0c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1c-.57 0-1.11.08-1.64.23L8.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3A5.977 5.977 0 0 0 6 7h12a5.977 5.977 0 0 0-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                    </svg>
                    Descargar app Android (APK)
                  </a>
                </div>
              </>
            )}

            {/* Banner promo ticker — solo con búsqueda activa */}
            {hasQuery &&
            <a
              href="https://gsmservicess.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-y border-primary/40 hover:border-primary/60 transition-all duration-300 group overflow-hidden shadow-sm" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
              
                <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <div className="overflow-hidden flex-1">
                  <div className="flex whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite' }}>
                    {[...PROMO_MESSAGES, ...PROMO_MESSAGES].map((msg, i) => (
                      <span key={i} className="text-sm font-medium text-foreground/90 mr-16">
                        {msg.split('gsmservicess.com').map((part, j, arr) =>
                          j < arr.length - 1 ?
                            <span key={j}>{part}<span className="font-bold text-primary group-hover:underline">gsmservicess.com</span></span> :
                            <span key={j}>{part}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
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