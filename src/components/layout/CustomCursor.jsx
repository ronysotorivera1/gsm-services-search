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
        .custom-cursor-ring {
          position: fixed;
          top: -14px;
          left: -14px;
          width: 28px;
          height: 28px;
          border: 1px solid hsl(var(--primary) / 0.25);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          transition: width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, border-color 0.25s ease;
        }
        .custom-cursor-ring.cursor-hover {
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          border-color: hsl(var(--primary) / 0.4);
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