import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, Zap } from 'lucide-react';
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

export default function ServiceCard({ service, exchangeRate }) {
  const rate = exchangeRate || 3.70;
  const isCreditos = service.category === 'creditos' && service.credits_quantity;
  const displayPrice = isCreditos ? service.price_usd * service.credits_quantity : service.price_usd;
  const soles = (displayPrice * rate).toFixed(2);
  const whatsappMsg = encodeURIComponent(
    `Hola, quiero solicitar el servicio:\n*${service.name}*${isCreditos ? `\n🔢 ${service.credits_quantity} créditos` : ''}\n💵 $${displayPrice.toFixed(2)} USDT\n🇵🇪 S/ ${soles} Soles`
  );

  return (
    <Card className="glass glow-blue-hover group relative overflow-hidden transition-all duration-300 hover:border-primary/30 p-5">
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
        {isCreditos && service.credits_quantity && (
          <span className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-600">
            Mín. {service.credits_quantity} créditos
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <PriceDisplay usd={displayPrice} exchangeRate={exchangeRate} />
          {isCreditos && (
            <span className="text-[10px] text-muted-foreground">
              (${service.price_usd.toFixed(2)} × {service.credits_quantity} uds.)
            </span>
          )}
          {service.delivery_time && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{service.delivery_time}</span>
            </div>
          )}
        </div>
        <a
          href={`https://wa.me/51901745069?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-1.5 text-xs font-semibold">
            <ExternalLink className="w-3 h-3" />
            SOLICITAR
          </Button>
        </a>
      </div>


    </Card>
  );
}