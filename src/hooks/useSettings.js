import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSettings() {
  const { data } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
    initialData: [],
  });

  const settings = data?.[0] || { usd_to_pen: 3.70, whatsapp_number: '51901745069' };
  return settings;
}