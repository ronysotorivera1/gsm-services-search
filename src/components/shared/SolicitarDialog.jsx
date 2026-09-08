import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check, QrCode } from 'lucide-react';

export default function SolicitarDialog({ open, onOpenChange, whatsappUrl, serviceLabel }) {
  const settings = useSettings();
  const qrUrl = settings?.payment_qr_url;
  const number = settings?.payment_number;
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* sin permiso de portapapeles */ }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <QrCode className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Solicitar: {serviceLabel}</span>
          </DialogTitle>
        </DialogHeader>

        {(qrUrl || number) && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Puedes pagar escaneando el QR o copiando el número:
            </p>
            {qrUrl && (
              <div className="flex justify-center p-3 bg-white border border-border rounded-xl">
                <img src={qrUrl} alt="QR de pago" className="w-44 h-44 object-contain" />
              </div>
            )}
            {number && (
              <button
                type="button"
                onClick={copyNumber}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-bold tracking-wide text-foreground">{number}</span>
                {copied
                  ? <Check className="w-4 h-4 text-green-600 shrink-0" />
                  : <Copy className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground font-medium">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold">
            <ExternalLink className="w-4 h-4" />
            Continuar por WhatsApp
          </Button>
        </a>
      </DialogContent>
    </Dialog>
  );
}