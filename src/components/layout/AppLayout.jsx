import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import WhatsAppButton from '../shared/WhatsAppButton';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsAppButton />
    </div>
  );
}