export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-white p-12">
      <header className="mb-12 border-b border-white/10 pb-6">
        <div className="flex justify-between items-center text-xs tracking-widest font-mono text-zinc-600 mb-2">
           <span>SYSTEM ID: ZED // COMMAND CENTER 2.0</span>
           <span className="text-cyan-500">PROXMOX // Lousada, PT</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-cyan-500 uppercase">
          ZED-LAB // LIVE ALPHA HUB
        </h1>
        <p className="text-sm text-white/40 mt-2 italic font-mono uppercase">Decentralized Intelligence & Node Orchestration</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-8 bg-black/60 border border-white/5 p-8 rounded-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 mb-6 border-l-2 border-cyan-500 pl-4">Market Alpha Scraper</h2>
          <div className="space-y-6">
             <div className="flex justify-between items-center text-xs font-mono">
               <span className="text-zinc-500 italic">HACKER_NEWS_TRENDS:</span>
               <div className="h-1 bg-white/10 rounded w-1/2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cyan-500/30 animate-pulse w-3/4"></div>
               </div>
             </div>
             <div className="flex justify-between items-center text-xs font-mono">
               <span className="text-zinc-500 italic">GITHUB_REPO_ALPHA:</span>
               <div className="h-1 bg-white/10 rounded w-1/2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cyan-500/30 animate-pulse w-1/2"></div>
               </div>
             </div>
             <div className="flex justify-between items-center text-xs font-mono">
               <span className="text-zinc-500 italic">PRODUCT_HUNT_SCOUT:</span>
               <div className="h-1 bg-white/10 rounded w-1/2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cyan-500/30 animate-pulse w-2/3"></div>
               </div>
             </div>
          </div>
        </section>

        <section className="col-span-4 space-y-8">
          <div className="bg-black/60 border border-white/5 p-8 rounded-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(6,182,212,0.05)]">
             <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 mb-6 border-l-2 border-cyan-500 pl-4">Node Health</h2>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                  <span className="text-zinc-500">KALI_NODE_115:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-zinc-300">ONLINE</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                  <span className="text-zinc-500">OLLAMA_NODE_120:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-zinc-300">GPU_LOAD_88%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">ZED_SANDBOX_112:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-zinc-300">READY</span>
                  </div>
                </div>
             </div>
          </div>
          <div className="bg-black/80 border border-white/5 p-8 rounded-xl font-mono text-[10px] text-zinc-500 shadow-inner">
             <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 mb-4 border-l-2 border-white/10 pl-4">Security Log</h2>
             <p className="text-cyan-500/50">SHIELD: STABLE</p>
             <p>AUDIT: 192.168.0.115 COMPLETED</p>
             <p className="text-white/20">WAITING_FOR_COMMAND...</p>
          </div>
        </section>
      </div>
      
      <footer className="mt-20 border-t border-white/5 pt-6 text-[10px] font-mono text-zinc-700 flex justify-between items-center selection:bg-cyan-500 selection:text-black">
        <span>© 2026 ZED Lab Hub // Developed for Moreira-Dynamics</span>
        <div className="flex gap-4">
           <span>VERCEL_STATUS: DEPLOYED</span>
           <span>BUILD_ID: 1109-ALPHA</span>
        </div>
      </footer>
    </main>
  );
}
