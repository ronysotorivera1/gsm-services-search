import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useSettings();
  const isRoot = location.pathname === '/';
  const siteName = settings?.site_name || 'GSM CHECK CENTER';

  return (
    <header
      className="md:hidden sticky top-0 z-50 glass border-b border-border/50 flex items-center h-14 px-4 gap-3 hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      
      {!isRoot ?
      <button
        onClick={() => navigate(-1)}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-foreground">
        
          <ChevronLeft className="w-6 h-6" />
        </button> :

      <div className="min-w-[44px]" />
      }
      <span className="font-bold text-primary tracking-wide text-sm flex-1 text-center hidden">{siteName}</span>
      <div className="min-w-[44px]" />
    </header>);

}