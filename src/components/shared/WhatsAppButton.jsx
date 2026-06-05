import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/51901745069"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group">
      
      <div className="flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg border border-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2 pointer-events-none whitespace-nowrap">
          <p className="text-sm font-medium text-foreground">¿Necesitas ayuda?</p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-slate-900/20 to-slate-900/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 group-hover:scale-125 animate-pulse"></div>
          

          
        </div>
      </div>
    </a>);

}