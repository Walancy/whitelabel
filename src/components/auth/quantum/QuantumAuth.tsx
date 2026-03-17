import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuantumAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#0A0C14] text-[#E0E7FF] font-sans overflow-hidden">
      {/* Left Side - Precision Focus */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0D101A] relative p-16 justify-between border-r border-[#6366F1]/10">
        {/* Precision Indigo Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
           <div className="flex items-center gap-3 mb-20">
              <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                 <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-[0.3em] text-white">QUANTUM</span>
           </div>

           <h1 className="text-5xl font-black tracking-tight leading-[1.1] text-white mb-6 uppercase">
              Precision <br />
              Building <br />
              <span className="text-[#6366F1]">Redefined.</span>
           </h1>
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest max-w-xs leading-loose">
             Modular architecture for the next generation of digital infrastructure.
           </p>

           <div className="mt-20 space-y-4">
              <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-default">
                 <Layers size={18} className="text-[#6366F1]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Multi-Layer Security</span>
              </div>
              <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-default">
                 <Database size={18} className="text-[#6366F1]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Quantum Data Storage</span>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
           <span>Version 2.4.0-Q</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-right duration-700">
           <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">Initialize Auth</h2>
              <p className="text-[#6366F1] text-[10px] font-bold uppercase tracking-widest">Encrypted session required</p>
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-1">Quantum Address</label>
                 <input 
                   type="email" 
                   placeholder="operator@quantum.sys"
                   className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 text-sm font-bold focus:border-[#6366F1] transition-all outline-none"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-1">Access Protocol</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-5 pr-12 text-sm font-bold focus:border-[#6366F1] transition-all outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#6366F1] transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-[#6366F1] text-white rounded-lg font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-[#6366F1]/10 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-10"
              >
                Launch Protocol
                <ArrowRight size={20} />
              </button>
           </form>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-card hover:bg-[#6366F1]/10 transition-all active:scale-[0.98]">
                <Chrome size={18} className="text-white/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-card hover:bg-[#6366F1]/10 transition-all active:scale-[0.98]">
                <Github size={18} className="text-white/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Github</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
