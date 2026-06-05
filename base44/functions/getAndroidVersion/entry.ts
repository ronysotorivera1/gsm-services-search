import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const settings = await base44.asServiceRole.entities.AppSettings.list();
  const s = settings?.[0] || {};

  return Response.json({
    android_version: s.android_version || '1.0.0',
    apk_url: s.apk_url || 'https://gsmservicess.com/app.apk',
  });
});