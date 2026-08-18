import React from 'react';
import { Download as DownloadIcon, FileText, Wrench, HardDrive, Cpu, Package } from 'lucide-react';

const categoryConfig = {
  software: { label: 'Software', icon: Cpu, color: 'bg-primary/15 text-primary' },
  manual: { label: 'Manual', icon: FileText, color: 'bg-blue-500/15 text-blue-600' },
  driver: { label: 'Driver', icon: HardDrive, color: 'bg-purple-500/15 text-purple-600' },
  tool: { label: 'Herramienta', icon: Wrench, color: 'bg-accent/15 text-accent' },
  other: { label: 'Otros', icon: Package, color: 'bg-green-500/15 text-green-600' },
};

export default function DownloadCard({ download }) {
  const cfg = categoryConfig[download.category] || categoryConfig.other;
  const Icon = cfg.icon;

  return (
    <div className="glass glow-blue-hover group relative rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-primary/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground leading-tight truncate">{download.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${cfg.color}`}>
              {cfg.label}
            </span>
            {download.version && (
              <span className="text-[10px] text-muted-foreground font-medium">{download.version}</span>
            )}
            {download.file_size && (
              <span className="text-[10px] text-muted-foreground">{download.file_size}</span>
            )}
          </div>
        </div>
      </div>

      {download.description && (
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{download.description}</p>
      )}

      <a
        href={download.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-semibold transition-colors w-full justify-center"
      >
        <DownloadIcon className="w-3.5 h-3.5" />
        Descargar
      </a>
    </div>
  );
}