import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import SearchHero from '../components/services/SearchHero';
import CategoryFilter from '../components/services/CategoryFilter';
import ServiceCard from '../components/services/ServiceCard';
import { useSettings } from '../hooks/useSettings';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const settings = useSettings();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-created_date', 200),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = !searchQuery ||
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, activeCategory]);

  return (
    <div>
      <SearchHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">Servicios</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} servicio{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
              {settings.usd_to_pen && (
                <span className="ml-2">· TC: S/ {settings.usd_to_pen}</span>
              )}
            </p>
          </div>
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No se encontraron servicios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                exchangeRate={settings.usd_to_pen || 3.70}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}