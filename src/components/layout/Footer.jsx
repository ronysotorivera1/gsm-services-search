import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { base44 } from '@/api/base44Client';
import { Settings, LogIn, LogOut } from 'lucide-react';

const OWNER_EMAIL = 'ronysotorivera1@gmail.com';

export default function Footer() {
  const settings = useSettings();
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      setIsAuthenticated(authed);
      if (authed) {
        base44.auth.me().then(user => {
          if (user?.email === OWNER_EMAIL) setIsOwner(true);
        }).catch(() => {});
      }
    });
  }, []);

  return (
    <footer className="bg-card/50 border-t border-border py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          {settings?.footer_contact
            ? <span dangerouslySetInnerHTML={{ __html: settings.footer_contact }} />
            : <>GSMServices © 2026 · Derechos reservados</>
          }
        </p>

        {/* Botones derecha */}
        <div className="flex items-center gap-2">

          {/* WhatsApp Canal */}
          <a
            href="https://whatsapp.com/channel/0029Vb6ggImLI8YbWLjlzI2A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Canal WhatsApp
          </a>

          {/* Login / Logout */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={() => base44.auth.logout()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-semibold transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar sesión
            </button>
          )}

          {/* Admin */}
          {isOwner && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground hover:text-primary hover:bg-muted/80 text-xs font-semibold transition-all duration-200"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}

          {/* APK Download */}
          <a
            href={settings?.apk_url || 'https://gsmservicess.com/app.apk'}
            download
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 text-xs font-semibold transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zm-2.5-1C2.67 17 2 17.67 2 18.5v-9C2 8.67 2.67 8 3.5 8S5 8.67 5 9.5v9c0 .83-.67 1.5-1.5 1.5zm17 0c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1c-.57 0-1.11.08-1.64.23L8.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3A5.977 5.977 0 0 0 6 7h12a5.977 5.977 0 0 0-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
            </svg>
            App Android (APK)
          </a>

        </div>

      </div>
    </footer>
  );
}