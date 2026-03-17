import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  ArrowRight,
  RefreshCcw,
  Cloud,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ReSyncAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#030708] text-[#D1FAFF] font-sans overflow-hidden">
      {/* Left Side - Synchronization Focus */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#050C0D] relative p-16 justify-between border-r border-[#00F5FF]/5">
        {/* Electric Cyan Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00F5FF]/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
           <div className="flex items-center gap-3 mb-20 animate-bounce-slow">
              <div className="w-10 h-10 bg-[#00F5FF]/20 border border-[#00F5FF]/40 rounded-full flex items-center justify-center shadow-lg shadow-[#00F5FF]/10">
                 <RefreshCcw className="text-[#00F5FF]" size={20} />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] text-white">RE<span className="text-[#00F5FF]">SYNC</span></span>
           </div>

           <h1 className="text-6xl font-black tracking-tight leading-[0.9] text-white mb-8">
              UNIFIED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-cyan-500">SYNC.</span>
           </h1>
           <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
             Experience the most advanced file synchronization ecosystem. Seamlessly integrated across all nodes.
           </p>

           <div className="mt-20 flex flex-col gap-6">
              <div className="flex items-center gap-4 group cursor-default">
                 <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00F5FF]/20 transition-all">
                    <Cloud size={18} className="text-[#00F5FF]" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Cloud Persistence</span>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                 <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00F5FF]/20 transition-all">
                    <Lock size={18} className="text-[#00F5FF]" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Zero-Knowledge Enc</span>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
           <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]" />
           <span>Channel Secured</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-right duration-700">
           <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Connect</h2>
              <div className="h-0.5 w-16 bg-[#00F5FF]/50" />
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-1">Terminal ID</label>
                 <input 
                   type="email" 
                   placeholder="sync-node@resync.hub"
                   className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 text-sm font-bold focus:border-[#00F5FF] transition-all outline-none text-[#D1FAFF]"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-1">Keyphrase</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 pr-12 text-sm font-bold focus:border-[#00F5FF] transition-all outline-none text-[#D1FAFF]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#00F5FF] transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-[#00F5FF] text-black rounded-lg font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,245,255,0.2)] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-10"
              >
                Sync Session
                <ArrowRight size={20} />
              </button>
           </form>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                <Chrome size={18} className="text-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                <Github size={18} className="text-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Github</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
