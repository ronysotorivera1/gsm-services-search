// Convierte una lista de servicios en "items" agrupados por el campo `group`.
// Cada item es { type: 'single', service } o { type: 'group', group, services }.
// Los servicios sin grupo se devuelven como items individuales.
// El resultado se ordena alfabéticamente por el título visible del item.
export function clusterServices(services) {
  const groupsMap = new Map();
  const singles = [];

  for (const s of services || []) {
    const g = s.group && String(s.group).trim();
    if (g) {
      if (!groupsMap.has(g)) groupsMap.set(g, []);
      groupsMap.get(g).push(s);
    } else {
      singles.push(s);
    }
  }

  const items = [];
  for (const [group, arr] of groupsMap) {
    // Variantes ordenadas de mayor a menor precio
    const sorted = arr.slice().sort((a, b) => (b.price_usd || 0) - (a.price_usd || 0));
    // Los grupos (incluso con una sola variante) se muestran como tarjeta de grupo a ancho completo
    items.push({ type: 'group', group, services: sorted, title: group });
  }
  for (const s of singles) {
    items.push({ type: 'single', service: s, title: s.name || '' });
  }

  items.sort((a, b) =>
    (a.title || '').localeCompare(b.title || '', 'es', { sensitivity: 'base' })
  );
  return items;
}