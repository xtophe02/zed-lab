"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// --- SHADERS ---

const CRT_SHADER = `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    
    // Slight curvature
    vec2 centeredUv = uv * 2.0 - 1.0;
    float dist = length(centeredUv);
    uv += centeredUv * (dist * dist) * 0.02;

    // Scanlines
    float scanline = sin(uv.y * 800.0 + uTime * 5.0) * 0.04;
    vec4 color = texture2D(tDiffuse, uv);
    
    // Chromatic Aberration
    float r = texture2D(tDiffuse, uv + vec2(0.001, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(0.001, 0.0)).b;
    
    color = vec4(r, g, b, 1.0);
    color.rgb += scanline;
    
    // Grain
    color.rgb += (random(uv + uTime * 0.01) - 0.5) * 0.05;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, dist);
    color.rgb *= vignette;

    gl_FragColor = color;
  }
`;

// --- COMPONENTS ---

function NeuralNetwork() {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const [positions, step] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const stp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      stp[i * 3] = (Math.random() - 0.5) * 0.01;
      stp[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      stp[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, stp];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      // Constant motion
      posAttr.setX(i, x + step[i * 3]);
      posAttr.setY(i, y + step[i * 3 + 1]);
      posAttr.setZ(i, z + step[i * 3 + 2]);

      // Move toward cursor
      const targetX = mouse.current.x * 10;
      const targetY = mouse.current.y * 10;
      
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 5) {
        posAttr.setX(i, x + dx * 0.02);
        posAttr.setY(i, y + dy * 0.02);
      }

      // Bounds check
      if (Math.abs(posAttr.getX(i)) > 15) posAttr.setX(i, -posAttr.getX(i) * 0.9);
      if (Math.abs(posAttr.getY(i)) > 15) posAttr.setY(i, -posAttr.getY(i) * 0.9);
      if (Math.abs(posAttr.getZ(i)) > 15) posAttr.setZ(i, -posAttr.getZ(i) * 0.9);
    }
    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f3ff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

function SystemLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Array.from({ length: 8 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("").toUpperCase();
      const prefix = ["INF", "WRN", "SYS", "SEC", "NET"][Math.floor(Math.random() * 5)];
      setLogs(prev => [...prev.slice(-15), `[${prefix}] 0x${hex} :: STABLE`]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 font-mono text-[9px] text-cyan-500/60 overflow-hidden">
      {logs.map((log, i) => (
        <div key={i} className="whitespace-nowrap opacity-animation">
          {log}
        </div>
      ))}
    </div>
  );
}

function EncryptionMeter() {
  const [level, setLevel] = useState(85);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => {
        const next = prev + (Math.random() - 0.5) * 5;
        return Math.min(100, Math.max(80, next));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-tighter">
        <span>Encryption Level</span>
        <span className="animate-pulse">{level.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        <motion.div 
          animate={{ width: `${level}%` }}
          className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    setBooted(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden selection:bg-cyan-500/30">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={["#000"]} />
          <NeuralNetwork />
          <ambientLight intensity={0.5} />
        </Canvas>
      </div>

      {/* CRT Shader Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanlines-overlay" />

      {/* Bridge UI Layout */}
      <AnimatePresence>
        {booted && (
          <div className="relative z-10 grid grid-cols-12 h-screen p-6 gap-6">
            
            {/* LEFT SIDEBAR: System Status */}
            <motion.aside 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="col-span-3 flex flex-col gap-6"
            >
              <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <h2 className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase">System Logs</h2>
                </div>
                <SystemLogs />
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm">
                <EncryptionMeter />
              </div>

              <div className="mt-auto bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm">
                <div className="text-[9px] text-cyan-500/50 font-mono space-y-1">
                  <p>NODE_ID: ZL-4492-X</p>
                  <p>UPTIME: 429:11:04:22</p>
                  <p>CORE_TEMP: 32.4°C</p>
                </div>
              </div>
            </motion.aside>

            {/* MAIN CENTER: Command Console */}
            <motion.section 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="col-span-6 flex flex-col items-center justify-center relative"
            >
              <div className="relative group cursor-crosshair">
                <h1 className="text-8xl font-black tracking-tighter zed-glow">
                  ZED_LAB
                </h1>
                <div className="absolute -top-4 -right-4 text-[10px] text-cyan-500/40 font-mono rotate-90">
                  VER_2.0.4_BETA
                </div>
              </div>
              
              <div className="mt-12 w-full max-w-lg">
                <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/40 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.05)]">
                  <div className="flex items-center justify-between px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/40">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-400">INTERFACE_COMMAND</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full border border-cyan-500/40" />
                      <div className="w-2 h-2 rounded-full bg-cyan-500/40" />
                    </div>
                  </div>
                  <div className="p-8 text-center space-y-6">
                    <p className="text-cyan-100/70 text-sm font-light tracking-wide leading-relaxed">
                      DeepSeek-Coder-V2 neural engine synchronized. 
                      Awaiting high-level architectural directives.
                    </p>
                    <button className="w-full py-4 bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 font-bold text-xs uppercase tracking-[0.4em] transition-all hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      Initialize Override
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Crosshairs */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-500/20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-500/20" />
            </motion.section>

            {/* RIGHT SIDEBAR: Telemetry */}
            <motion.aside 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="col-span-3 flex flex-col gap-6"
            >
              <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Orbital Link</span>
                  <span className="text-[10px] text-green-500">ACTIVE</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-8 border border-cyan-500/10 ${i % 3 === 0 ? 'bg-cyan-500/20' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm relative overflow-hidden">
                <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-4">Spectral Analysis</div>
                <div className="h-full w-full flex items-end gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="flex-1 bg-cyan-500/30"
                    />
                  ))}
                </div>
              </div>
            </motion.aside>

          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&display=swap');

        :root {
          --cyan-500: #06b6d4;
        }

        body {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          background: black;
          cursor: crosshair;
        }

        .zed-glow {
          color: white;
          text-shadow: 
            0 0 10px rgba(0, 243, 255, 0.8),
            0 0 20px rgba(0, 243, 255, 0.4),
            0 0 40px rgba(0, 243, 255, 0.2);
          letter-spacing: -0.05em;
        }

        .scanlines-overlay {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
          ), linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.03),
            rgba(0, 255, 0, 0.01),
            rgba(0, 0, 255, 0.03)
          );
          background-size: 100% 3px, 3px 100%;
          z-index: 1000;
        }

        .scanlines-overlay::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .scanlines-overlay::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(18, 16, 16, 0.1);
          opacity: 0;
          z-index: 2;
          pointer-events: none;
          animation: flicker 0.12s infinite;
        }

        @keyframes flicker {
          0% { opacity: 0.27861; }
          5% { opacity: 0.34769; }
          10% { opacity: 0.23604; }
          15% { opacity: 0.90626; }
          20% { opacity: 0.18128; }
          25% { opacity: 0.83891; }
          30% { opacity: 0.65583; }
          35% { opacity: 0.57807; }
          40% { opacity: 0.26559; }
          45% { opacity: 0.84693; }
          50% { opacity: 0.96019; }
          55% { opacity: 0.08523; }
          60% { opacity: 0.71056; }
          65% { opacity: 0.37137; }
          70% { opacity: 0.3429; }
          75% { opacity: 0.04745; }
          80% { opacity: 0.74352; }
          85% { opacity: 0.23927; }
          90% { opacity: 0.35157; }
          95% { opacity: 0.49219; }
          100% { opacity: 0.11012; }
        }

        .opacity-animation {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0);
        }
        ::-webkit-scrollbar-thumb {
          background: #06b6d4;
        }
      `}</style>
    </main>
  );
}
