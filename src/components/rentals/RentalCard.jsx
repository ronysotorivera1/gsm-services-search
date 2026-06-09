import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const tiers = [
  { key: 'price_1h', label: '1H' },
  { key: 'price_6h', label: '6H' },
  { key: 'price_12h', label: '12H' },
  { key: 'price_24h', label: '24H' },
];

export default function RentalCard({ rental, exchangeRate, whatsappNumber }) {
  const number = whatsappNumber || '51901745069';
  const whatsappMsg = encodeURIComponent(`Hola, quiero rentar: ${rental.tool_name}`);

  return (
    <Card className="glass glow-blue-hover group relative overflow-hidden transition-all duration-300 hover:border-primary/30 p-5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground">{rental.tool_name}</h3>
          {rental.description && (
            <p className="text-xs text-muted-foreground mt-1">{rental.description}</p>
          )}
        </div>
        <StatusBadge status={rental.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {tiers.map(tier => {
          const price = rental[tier.key];
          if (!price) return null;
          const soles = (price * exchangeRate).toFixed(2);
          return (
            <div key={tier.key} className="bg-secondary/50 rounded-lg p-3 text-center border border-border/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">{tier.label}</span>
              </div>
              <div className="text-sm font-bold text-primary">${price.toFixed(2)}</div>
              <div className="text-[10px] text-muted-foreground">S/ {soles}</div>
            </div>
          );
        })}
      </div>

      <a
        href={`https://wa.me/${number}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="w-full bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 gap-2 text-xs font-semibold">
          <ExternalLink className="w-3 h-3" />
          RENTAR
        </Button>
      </a>
    </Card>
  );
}