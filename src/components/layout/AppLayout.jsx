import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import WhatsAppButton from '../shared/WhatsAppButton';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <WhatsAppButton />
    </div>
  );
}