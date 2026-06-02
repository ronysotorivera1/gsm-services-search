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


    </div>
  );
}