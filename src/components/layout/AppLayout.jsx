import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import WhatsAppButton from '../shared/WhatsAppButton';
import AuroraBackground from './AuroraBackground';
import Footer from './Footer';
import BottomTabBar from './BottomTabBar';
import Navbar from './Navbar';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <AuroraBackground />
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomTabBar />
    </div>
  );
}