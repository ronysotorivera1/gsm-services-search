import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, ShieldCheck, ShieldAlert, Smartphone, CheckCircle2, XCircle } from 'lucide-react';

export default function IcloudChecker() {
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    const val = imei.trim();
    if (!val) {
      setError('Ingresa un IMEI o Serial Number');
      return;
    }
    if (val.length < 8) {
      setError('El IMEI/SN debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await base44.functions.invoke('checkIcloud', { imei: val });
      const data = res.data;
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  const fmiOn = result?.fmi_status === 'on';
  const mdmOn = result?.mdm_status === 'on';

  return (
    <Card className="glass glow-blue-hover p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-foreground text-sm">Check iCloud (FMI)</h3>
          <p className="text-[11px] text-muted-foreground">Consulta por IMEI o Serial Number</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={imei}
          onChange={e => setImei(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          placeholder="IMEI o Serial (ej: 012428000154566)"
          className="flex-1 text-sm font-mono"
          disabled={loading}
        />
        <Button
          onClick={handleCheck}
          disabled={loading || !imei.trim()}
          size="sm"
          className="gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Consultando...' : 'Consultar'}
        </Button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          {/* FMI Status - principal */}
          <div className={`rounded-xl p-4 border-2 transition-all ${
            fmiOn
              ? 'bg-destructive/10 border-destructive/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {fmiOn
                ? <ShieldAlert className="w-8 h-8 text-destructive shrink-0" />
                : <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
              }
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Find My iPhone</p>
                <p className={`text-lg font-bold ${fmiOn ? 'text-destructive' : 'text-green-600'}`}>
                  {fmiOn ? 'ACTIVADO ⚠️' : 'Desactivado ✓'}
                </p>
              </div>
            </div>
          </div>

          {/* MDM Status */}
          {result.mdm_label && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
              mdmOn
                ? 'bg-orange-500/10 text-orange-600'
                : 'bg-muted text-muted-foreground'
            }`}>
              <span>MDM Lock:</span>
              <span>{result.mdm_label}</span>
            </div>
          )}

          {/* Detalles del dispositivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {result.description && (
              <DetailRow label="Descripción" value={result.description} />
            )}
            {result.model && (
              <DetailRow label="Modelo" value={result.model} />
            )}
            {result.imei && (
              <DetailRow label="IMEI" value={result.imei} mono />
            )}
            {result.serial && (
              <DetailRow label="Serial" value={result.serial} mono />
            )}
            {result.coverage_status && (
              <DetailRow label="Cobertura" value={result.coverage_status} />
            )}
            {result.purchase_date && (
              <DetailRow label="Compra estimada" value={result.purchase_date} />
            )}
            {result.sim_lock && (
              <DetailRow label="Sim-Lock" value={result.sim_lock} />
            )}
            {result.product_version && (
              <DetailRow label="Versión iOS" value={result.product_version} />
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground">
              ID: {result.request_id} · Costo: ${result.price}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          </div>
        </div>
      )}
    </Card>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5 bg-muted/40 rounded-lg px-3 py-2">
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      <span className={`text-foreground font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}