import React from 'react';
import { Send } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/51901745069"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg border border-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2 pointer-events-none whitespace-nowrap">
          <p className="text-sm font-medium text-foreground">¿Necesitas ayuda?</p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 group-hover:scale-125 animate-pulse"></div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50 border border-primary/30">
            <Send className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </a>
  );
}