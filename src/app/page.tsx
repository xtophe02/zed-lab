'use client';

import React from 'react';
import ZedScene from '@/components/ZedScene';

export default function Home() {
  return (
    <main className="relative bg-black text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Scene in background */}
      <div className="absolute inset-0 z-0">
        <ZedScene />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center px-4 pointer-events-none">
        <h1 className="text-white text-7xl md:text-9xl font-bold tracking-tighter uppercase mb-2">
          ZED LAB
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-medium tracking-[0.3em] uppercase">
          REFINED INTELLIGENCE
        </p>
      </div>

      {/* Minimalistic override for links/highlights */}
      <style jsx global>{`
        a {
          color: inherit;
          text-decoration: none;
        }
        ::selection {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </main>
  );
}
