import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, X } from 'lucide-react';

export default function UpdateBanner() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // La app Android pasa su versión como ?app_version=1.0.0
    const params = new URLSearchParams(window.location.search);
    const installedVersion = params.get('app_version');
    if (!installedVersion) return;

    base44.functions.invoke('getAndroidVersion', {}).then(res => {
      const { android_version, apk_url } = res.data;
      if (android_version && installedVersion !== android_version) {
        setUpdateInfo({ android_version, apk_url });
      }
    }).catch(() => {});
  }, []);

  if (!updateInfo || dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-primary/90 to-primary text-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-md z-50">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Download className="w-4 h-4 shrink-0" />
        <span>Nueva versión <strong>{updateInfo.android_version}</strong> disponible</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={updateInfo.apk_url}
          download
          className="px-3 py-1 rounded-full bg-white text-primary text-xs font-semibold hover:bg-white/90 transition-colors"
        >
          Actualizar
        </a>
        <button onClick={() => setDismissed(true)} className="opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}