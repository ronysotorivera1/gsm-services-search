import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, ExternalLink, Minus, Plus, FileText, Check } from 'lucide-react';
import DOMPurify from 'dompurify';
import StatusBadge from '../shared/StatusBadge';
import PriceDisplay from '../shared/PriceDisplay';

const categoryLabels = {
  renta: 'RENTA',
  activacion: 'ACTIVACIÓN',
  imei: 'IMEI',
  remoto: 'REMOTO',
  creditos: 'CRÉDITOS',
  streaming: 'STREAMING',
};

// Tema de color por categoría: badge, estado seleccionado del variant y precio.
const categoryTheme = {
  renta: {
    badge: 'bg-accent/15 text-accent',
    selectedBorder: 'border-accent',
    selectedBg: 'bg-accent/5',
    selectedRing: 'ring-accent/30',
    radioActive: 'border-accent bg-accent text-accent-foreground',
    priceActive: 'text-accent',
    priceDisplay: 'text-accent',
  },
  activacion: {
    badge: 'bg-primary/15 text-primary',
    selectedBorder: 'border-primary',
    selectedBg: 'bg-primary/5',
    selectedRing: 'ring-primary/30',
    radioActive: 'border-primary bg-primary text-primary-foreground',
    priceActive: 'text-primary',
    priceDisplay: 'text-primary',
  },
  imei: {
    badge: 'bg-blue-500/15 text-blue-600',
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    selectedRing: 'ring-blue-500/30',
    radioActive: 'border-blue-500 bg-blue-500 text-white',
    priceActive: 'text-blue-600',
    priceDisplay: 'text-blue-600',
  },
  remoto: {
    badge: 'bg-purple-500/15 text-purple-600',
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    selectedRing: 'ring-purple-500/30',
    radioActive: 'border-purple-500 bg-purple-500 text-white',
    priceActive: 'text-purple-600',
    priceDisplay: 'text-purple-600',
  },
  creditos: {
    badge: 'bg-green-500/15 text-green-600',
    selectedBorder: 'border-green-500',
    selectedBg: 'bg-green-50',
    selectedRing: 'ring-green-500/30',
    radioActive: 'border-green-500 bg-green-500 text-white',
    priceActive: 'text-green-600',
    priceDisplay: 'text-green-600',
  },
  streaming: {
    badge: 'bg-rose-500/15 text-rose-600',
    selectedBorder: 'border-rose-500',
    selectedBg: 'bg-rose-50',
    selectedRing: 'ring-rose-500/30',
    radioActive: 'border-rose-500 bg-rose-500 text-white',
    priceActive: 'text-rose-600',
    priceDisplay: 'text-rose-600',
  },
};

export default function ServiceGroupCard({ group, services, exchangeRate, whatsappNumber }) {
  const settings = useSettings();
  const rate = exchangeRate || 3.70;
  const waNumber = whatsappNumber || settings?.whatsapp_number || '51901745069';

  const [selectedId, setSelectedId] = useState(services[0]?.id);
  const service = services.find(s => s.id === selectedId) || services[0];

  const isCreditos = service?.category === 'creditos' && service?.credits_quantity;
  const minQty = isCreditos ? service.credits_quantity : 1;
  const [qty, setQty] = useState(minQty);
  const [showNote, setShowNote] = useState(false);

  // Reset de cantidad al cambiar de variante
  useEffect(() => {
    setQty(service?.category === 'creditos' && service?.credits_quantity ? service.credits_quantity : 1);
  }, [selectedId]);

  if (!service) return null;

  const cat = service.category;
  const theme = categoryTheme[cat] || categoryTheme.activacion;

  const displayPrice = isCreditos ? service.price_usd * qty : service.price_usd;
  const soles = (displayPrice * rate).toFixed(2);
  const hasNote = service.note_html && service.note_html.replace(/<[^>]+>/g, '').trim().length > 0;

  const buildMsg = () => {
    let msg = `Hola, quiero solicitar el servicio:\n*${group}* — ${service.name}`;
    if (service.brand) msg += `\n🏷️ Marca: ${service.brand}`;
    if (service.category) msg += `\n📂 Categoría: ${categoryLabels[service.category] || service.category}`;
    if (service.duration) msg += `\n⏳ Duración: ${service.duration}`;
    if (isCreditos) msg += `\n🔢 Créditos: ${qty}`;
    if (service.delivery_time) msg += `\n🚀 Entrega: ${service.delivery_time}`;
    if (service.description) msg += `\n📝 ${service.description}`;
    msg += `\n\n💵 $${displayPrice.toFixed(2)} USDT\n🇵🇪 S/ ${soles} Soles`;
    return msg;
  };
  const whatsappMsg = encodeURIComponent(buildMsg());

  return (
    <Card className="glass glow-blue-hover group relative transition-all duration-300 hover:border-primary/30 p-5 sm:p-6 w-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground leading-tight break-words">{group}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>{categoryLabels[cat] || cat}</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium mt-0.5 block">
            {services.length} variantes
          </span>
        </div>
        <StatusBadge status={service.status} />
      </div>

      {service.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
      )}

      {/* Variantes en fila horizontal — ocupan todo el ancho */}
      <div className="flex flex-wrap gap-3 mb-4">
        {services.map(s => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={`flex flex-col flex-1 min-w-[160px] p-3 rounded-xl border text-left transition-all ${
                active
                  ? `${theme.selectedBorder} ${theme.selectedBg} ring-1 ${theme.selectedRing}`
                  : 'border-border bg-white/60 hover:border-primary/40 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  active ? theme.radioActive : 'border-border'
                }`}>
                  {active && <Check className="w-3 h-3" />}
                </span>
                <span className={`text-sm font-semibold line-clamp-2 break-words leading-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.name}
                </span>
              </div>
              <div className="mt-2 pl-6 flex items-baseline gap-2 flex-wrap">
                {s.duration && (
                  <span className="text-[11px] text-muted-foreground">· {s.duration}</span>
                )}
                <span className={`text-base font-bold ${active ? theme.priceActive : 'text-foreground'}`}>
                  ${s.price_usd.toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isCreditos && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQty(q => Math.max(minQty, q - 1))}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            min={minQty}
            max={1000}
            value={qty}
            onChange={e => {
              const val = parseInt(e.target.value) || minQty;
              setQty(Math.max(minQty, Math.min(1000, val)));
            }}
            className="w-14 text-center text-sm font-semibold border border-border rounded-lg h-7 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <button
            onClick={() => setQty(q => Math.min(1000, q + 1))}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-muted-foreground">(${service.price_usd.toFixed(2)} c/u)</span>
        </div>
      )}

      {/* Pie: precio + solicitar */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-t border-border/50 pt-4">
        <div>
          <PriceDisplay usd={displayPrice} exchangeRate={exchangeRate} colorClass={theme.priceDisplay} />
          {service.delivery_time && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{service.delivery_time}</span>
            </div>
          )}
        </div>
        <a
          href={`https://wa.me/${waNumber}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto"
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold">
            <ExternalLink className="w-4 h-4" />
            SOLICITAR
          </Button>
        </a>
      </div>

      {hasNote && (
        <div className="mt-3 border-t border-border/50">
          <button
            onClick={() => setShowNote(true)}
            className="w-full flex items-center gap-1.5 pt-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="font-medium">Nota · {service.name}</span>
          </button>
        </div>
      )}

      <Dialog open={showNote} onOpenChange={setShowNote}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              {group} — {service.name}
            </DialogTitle>
          </DialogHeader>
          <div
            className="text-sm text-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.note_html || '') }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}