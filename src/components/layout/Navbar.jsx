import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
{ path: '/', label: 'Search', icon: Search }];


export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <span className="font-bold text-primary tracking-wide text-sm">GSM CHECK CENTER</span>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}>
                <Button variant="ghost" size="sm" className={`gap-2 ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>












































        

        {/* Mobile Nav */}
        {mobileOpen &&
        <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                  <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`
                  }>
                  
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>);

          })}
          </div>
        }
      </div>
    </nav>);

}