import React from 'react';
import { Outlet } from 'react-router-dom';
import WhatsAppButton from '../shared/WhatsAppButton';
import AuroraBackground from './AuroraBackground';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuroraBackground />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}