import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const hoverEl = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const SELECTOR = 'a, button, [role="button"], input, textarea, select, label[for], summary';

    const setHover = (el) => {
      if (el === hoverEl.current) return;
      hoverEl.current = el;
      if (el) ringRef.current?.classList.add('cursor-hover');
      else ringRef.current?.classList.remove('cursor-hover');
    };

    // Delegación global: captura elementos insertados dinámicamente y respeta
    // pointer-events:none en hijos (el target real es el botón/link).
    const onOver = (e) => {
      const el = e.target?.closest?.(SELECTOR);
      setHover(el || null);
    };
    const onOut = (e) => {
      if (!e.relatedTarget) setHover(null);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .custom-cursor-ring {
          position: fixed;
          top: -18px;
          left: -18px;
          width: 36px;
          height: 36px;
          border: 1.5px solid hsl(var(--primary) / 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s, border-color 0.2s, border-width 0.2s;
        }
        .custom-cursor-ring.cursor-hover {
          top: -26px;
          left: -26px;
          width: 52px;
          height: 52px;
          border-color: hsl(var(--accent) / 0.4);
          border-width: 2px;
        }

        @media (hover: none) {
          * { cursor: auto !important; }
          .custom-cursor-dot, .custom-cursor-ring { display: none; }
        }
      `}</style>
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}