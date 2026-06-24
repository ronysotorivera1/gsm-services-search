import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const imei = (body?.imei || '').trim();

    if (!imei) {
      return Response.json({ error: 'IMEI o Serial requerido' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SICKW_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const url = `https://sickw.com/api.php?format=json&key=${apiKey}&imei=${encodeURIComponent(imei)}&service=105`;
    const apiRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Base44App/1.0)',
        'Accept': 'application/json'
      }
    });
    const rawText = await apiRes.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (_e) {
      return Response.json({
        error: 'Respuesta inválida del proveedor',
        detail: rawText.substring(0, 300)
      }, { status: 502 });
    }

    if (data.status !== 'success') {
      return Response.json({
        error: data.error || data.message || 'Error en la consulta',
        raw: data
      }, { status: 400 });
    }

    // Parsear el texto de resultado
    const text = data.result || '';
    const getField = (label) => {
      const m = text.match(new RegExp(label + '\\s*:\\s*([^\\n\\r]+)', 'i'));
      return m ? m[1].trim() : null;
    };

    const icloudLock = getField('iCloud Lock');
    const mdmLock = getField('MDM Lock');
    const model = getField('Model');
    const imeiNumber = getField('IMEI Number');
    const serialNumber = getField('Serial Number');
    const modelNumber = getField('Model Number');
    const coverageStatus = getField('Coverage Status');
    const purchaseDate = getField('Estimated Purchase Date');
    const simLock = getField('Sim-Lock');
    const replaced = getField('Replaced Device');
    const productVersion = getField('Product Version');

    // La primera línea suele ser "Description: ..."
    const descMatch = text.match(/^Description:\s*([^\n\r]+)/i);
    const description = descMatch ? descMatch[1].trim() : null;

    return Response.json({
      success: true,
      fmi_status: icloudLock ? (icloudLock.toUpperCase() === 'ON' ? 'on' : 'off') : null,
      fmi_label: icloudLock,
      mdm_status: mdmLock ? (mdmLock.toUpperCase() === 'ON' ? 'on' : 'off') : null,
      mdm_label: mdmLock,
      description,
      model,
      imei: imeiNumber,
      serial: serialNumber,
      model_number: modelNumber,
      coverage_status: coverageStatus,
      purchase_date: purchaseDate,
      sim_lock: simLock,
      replaced_device: replaced,
      product_version: productVersion,
      balance: data.balance,
      price: data.price,
      request_id: data.id,
      raw: text
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});