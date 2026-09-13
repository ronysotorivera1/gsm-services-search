// Emojis de un solo código, con presentación emoji nativa en WhatsApp
// (se evitan 🏷️, 🇵🇪 y similares que fallan en teléfonos antiguos o clientes de escritorio).
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
  if (service.brand) msg += `\n📱 Marca: ${service.brand}`;
  if (service.category) msg += `\n📂 Categoría: ${CATEGORY_LABELS[service.category] || service.category}`;
  if (service.duration) msg += `\n⏰ Duración: ${service.duration}`;
  if (service.category === 'creditos' && service.credits_quantity) msg += `\n🔢 Créditos: ${quantity}`;
  if (service.delivery_time) msg += `\n🚀 Entrega: ${service.delivery_time}`;
  if (service.description) msg += `\n📝 ${service.description}`;
  msg += `\n\n💵 $${priceUsd.toFixed(2)} USDT\n💰 S/ ${soles} Soles`;
  return msg;
}