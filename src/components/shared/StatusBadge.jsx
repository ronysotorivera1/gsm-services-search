import React from 'react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  active: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'ACTIVO' },
  inactive: { color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', dot: 'bg-slate-400', label: 'INACTIVO' },
  out_of_stock: { color: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400', label: 'SIN STOCK' },
  delay: { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'DELAY' },
  offline: { color: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400', label: 'OFFLINE' },
};

export default function StatusBadge({ status = 'active' }) {
  const config = statusConfig[status] || statusConfig.active;
  return (
    <Badge variant="outline" className={`${config.color} gap-1.5 text-[10px] font-semibold tracking-wider px-2 py-0.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </Badge>
  );
}