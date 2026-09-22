import React from 'react';
import { Wrench, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';

const NEW_DOMAIN = 'https://gsmservices.site/';

export default function MaintenanceScreen() {
  const settings = useSettings();
  const siteName = settings.site_name || 'GSM Services';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6 overflow-y-auto">
      <div className="max-w-md w-full text-center space-y-5 py-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">{siteName}</h1>
          <p className="text-base font-semibold text-muted-foreground">Sitio en mantenimiento</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Estamos realizando trabajos en la página. Mientras tanto, ya puedes
          visitarnos en nuestro nuevo dominio:
        </p>

        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base">
          <a href={NEW_DOMAIN} target="_blank" rel="noopener noreferrer" className="gap-2">
            gsmservices.site
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>

        <p className="text-xs text-muted-foreground">Gracias por tu paciencia. ¡Pronto estaremos de vuelta!</p>
      </div>
    </div>
  );
}