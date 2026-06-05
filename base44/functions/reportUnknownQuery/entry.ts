import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: 'question is required' }, { status: 400 });
    }

    // Evitar duplicados recientes (misma pregunta en las últimas 24h)
    const existing = await base44.asServiceRole.entities.AIQuery.filter({ question, status: 'pending' });
    if (existing.length > 0) {
      return Response.json({ saved: false, message: 'Ya existe esta consulta pendiente' });
    }

    await base44.asServiceRole.entities.AIQuery.create({ question, status: 'pending' });
    return Response.json({ saved: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});