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
    const sorted = arr.slice().sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' })
    );
    // Un grupo con una sola variante se muestra como tarjeta simple
    if (sorted.length === 1) {
      items.push({ type: 'single', service: sorted[0], title: sorted[0].name || '' });
    } else {
      items.push({ type: 'group', group, services: sorted, title: group });
    }
  }
  for (const s of singles) {
    items.push({ type: 'single', service: s, title: s.name || '' });
  }

  items.sort((a, b) =>
    (a.title || '').localeCompare(b.title || '', 'es', { sensitivity: 'base' })
  );
  return items;
}