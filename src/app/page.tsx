"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function DataGrid() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      <gridHelper args={[20, 20, 0x06b6d4, 0x06b6d4]} rotation={[Math.PI / 2, 0, 0]} opacity={0.15} transparent />
      <mesh>
        <torusGeometry args={[5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let i = 0;
    
    const startTyping = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        timeout = setTimeout(startTyping, 100);
      }
    };

    const initialTimeout = setTimeout(startTyping, delay * 1000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(initialTimeout);
    };
  }, [text, delay]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
}

export default function Home() {
  return (
    <main className="relative min-height-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <DataGrid />
        </Canvas>
      </div>

      {/* Scanline Overlay */}
      <div className="scanlines" />

      {/* Central Command Center */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-md p-1"
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="border-b border-zinc-800 px-4 py-2 flex justify-between items-center bg-black/50">
            <span className="text-[10px] font-bold text-cyan-500 tracking-widest">ZED_TERMINAL_V1.0</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
            </div>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tighter">
              <TypingText text="ZED LAB: ONLINE" />
            </h1>
            
            {/* Subtitle */}
            <p className="text-zinc-500 text-xs mb-8 tracking-widest uppercase">
              Autonomous Research Framework
            </p>

            {/* Interactive Section */}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5">
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-green" />
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">System Active</span>
              </div>

              <button className="group relative w-full py-3 px-6 bg-black border border-cyan-500/30 text-cyan-500 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:border-cyan-500 hover:text-white glow-hover">
                Connect to Node
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
                   <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
                   <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="px-4 py-2 bg-black/50 border-t border-zinc-800 flex justify-between items-center">
             <div className="h-[1px] w-12 bg-zinc-800" />
             <span className="text-[8px] text-zinc-600">LCOAL_HOST // 127.0.0.1</span>
             <div className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </div>
      </motion.div>

      {/* HUD Decorations */}
      <div className="absolute top-10 left-10 text-[10px] text-cyan-500/30 space-y-1 pointer-events-none">
        <p>LATENCY: 14MS</p>
        <p>BUFFER: STABLE</p>
        <p>DEEPSEEK_V2: ACTIVE</p>
      </div>
      
      <div className="absolute bottom-10 right-10 text-[10px] text-cyan-500/30 text-right pointer-events-none">
        <p>SECURE_LINK: ESTABLISHED</p>
        <p>ENCRYPTION: AES-256</p>
        <p>© 2026 ZED_LAB</p>
      </div>
    </main>
  );
}
