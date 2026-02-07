'use client';

import { useEffect, useRef, useState } from 'react';

export default function TalkInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const animationRef = useRef<number>(0);
  const orbRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  // Animate orb pulsing based on volume
  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.016);
      
      // Simulate volume changes when listening
      if (isListening) {
        setVolume(Math.random() * 0.8 + 0.2);
      } else {
        setVolume(Math.max(0, volume * 0.95)); // Decay when not listening
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, volume]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleToggleListening = () => {
    if (!isConnected) return;
    setIsListening(!isListening);
  };

  const orbScale = 1 + volume * 0.3 + Math.sin(time * 4) * 0.05;
  const orbGlow = 15 + volume * 25;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* CRT Effects */}
      <div className="scanlines" />
      
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent 70%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        {/* ZED_VOICE_LINK Title */}
        <div className="absolute top-16 text-center">
          <h1 
            className="text-5xl font-bold tracking-wider"
            style={{
              textShadow: `
                0 0 20px rgba(6, 182, 212, 0.8),
                0 0 40px rgba(6, 182, 212, 0.6),
                0 0 60px rgba(6, 182, 212, 0.4),
                ${Math.sin(time * 3) * 2}px 0 0 rgba(255, 0, 0, 0.3),
                ${Math.cos(time * 5) * 2}px 0 0 rgba(0, 255, 0, 0.3)
              `,
              color: '#06b6d4',
              transform: `scale(${1 + Math.sin(time * 2) * 0.02})`
            }}
          >
            ZED_VOICE_LINK
          </h1>
          <p className="text-lg text-cyan-400 opacity-70 tracking-widest mt-2">
            NEURAL INTERFACE PROTOCOL
          </p>
        </div>

        {/* Central Pulsing Orb */}
        <div 
          ref={orbRef}
          className="relative cursor-pointer transition-all duration-100"
          style={{
            width: '200px',
            height: '200px',
            transform: `scale(${orbScale})`,
          }}
          onClick={handleToggleListening}
        >
          {/* Orb SVG */}
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="absolute inset-0"
          >
            <defs>
              <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0891b2" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0e7490" stopOpacity="0.2" />
              </radialGradient>
              <filter id="orbGlow">
                <feGaussianBlur stdDeviation={orbGlow / 10} result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Outer ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#orbGradient)"
              strokeWidth="2"
              opacity={0.6 + volume * 0.4}
              style={{
                filter: `url(#orbGlow)`,
                strokeDasharray: '565.48',
                strokeDashoffset: `${565.48 * (1 - volume * 0.3)}`,
                transform: `rotate(${time * 50}deg)`,
                transformOrigin: 'center',
              }}
            />
            
            {/* Inner orb */}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="url(#orbGradient)"
              opacity={0.3 + volume * 0.5}
              style={{
                filter: `url(#orbGlow)`,
              }}
            />
            
            {/* Core */}
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="#06b6d4"
              opacity={0.8 + volume * 0.2}
              style={{
                filter: `url(#orbGlow)`,
              }}
            />
          </svg>

          {/* Volume indicator rings */}
          <div 
            className="absolute inset-0 border-2 border-cyan-400 rounded-full"
            style={{
              opacity: volume * 0.6,
              transform: `scale(${1 + volume * 0.5})`,
              transition: 'all 0.1s ease-out',
            }}
          />
          <div 
            className="absolute inset-0 border border-cyan-300 rounded-full"
            style={{
              opacity: volume * 0.4,
              transform: `scale(${1 + volume * 0.8})`,
              transition: 'all 0.1s ease-out',
            }}
          />
        </div>

        {/* Status Text */}
        <div className="mt-8 text-center">
          <p className="text-xl text-cyan-400 opacity-80">
            {isListening ? 'LISTENING...' : 'CLICK ORB TO ACTIVATE'}
          </p>
          {isListening && (
            <div className="mt-2 flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-cyan-400 rounded-full"
                  style={{
                    opacity: 0.3 + Math.random() * 0.7,
                    height: `${20 + Math.random() * 20}px`,
                    animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm glow">
          <div className="flex flex-col items-center space-y-4">
            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className={`px-6 py-3 rounded-lg font-bold tracking-wider transition-all duration-300 ${
                isConnected 
                  ? 'bg-red-900/50 text-red-400 border border-red-500/50 hover:bg-red-900/70' 
                  : 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/70 glow-hover'
              }`}
            >
              {isConnected ? 'DISCONNECT FROM VAPI' : 'CONNECT TO VAPI'}
            </button>

            {/* Status Indicator */}
            <div className="text-center">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 pulse-green' : 'bg-red-400'}`} />
                <span className="text-xs text-gray-400">STATUS</span>
              </div>
              <div className="text-xs text-cyan-300">
                MODEL: <span className="text-green-400">PersonaPlex-7B (Local)</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="fixed top-8 right-8 text-cyan-400 text-xs opacity-60">
          <div>NEURAL LINK: {isConnected ? 'ACTIVE' : 'STANDBY'}</div>
          <div>VOLUME: {(volume * 100).toFixed(0)}%</div>
          <div>PROTOCOL: VOICE_SYNTH_v2.1</div>
        </div>

        <div className="fixed bottom-8 left-8 text-cyan-400 text-xs opacity-60">
          <div>TERMINAL-FUTURISM FRAMEWORK</div>
          <div>ZED LAB © 2026</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}