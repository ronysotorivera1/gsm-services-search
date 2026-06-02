import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import SearchHero from '../components/services/SearchHero';
import ServiceCard from '../components/services/ServiceCard';
import { useSettings } from '../hooks/useSettings';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const settings = useSettings();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-created_date', 200),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return services.filter(s =>
      !searchQuery ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  return (
    <div>
      <SearchHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No se encontraron servicios para "{searchQuery}"</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "<span className="text-foreground">{searchQuery}</span>"</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}