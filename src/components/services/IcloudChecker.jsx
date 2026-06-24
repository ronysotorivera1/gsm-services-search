import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Cloud, Loader2, Search, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function IcloudChecker() {
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    const trimmed = imei.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await base44.functions.invoke('sickwCheck', { imei: trimmed, service: '3' });
      const data = res.data || res;
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setResult(data);
      } else {
        // rejected or error from SICKW
        setError(data.result || 'No se pudo obtener el resultado');
      }
    } catch (e) {
      setError(e.message || 'Error al conectar con el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCheck();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-2">
      <div className="glass rounded-2xl border border-primary/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground text-sm leading-tight">Check iCloud por IMEI / SN</h3>
            <p className="text-xs text-muted-foreground">Verifica el estado de iCloud (ON/OFF) en tiempo real</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ingresa IMEI o Serial Number..."
              className="w-full pl-10 pr-3 h-11 text-sm bg-white/70 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || !imei.trim()}
            className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="hidden sm:inline">{loading ? 'Verificando...' : 'Verificar'}</span>
          </button>
        </div>

        {/* Resultado */}
        {error && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 rounded-xl bg-white/60 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">IMEI / SN:</span>
              <span className="text-sm font-mono font-semibold text-foreground">{result.imei}</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              {result.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground mb-1">RESULTADO</p>
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">{result.result}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}