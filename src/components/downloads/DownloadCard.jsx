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
  const hasImage = !!download.image_url;

  return (
    <div className="glass glow-blue-hover group relative rounded-xl border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

      {hasImage ? (
        <div className="relative h-40 overflow-hidden">
          <img src={download.image_url} alt={download.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <h3 className="font-heading font-semibold text-white leading-tight drop-shadow-md">{download.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${cfg.color}`}>{cfg.label}</span>
              {download.version && <span className="text-[10px] text-white/90 font-medium drop-shadow">{download.version}</span>}
              {download.file_size && <span className="text-[10px] text-white/90 drop-shadow">{download.file_size}</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-foreground leading-tight truncate">{download.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${cfg.color}`}>{cfg.label}</span>
              {download.version && <span className="text-[10px] text-muted-foreground font-medium">{download.version}</span>}
              {download.file_size && <span className="text-[10px] text-muted-foreground">{download.file_size}</span>}
            </div>
          </div>
        </div>
      )}

      <div className={hasImage ? 'p-5 pt-3' : 'px-5 pb-5'}>
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
    </div>
  );
}