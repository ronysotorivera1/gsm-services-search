import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import * as XLSX from 'npm:xlsx@0.18.5';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const [services, appSettings, users] = await Promise.all([
      base44.asServiceRole.entities.Service.list(),
      base44.asServiceRole.entities.AppSettings.list(),
      base44.asServiceRole.entities.User.list(),
    ]);

    const wb = XLSX.utils.book_new();

    const addSheet = (data, name) => {
      const ws = XLSX.utils.json_to_sheet(data.length ? data : [{}]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    addSheet(services, 'Servicios');
    addSheet(appSettings, 'Configuracion');
    addSheet(users, 'Usuarios');

    const buf = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    return Response.json({
      file: buf,
      filename: `gsmservices_database_${new Date().toISOString().slice(0, 10)}.xlsx`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});