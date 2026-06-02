import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Wrench, Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
{ path: '/', label: 'Search', icon: Search },
{ path: '/rentals', label: 'Rentals', icon: Wrench }];


export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">GSMServices</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-medium">CENTER</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 text-sm font-medium transition-all ${
                    isActive ?
                    'text-primary bg-primary/10' :
                    'text-muted-foreground hover:text-foreground'}`
                    }>
                    
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>);

            })}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}>
            
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
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