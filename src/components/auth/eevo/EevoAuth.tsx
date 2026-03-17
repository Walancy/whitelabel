import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Cpu,
  Globe,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const EevoAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white font-sans overflow-hidden">
      {/* Left Side - Tech Evolution */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#080808] relative p-16 justify-between border-r border-[#BDFE2B]/5">
        {/* Futuristic Lime Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#BDFE2B]/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-700">
           <div className="flex items-center gap-2 mb-20">
              <div className="w-10 h-10 border border-[#BDFE2B]/40 rounded-lg flex items-center justify-center">
                 <Cpu className="text-[#BDFE2B]" size={24} />
              </div>
              <span className="text-2xl font-black uppercase tracking-widest text-[#BDFE2B]">EEVO</span>
           </div>

           <h1 className="text-6xl font-black tracking-tight leading-[0.9] mb-8">
              DECODE <br />
              <span className="text-[#BDFE2B]">TOMORROW.</span>
           </h1>
           <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
             The evolution of professional interfaces. Built for the modern technical workforce.
           </p>

           <div className="mt-16 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-3 group hover:border-[#BDFE2B]/30 transition-all cursor-default">
                 <Globe size={18} className="text-[#BDFE2B]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Global Network</span>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-3 group hover:border-[#BDFE2B]/30 transition-all cursor-default">
                 <Monitor size={18} className="text-[#BDFE2B]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Multi-Node Dev</span>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-[#BDFE2B] animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">System Status: Evolutionary</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 bg-[#050505]">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-right duration-700">
           <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight">Initialize Session</h2>
              <div className="h-1 w-12 bg-[#BDFE2B]" />
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Terminal Entry</label>
                 <input 
                   type="email" 
                   placeholder="user@eevo.network"
                   className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 text-sm font-medium focus:border-[#BDFE2B] transition-all outline-none"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Encryption Key</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 pr-12 text-sm font-medium focus:border-[#BDFE2B] transition-all outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#BDFE2B] transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-[#BDFE2B] text-black rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#BDFE2B]/10 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-10"
              >
                Access Platform
                <ArrowRight size={20} />
              </button>
           </form>

           <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-center text-white/20">Third-party Authorization</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                  <Chrome size={18} className="text-white/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                  <Github size={18} className="text-white/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Github</span>
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
