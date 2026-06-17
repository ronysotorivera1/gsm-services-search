import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuroraBackground from './AuroraBackground';
import CustomCursor from './CustomCursor';
import Footer from './Footer';
import MobileHeader from './MobileHeader';
import UpdateBanner from './UpdateBanner';
export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <AuroraBackground />
      <CustomCursor />
      <UpdateBanner />
      <MobileHeader />
      <main className="flex-1 flex flex-col">
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
    </div>
  );
}