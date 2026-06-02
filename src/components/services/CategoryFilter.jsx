import React from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  { value: 'all', label: 'ALL' },
  { value: 'imei', label: 'IMEI' },
  { value: 'unlock', label: 'UNLOCK' },
  { value: 'frp', label: 'FRP' },
  { value: 'mdm', label: 'MDM' },
  { value: 'server', label: 'SERVER' },
  { value: 'remote', label: 'REMOTE' },
  { value: 'premium', label: 'PREMIUM' },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <Button
          key={cat.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(cat.value)}
          className={`text-xs font-semibold tracking-wide transition-all ${
            active === cat.value
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          }`}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}