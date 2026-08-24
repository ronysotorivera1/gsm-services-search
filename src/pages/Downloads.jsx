import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Download as DownloadIcon, Loader2, Search } from 'lucide-react';
import DownloadCard from '@/components/downloads/DownloadCard';

const categoryLabels = {
  software: 'Software',
  manual: 'Manuales',
  driver: 'Drivers',
  tool: 'Herramientas',
  other: 'Otros',
};

export default function Downloads() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['downloads'],
    queryFn: () => base44.entities.Download.filter({ status: 'active' }, '-created_date', 200),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const categories = useMemo(
    () => Object.keys(categoryLabels).filter(cat => downloads.some(d => d.category === cat)),
    [downloads]
  );

  const filtered = useMemo(() => {
    return downloads.filter(d =>
      (activeCategory === 'all' || d.category === activeCategory) &&
      (!search ||
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [downloads, search, activeCategory]);

  // Agrupar por categoría y ordenar alfabéticamente por nombre dentro de cada grupo
  const grouped = useMemo(() => {
    const groups = {};
    for (const d of filtered) {
      const cat = d.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(d);
    }
    const sorted = {};
    for (const cat of Object.keys(groups)) {
      sorted[cat] = groups[cat].slice().sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' })
      );
    }
    return sorted;
  }, [filtered]);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <DownloadIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-foreground">Descargas</h1>
          <p className="text-xs text-muted-foreground">Software, drivers, manuales y herramientas</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar descargas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/70'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/70'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <DownloadIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {downloads.length === 0 ? 'Aún no hay archivos para descargar.' : 'No se encontraron descargas con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories
            .filter(cat => activeCategory === 'all' || activeCategory === cat)
            .filter(cat => grouped[cat]?.length)
            .map(cat => (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-heading font-semibold text-sm text-foreground">{categoryLabels[cat]}</h2>
                  <span className="text-[11px] text-muted-foreground">({grouped[cat].length})</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[cat].map(d => (
                    <DownloadCard key={d.id} download={d} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}