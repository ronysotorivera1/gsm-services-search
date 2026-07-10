import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base blanca */}
      <div className="absolute inset-0 bg-white" />

      {/* Cuadrícula técnica fina */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,100,220,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,100,220,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Cuadrícula técnica más marcada (cada 4 celdas) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,100,220,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,100,220,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Puntos en intersecciones */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,100,220,0.12) 1px, transparent 1px)`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Glow sutil azul top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          top: '-15vw',
          right: '-10vw',
          background: 'radial-gradient(circle, rgba(0,140,255,0.06) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Glow sutil celeste bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '40vw',
          height: '40vw',
          bottom: '-10vw',
          left: '-5vw',
          background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}