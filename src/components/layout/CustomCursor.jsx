import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onEnterClickable = () => {
      ringRef.current?.classList.add('cursor-hover');
      dotRef.current?.classList.add('cursor-hover');
    };
    const onLeaveClickable = () => {
      ringRef.current?.classList.remove('cursor-hover');
      dotRef.current?.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', onEnterClickable);
        el.addEventListener('mouseleave', onLeaveClickable);
      });
    };
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }

        .custom-cursor-dot {
          position: fixed;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          background: hsl(var(--primary));
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          transition: width 0.15s, height 0.15s, top 0.15s, left 0.15s, background 0.15s;
        }
        .custom-cursor-dot.cursor-hover {
          top: -6px;
          left: -6px;
          width: 12px;
          height: 12px;
          background: hsl(var(--accent));
        }

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
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}