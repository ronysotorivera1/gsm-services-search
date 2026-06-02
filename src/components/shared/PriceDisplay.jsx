import React from 'react';

export default function PriceDisplay({ usd, exchangeRate = 3.70, size = 'md' }) {
  const soles = (usd * exchangeRate).toFixed(2);
  const sizes = {
    sm: { usd: 'text-base font-bold', pen: 'text-xs' },
    md: { usd: 'text-xl font-bold', pen: 'text-sm' },
    lg: { usd: 'text-2xl font-bold', pen: 'text-base' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col">
      <span className={`${s.usd} text-primary`}>
        ${usd.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">USD</span>
      </span>
      <span className={`${s.pen} text-muted-foreground`}>
        S/ {soles}
      </span>
    </div>
  );
}