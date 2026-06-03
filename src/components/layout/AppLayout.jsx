import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import WhatsAppButton from '../shared/WhatsAppButton';
import AuroraBackground from './AuroraBackground';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuroraBackground />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <WhatsAppButton />
    </div>
  );
}