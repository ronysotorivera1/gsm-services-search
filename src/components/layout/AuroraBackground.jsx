import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base blanca */}
      <div className="absolute inset-0 bg-white" />

      {/* Grid técnico */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,120,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,120,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Puntos en intersecciones */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,120,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow sutil azul top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          top: '-15vw',
          right: '-10vw',
          background: 'radial-gradient(circle, rgba(0,140,255,0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Glow sutil celeste bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          bottom: '-10vw',
          left: '-5vw',
          background: 'radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}