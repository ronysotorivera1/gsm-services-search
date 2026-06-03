import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, Package } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import PriceDisplay from '../shared/PriceDisplay';

const serviceTypeLabels = {
  service: 'Servicio',
  rental: 'Renta',
  license: 'Licencia',
};

export default function ServiceCard({ service, exchangeRate }) {
  const rate = exchangeRate || 3.70;
  const soles = (service.price_usd * rate).toFixed(2);
  const whatsappMsg = encodeURIComponent(
    `Hola, quiero solicitar el servicio:\n*${service.name}*\n💵 $${service.price_usd} USDT\n🇵🇪 S/ ${soles} Soles`
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

      <div className="flex gap-2 mb-4">
        {service.service_type && (
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-secondary/60 text-secondary-foreground">
            {serviceTypeLabels[service.service_type] || service.service_type}
          </span>
        )}
        {service.duration && (
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">
            {service.duration}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <PriceDisplay usd={service.price_usd} exchangeRate={exchangeRate} />
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