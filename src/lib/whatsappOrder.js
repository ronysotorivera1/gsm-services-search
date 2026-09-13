// Sin emojis: en algunos clientes de WhatsApp no se renderizan (aparecen caracteres �).
// Se usa el formato nativo de WhatsApp (*negrita*), que sí es universal.
const CATEGORY_LABELS = {
  renta: 'RENTA',
  activacion: 'ACTIVACIÓN',
  imei: 'IMEI',
  remoto: 'REMOTO',
  creditos: 'CRÉDITOS',
  streaming: 'STREAMING',
};

export function buildOrderMessage({ title, service, quantity = 1, priceUsd, soles }) {
  let msg = `Hola, quiero solicitar el servicio:\n*${title || service.name}*`;
  if (service.brand) msg += `\n\n*Marca:* ${service.brand}`;
  if (service.category) msg += `\n*Categoría:* ${CATEGORY_LABELS[service.category] || service.category}`;
  if (service.duration) msg += `\n*Duración:* ${service.duration}`;
  if (service.category === 'creditos' && service.credits_quantity) msg += `\n*Créditos:* ${quantity}`;
  if (service.delivery_time) msg += `\n*Entrega:* ${service.delivery_time}`;
  if (service.description) msg += `\n*Detalle:* ${service.description}`;
  msg += `\n\n*Monto:*\n$${priceUsd.toFixed(2)} USDT\nS/ ${soles} Soles`;
  return msg;
}