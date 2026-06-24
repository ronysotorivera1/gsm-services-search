import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Zap, Loader2, X, List, ChevronDown, ChevronRight } from 'lucide-react';

const CATEGORY_LABELS = {
  renta: 'RENTA',
  activacion: 'ACTIVACIÓN',
  imei: 'IMEI',
  remoto: 'REMOTO',
  creditos: 'CRÉDITOS',
};

function GroupedResults({ services, exchangeRate, whatsappNumber }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (cat) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }));

  const groups = Object.entries(
    services.reduce((acc, s) => {
      const key = s.category || 'otros';
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {})
  )
  .sort(([a], [b]) => (CATEGORY_LABELS[a] || a).localeCompare(CATEGORY_LABELS[b] || b, 'es'))
  .map(([cat, items]) => [cat, [...items].sort((a, b) => a.name.localeCompare(b.name, 'es'))]);

  return (
    <div className="space-y-4">
      {groups.map(([cat, items]) => {
        const isOpen = !collapsed[cat];
        return (
          <div key={cat} className="border border-border rounded-xl overflow-hidden bg-white/40">
            <button
              onClick={() => toggle(cat)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{CATEGORY_LABELS[cat] || cat}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              {isOpen
                ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(service => (
                  <ServiceCard key={service.id} service={service} exchangeRate={exchangeRate} whatsappNumber={whatsappNumber} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
import ServicesSlider from './ServicesSlider';
import ServiceCard from './ServiceCard';
import IcloudChecker from './IcloudChecker';

const PROMO_MESSAGES = [
'⚡ Precios vía WhatsApp · Para mejores precios y procesamiento automático visita gsmservicess.com',
'🚀 ¿Quieres procesar más rápido y más barato? Visita gsmservicess.com',
'💡 Procesamiento automático 24/7 en gsmservicess.com — sin esperas',
'🔥 Mejores precios garantizados en gsmservicess.com · Pago automático'];


export default function SearchHero({ searchQuery, onSearchChange, results = [], allServices = [], isLoading = false, exchangeRate, whatsappNumber }) {
  const [showAll, setShowAll] = useState(false);
  const hasQuery = searchQuery.length > 0;
  const displayResults = showAll && !hasQuery ? allServices : results;
  const showResults = hasQuery || showAll;
  const inputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueNames = Array.from(new Set(allServices.map(s => s.name))).sort();
  const suggestions = searchQuery ? uniqueNames.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : [];

  // Mantener el foco en el input cuando cambia hasQuery
  useEffect(() => {
    if (hasQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasQuery]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">



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

            {/* Input */}
            <div className="relative">
              <div className="relative flex items-center">
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
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className={`pl-12 pr-10 text-base bg-white/70 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300 ${hasQuery ? 'h-12' : 'h-14'}`}
                />
                {hasQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/20 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestions.map(name => (
                      <button
                        key={name}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
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
            </div>

            {!hasQuery && (
              <>
                <IcloudChecker />
                <ServicesSlider onSearchChange={onSearchChange} />
                <button
                  type="button"
                  onClick={() => setShowAll(v => !v)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/80 transition-all"
                >
                  <List className="w-4 h-4" />
                  {showAll ? 'Ocultar servicios' : 'Ver todos los servicios'}
                </button>
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
        {showResults &&
        <div className="max-w-7xl mx-auto w-full px-4 pb-8">
            {isLoading ?
          <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div> :
          displayResults.length === 0 ?
          <p className="text-center text-muted-foreground py-12">No se encontraron servicios para "{searchQuery}"</p> :

          <>
                <p className="text-sm text-muted-foreground mb-4">
                  {hasQuery
                    ? <>{displayResults.length} resultado{displayResults.length !== 1 ? 's' : ''} para "<span className="text-foreground">{searchQuery}</span>"</>
                    : <>{displayResults.length} servicios disponibles</>
                  }
                </p>
                {showAll && !hasQuery
                  ? <GroupedResults services={displayResults} exchangeRate={exchangeRate} whatsappNumber={whatsappNumber} />
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {displayResults.map((service) =>
                        <ServiceCard key={service.id} service={service} exchangeRate={exchangeRate} whatsappNumber={whatsappNumber} />
                      )}
                    </div>
                }
              </>
          }
          </div>
        }
      </div>
    </div>);

}