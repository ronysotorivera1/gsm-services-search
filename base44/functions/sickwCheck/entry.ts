import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const apiKey = Deno.env.get("SICKW_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const imei = (body.imei || '').trim();
    const service = (body.service || '3').trim(); // default: iCloud ON/OFF

    if (!imei) {
      return Response.json({ error: 'IMEI o SN requerido' }, { status: 400 });
    }
    if (imei.length < 4 || imei.length > 250) {
      return Response.json({ error: 'IMEI o SN inválido' }, { status: 400 });
    }

    const url = `https://www.sickw.com/api.php?format=JSON&key=${encodeURIComponent(apiKey)}&imei=${encodeURIComponent(imei)}&service=${encodeURIComponent(service)}`;

    const apiRes = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    });
    const raw = await apiRes.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'Respuesta inválida del API', raw: raw.substring(0, 500) }, { status: 502 });
    }

    // SICKW returns: { result, status, imei, balance, ip }
    // status can be: "success", "error", "rejected"
    return Response.json({
      success: data.status === 'success',
      status: data.status,
      result: data.result,
      imei: data.imei,
      balance: data.balance,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});