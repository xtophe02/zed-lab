'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import ZedScene from '@/components/ZedScene';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    )
    .fromTo(
      titleRef.current,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 },
      '-=0.8'
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      '-=1'
    )
    .fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8 },
      '-=0.5'
    );
  }, []);

  return (
    <main ref={containerRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-zinc-700/50">
      {/* 3D Background */}
      <ZedScene />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Glassmorphism Badge */}
        <div
          ref={badgeRef}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500"></span>
          </span>
          System Protocol Active
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold tracking-tighter text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
        >
          ZED Lab
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 max-w-[600px] text-lg font-light tracking-wide text-zinc-400 md:text-xl"
        >
          Autonomous Research & Refined Intelligence
        </p>

        {/* Glassmorphism Button */}
        <div
          ref={buttonRef}
          className="mt-12"
        >
          <button className="group relative rounded-full border border-white/10 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            <span className="absolute inset-0 rounded-full bg-white blur-[20px] opacity-0 transition-opacity group-hover:opacity-20" />
            <span className="relative flex items-center gap-2">
              <Terminal size={16} />
              Initialize Interface
            </span>
          </button>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />
    </main>
  );
}
