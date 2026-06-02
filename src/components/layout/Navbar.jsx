import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Wrench, Zap, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
{ path: '/', label: 'Search', icon: Search },
{ path: '/rentals', label: 'Rentals', icon: Wrench },
{ path: '/admin', label: 'Admin', icon: Shield }];


export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        












































        

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