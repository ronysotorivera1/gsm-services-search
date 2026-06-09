import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, ExternalLink, Minus, Plus, FileText } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import PriceDisplay from '../shared/PriceDisplay';

const categoryLabels = {
  renta: 'RENTA',
  activacion: 'ACTIVACIÓN',
  imei: 'IMEI',
  remoto: 'REMOTO',
  creditos: 'CRÉDITOS',
};

const categoryColors = {
  renta: 'bg-accent/15 text-accent',
  activacion: 'bg-primary/15 text-primary',
  imei: 'bg-blue-500/15 text-blue-600',
  remoto: 'bg-purple-500/15 text-purple-600',
  creditos: 'bg-green-500/15 text-green-600',
};

const categoryIcons = {
  renta: '⚡',
  activacion: '✓',
  imei: '#',
  remoto: '🌐',
  creditos: '💳',
};

export default function ServiceCard({ service, exchangeRate, whatsappNumber }) {
  const rate = exchangeRate || 3.70;
  const waNumber = whatsappNumber || '51901745069';
  const isCreditos = service.category === 'creditos' && service.credits_quantity;
  const minQty = isCreditos ? service.credits_quantity : 1;
  const [qty, setQty] = useState(minQty);
  const [showNote, setShowNote] = useState(false);
  const hasNote = service.note_html && service.note_html.replace(/<[^>]+>/g, '').trim().length > 0;

  const displayPrice = isCreditos ? service.price_usd * qty : service.price_usd;
  const soles = (displayPrice * rate).toFixed(2);
  const buildMsg = () => {
    let msg = `Hola, quiero solicitar el servicio:\n*${service.name}*`;
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
    <Card className="glass glow-blue-hover group relative transition-all duration-300 hover:border-primary/30 p-5">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground leading-tight">{service.name}</h3>
          {service.brand && (
            <span className="text-xs text-muted-foreground font-medium mt-0.5 block">{service.brand}</span>
          )}
        </div>
        <StatusBadge status={service.status} />
      </div>

      {service.description && (
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
      )}

      <div className="flex gap-2 mb-4 items-center">
        {service.category && (
          <span className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg ${categoryColors[service.category] || 'bg-secondary/60 text-secondary-foreground'}`}>
            <span className="mr-1">{categoryIcons[service.category]}</span>
            {categoryLabels[service.category] || service.category}
          </span>
        )}
        {service.duration && (
          <span className="text-[10px] font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
            {service.duration}
          </span>
        )}
        {isCreditos && (
          <span className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-600">
            Mín. {minQty} créditos
          </span>
        )}
      </div>

      {isCreditos && (
        <div className="flex items-center gap-2 mb-3">
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

      <div className="flex items-end justify-between">
        <div>
          <PriceDisplay usd={displayPrice} exchangeRate={exchangeRate} />
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
        >
          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-1.5 text-xs font-semibold">
            <ExternalLink className="w-3 h-3" />
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
            <span className="font-medium">Nota</span>
            <FileText className="w-3 h-3 ml-auto opacity-40" />
          </button>
        </div>
      )}

      <Dialog open={showNote} onOpenChange={setShowNote}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              {service.name}
            </DialogTitle>
          </DialogHeader>
          <div
            className="text-sm text-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: service.note_html }}
          />
        </DialogContent>
      </Dialog>

    </Card>
  );
}