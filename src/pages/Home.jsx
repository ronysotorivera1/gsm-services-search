import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SearchHero from '../components/services/SearchHero';
import { useSettings } from '../hooks/useSettings';
import usePullToRefresh from '../hooks/usePullToRefresh';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const settings = useSettings();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({}, 'created_date', 2000),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const refreshing = usePullToRefresh(() =>
    queryClient.invalidateQueries({ queryKey: ['services'] })
  );

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
      {refreshing && (
        <div className="flex justify-center py-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}
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