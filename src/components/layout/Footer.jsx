import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { base44 } from '@/api/base44Client';
import { Settings, LogIn, LogOut, Home } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function Footer() {
  const settings = useSettings();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      setIsAuthenticated(authed);
      if (authed) {
        base44.auth.me().then(user => {
          if (user?.role === 'admin') setIsAdmin(true);
        }).catch(() => {});
      }
    });
  }, []);

  const WaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  return (
    <footer className="bg-card/50 border-t border-border py-4 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Copyright — izquierda en desktop */}
        <p className="text-xs text-muted-foreground text-center sm:text-left order-last sm:order-first">
          {settings?.footer_contact
            ? <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.footer_contact) }} />
            : <>GSMServices © 2026 · Derechos reservados</>
          }
        </p>

        {/* Botones — grid en móvil, fila a la derecha en desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:justify-end">

          <a
            href={settings?.whatsapp_channel_url || 'https://whatsapp.com/channel/0029Vb6ggImLI8YbWLjlzI2A'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all"
          >
            <WaIcon />
            <span>WhatsApp</span>
          </a>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar sesión</span>
            </Link>
          ) : (
            <button
              onClick={() => base44.auth.logout()}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          )}

          {isAdmin && (
            isAdminPage ? (
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-muted-foreground hover:text-primary hover:bg-muted/80 text-xs font-semibold transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Buscador</span>
              </Link>
            ) : (
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-muted-foreground hover:text-primary hover:bg-muted/80 text-xs font-semibold transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )
          )}

        </div>

      </div>
    </footer>
  );
}