import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const settings = await base44.asServiceRole.entities.AppSettings.list();
    const aiContext = settings[0]?.ai_context || '';
    return Response.json({ ai_context: aiContext });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});