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
    <div style={{ background: 'linear-gradient(160deg, #dce8f5 0%, #e8f0f8 40%, #c8ddf0 100%)' }} className="flex-1">
      <SearchHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        results={filtered}
        isLoading={isLoading}
        exchangeRate={settings?.usd_to_pen}
      />
    </div>
  );
}