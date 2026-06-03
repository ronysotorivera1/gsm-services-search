import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-[#f0f4ff]" />

      {/* Blob 1 - Cyan/Teal top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '70vw',
          height: '70vw',
          top: '-20vw',
          right: '-15vw',
          background: 'radial-gradient(circle, rgba(0,220,255,0.55) 0%, rgba(0,200,240,0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora1 12s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 2 - Magenta/Pink left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          bottom: '5vw',
          left: '-10vw',
          background: 'radial-gradient(circle, rgba(255,0,200,0.5) 0%, rgba(220,0,180,0.2) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora2 14s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 3 - Purple center */}
      <div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          top: '20vw',
          left: '25vw',
          background: 'radial-gradient(circle, rgba(140,80,255,0.35) 0%, rgba(100,60,220,0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora3 10s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 4 - Light blue bottom-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          bottom: '-10vw',
          right: '5vw',
          background: 'radial-gradient(circle, rgba(80,180,255,0.4) 0%, rgba(60,160,240,0.15) 50%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'aurora4 16s ease-in-out infinite alternate',
        }}
      />

      <style>{`
        @keyframes aurora1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-5vw, 8vw) scale(1.15); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(8vw, -6vw) scale(1.1); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-6vw, -8vw) scale(1.2); }
        }
        @keyframes aurora4 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-7vw, 5vw) scale(1.05); }
        }
      `}</style>
    </div>
  );
}