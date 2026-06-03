import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SearchHero from '../components/services/SearchHero';
import { useSettings } from '../hooks/useSettings';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const settings = useSettings();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('created_date', 1000),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
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
    <div className="flex-1 flex flex-col justify-center">
      <SearchHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        results={filtered}
        allServices={services}
        isLoading={isLoading}
        exchangeRate={settings?.usd_to_pen}
      />
    </div>
  );
}