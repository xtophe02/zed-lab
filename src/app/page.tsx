'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface GPUMetrics {
  gpuLoad: number;
  vramUsed: number;
  vramTotal: number;
  temperature: number;
  powerDraw: number;
}

export default function ZEDLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<GPUMetrics>({
    gpuLoad: 0,
    vramUsed: 0,
    vramTotal: 12288, // RTX 3060 12GB
    temperature: 0,
    powerDraw: 0
  });
  const [time, setTime] = useState(0);

  // Neural Pulse Particle System
  const initNeuralPulse = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      hue: number;
      pulsePhase: number;
    }> = [];

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        life: 1,
        maxLife: Math.random() * 60 + 60,
        hue: Math.random() * 60 + 160, // Cyan to blue range
        pulsePhase: Math.random() * Math.PI * 2
      };
    };

    // Create initial particle field
    for (let i = 0; i < 150; i++) {
      particles.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Neural pulse waves
      const pulseX = canvas.width / 2 + Math.sin(Date.now() * 0.0005) * 200;
      const pulseY = canvas.height / 2 + Math.cos(Date.now() * 0.0003) * 150;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Neural pulse attraction
        const dx = pulseX - p.x;
        const dy = pulseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 50) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Update life
        p.life = Math.max(0, p.life - 1 / p.maxLife);

        // Pulse effect
        const pulse = Math.sin(Date.now() * 0.003 + p.pulsePhase) * 0.5 + 0.5;
        const size = p.size * (1 + pulse * 0.5) * p.life;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.life})`);
        gradient.addColorStop(0.3, `hsla(${p.hue}, 100%, 50%, ${p.life * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 30%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (p.life <= 0 || dist > canvas.width) {
          particles.splice(i, 1);
        }
      }

      // Add new particles at pulse location
      if (particles.length < 200) {
        for (let i = 0; i < 3; i++) {
          particles.push(createParticle(
            pulseX + (Math.random() - 0.5) * 100,
            pulseY + (Math.random() - 0.5) * 100
          ));
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Simulate GPU metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        gpuLoad: Math.min(100, Math.max(0, prev.gpuLoad + (Math.random() - 0.5) * 10)),
        vramUsed: Math.min(prev.vramTotal, Math.max(2000, prev.vramUsed + (Math.random() - 0.5) * 500)),
        temperature: Math.min(85, Math.max(30, prev.temperature + (Math.random() - 0.5) * 3)),
        powerDraw: Math.min(200, Math.max(50, prev.powerDraw + (Math.random() - 0.5) * 15))
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Time animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Initialize effects
  useEffect(() => {
    initNeuralPulse();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initNeuralPulse]);

  const vramPercentage = (metrics.vramUsed / metrics.vramTotal) * 100;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Neural Pulse Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Enhanced CRT Shader Container */}
      <div 
        ref={crtRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          animation: 'phosphor-jitter 0.1s infinite'
        }}
      >
        {/* Chromatic Aberration Layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.03),
                rgba(255, 0, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(0, 255, 0, 0.03),
                rgba(0, 255, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
              ),
              repeating-linear-gradient(
                45deg,
                rgba(0, 0, 255, 0.03),
                rgba(0, 0, 255, 0.03) 1px,
                transparent 1px,
                transparent 2px
              )
            `,
            transform: `translateX(${Math.sin(time * 10) * 0.5}px) translateY(${Math.cos(time * 15) * 0.3}px)`,
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Scanlines */}
        <div className="scanlines" />
        
        {/* Phosphor Glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${50 + Math.sin(time * 2) * 20}% ${50 + Math.cos(time * 3) * 20}%, rgba(6, 182, 212, 0.1), transparent 50%)`,
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        {/* ZED LAB Title */}
        <div className="mb-16 text-center">
          <h1 
            className="text-6xl font-bold mb-4 tracking-wider glow"
            style={{
              textShadow: `
                0 0 10px rgba(6, 182, 212, 0.8),
                0 0 20px rgba(6, 182, 212, 0.6),
                0 0 30px rgba(6, 182, 212, 0.4),
                ${Math.sin(time * 5) * 2}px 0 0 rgba(255, 0, 0, 0.3),
                ${Math.cos(time * 7) * 2}px 0 0 rgba(0, 255, 0, 0.3)
              `,
              transform: `scale(${1 + Math.sin(time * 3) * 0.02})`
            }}
          >
            ZED LAB
          </h1>
          <p className="text-xl text-cyan-400 opacity-80 tracking-widest">
            TERMINAL-FUTURISM RESEARCH FRAMEWORK
          </p>
        </div>

        {/* Active Intelligence HUD */}
        <div className="fixed top-8 right-8 bg-black/80 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm glow">
          <div className="text-cyan-400 text-sm font-bold mb-4 tracking-wider flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse-green"></span>
            ACTIVE INTELLIGENCE
          </div>
          
          <div className="space-y-3 text-xs">
            {/* GPU Load */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">GPU LOAD</span>
              <span className="text-cyan-300 font-bold">{metrics.gpuLoad.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                style={{ width: `${metrics.gpuLoad}%` }}
              />
            </div>

            {/* VRAM Usage */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400">VRAM</span>
              <span className="text-cyan-300 font-bold">
                {(metrics.vramUsed / 1024).toFixed(1)}GB / {(metrics.vramTotal / 1024).toFixed(0)}GB
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-100"
                style={{ width: `${vramPercentage}%` }}
              />
            </div>

            {/* Temperature */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400">TEMP</span>
              <span className={`font-bold ${metrics.temperature > 70 ? 'text-red-400' : 'text-cyan-300'}`}>
                {metrics.temperature.toFixed(0)}°C
              </span>
            </div>

            {/* Power Draw */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">POWER</span>
              <span className="text-cyan-300 font-bold">{metrics.powerDraw.toFixed(0)}W</span>
            </div>

            {/* RTX 3060 Badge */}
            <div className="mt-4 pt-3 border-t border-cyan-500/20">
              <div className="text-center">
                <span className="text-green-400 text-xs font-bold">RTX 3060</span>
                <span className="text-gray-500 text-xs ml-1">12GB GDDR6</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="fixed bottom-8 left-8 text-cyan-400 text-xs opacity-60">
          <div>NEURAL LINK: ESTABLISHED</div>
          <div>QUANTUM COHERENCE: {(95 + Math.sin(time) * 5).toFixed(1)}%</div>
          <div>TIME DILATION: {(1 + Math.cos(time * 0.5) * 0.1).toFixed(3)}x</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes phosphor-jitter {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0.2px, -0.1px); }
          50% { transform: translate(-0.1px, 0.2px); }
          75% { transform: translate(0.1px, 0.1px); }
        }
      `}</style>
    </div>
  );
}