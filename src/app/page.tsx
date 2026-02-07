import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-zinc-700/50">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-zinc-800/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-zinc-800/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Animated Badge/Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500"></span>
          </span>
          System Protocol Active
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold tracking-tighter text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
        >
          ZED Lab
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 max-w-[600px] text-lg font-light tracking-wide text-zinc-400 md:text-xl"
        >
          Autonomous Research & Refined Intelligence
        </motion.p>

        {/* Glowing Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12"
        >
          <button className="group relative rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95">
            <span className="absolute inset-0 rounded-full bg-white blur-[20px] opacity-0 transition-opacity group-hover:opacity-40" />
            <span className="relative flex items-center gap-2">
              <Terminal size={16} />
              Initialize Interface
            </span>
          </button>
        </motion.div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
    </main>
  );
}
