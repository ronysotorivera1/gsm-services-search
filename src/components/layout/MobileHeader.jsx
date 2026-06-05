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

  return null;


















}