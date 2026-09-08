import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check, QrCode } from 'lucide-react';

export default function SolicitarDialog({ open, onOpenChange, whatsappUrl, serviceLabel }) {
  const settings = useSettings();
  const [selected, setSelected] = useState('');
  const [copied, setCopied] = useState(false);

  const methods = [
    { key: 'yape', label: 'Yape / Plin', qrUrl: settings?.payment_qr_url, number: settings?.payment_number },
    { key: 'binance', label: 'Binance', qrUrl: settings?.binance_qr_url, number: settings?.binance_id },
  ].filter(m => m.qrUrl || m.number);

  useEffect(() => {
    if (open) {
      setSelected(methods.length > 0 ? methods[0].key : '');
      setCopied(false);
    }
  }, [open]);

  const active = methods.find(m => m.key === selected) || methods[0];

  const copyNumber = async () => {
    if (!active?.number) return;
    try {
      await navigator.clipboard.writeText(active.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* sin permiso de portapapeles */ }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-sm p-4 gap-2 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm min-w-0">
            <QrCode className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate flex-1 min-w-0">Solicitar: {serviceLabel}</span>
          </DialogTitle>
        </DialogHeader>

        {methods.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Puedes pagar escaneando el QR o copiando el número:
            </p>

            {methods.length > 1 && (
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-muted">
                {methods.map(m => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => { setSelected(m.key); setCopied(false); }}
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      active?.key === m.key
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            {active?.qrUrl && (
              <div className="flex justify-center p-2 bg-white border border-border rounded-xl">
                <img src={active.qrUrl} alt={`QR de pago ${active.label}`} className="w-32 h-32 sm:w-40 sm:h-40 object-contain" />
              </div>
            )}
            {active?.number && (
              <button
                type="button"
                onClick={copyNumber}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-bold tracking-wide text-foreground">{active.number}</span>
                {copied
                  ? <Check className="w-4 h-4 text-green-600 shrink-0" />
                  : <Copy className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
            )}
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