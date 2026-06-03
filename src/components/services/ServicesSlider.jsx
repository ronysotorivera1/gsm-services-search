import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ServicesSlider({ onSearchChange }) {
  const trackRef = useRef();

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-updated_date', 40),
    initialData: [],
  });

  const active = services.filter(s => s.status === 'active');
  // Deduplicate by name and duplicate for infinite loop effect
  const uniqueServices = Array.from(new Map(active.map(s => [s.name, s])).values());
  const items = [...uniqueServices, ...uniqueServices];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || active.length === 0) return;
    let pos = 0;
    let raf;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [uniqueServices.length]);

  if (uniqueServices.length === 0) return null;

  return (
    <div className="w-full overflow-hidden mt-5 select-none">
      <div ref={trackRef} className="flex gap-3 w-max" style={{ willChange: 'transform' }}>
        {items.map((service, i) => (
          <button
            key={`${service.id}-${i}`}
            onClick={() => onSearchChange(service.name)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/60 bg-white/70 hover:bg-white hover:border-primary/40 hover:text-primary transition-all text-sm font-medium text-slate-600 whitespace-nowrap shadow-sm backdrop-blur-sm"
          >
            {service.brand && (
              <span className="text-xs text-primary/70 font-semibold uppercase tracking-wide">{service.brand}</span>
            )}
            <span>{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}