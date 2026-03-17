import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  Sparkles,
  Zap,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MagikaAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Side - Creative Energy */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0D0B1A] relative p-16 justify-between overflow-hidden">
        {/* Magic Purple Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/20 blur-[130px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-700">
           <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-purple-400 rounded-2xl flex items-center justify-center rotate-12 shadow-xl shadow-primary/20">
                 <Wand2 className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white">MAGIKA</span>
           </div>

           <h1 className="text-6xl font-bold tracking-tight leading-[1] text-white italic drop-shadow-2xl">
              Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 underline decoration-primary/30 decoration-8 underline-offset-8">Idea</span> <br />
              into <span className="text-white/40 group-hover:text-white transition-colors duration-1000">Reality.</span>
           </h1>
           
           <div className="mt-16 space-y-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-default group">
                 <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition-colors">
                    <Zap size={20} className="text-primary group-hover:text-white transition-colors" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-white mb-1">Instant magic</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">No setup. No complexity. Just pure creativity flowing in seconds.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
           <Sparkles size={12} className="text-primary" />
           <span>Igniting Creativity 24/7</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 relative bg-[#0D0B1A]/30 lg:bg-transparent">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
           <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-4xl font-black tracking-tighter italic">Join Magika</h2>
              <p className="text-muted-foreground text-sm font-semibold max-w-xs mx-auto lg:mx-0">Unlock the most powerful creative suite for modern designers.</p>
           </div>

           <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                 <label className="text-[10px] font-black italic text-muted-foreground uppercase tracking-[0.2em] ml-2">Email Identity</label>
                 <input 
                   type="email" 
                   placeholder="you@creatives.com"
                   className="w-full h-12 bg-accent/20 border-2 border-border rounded-2xl px-5 text-sm font-bold focus:border-primary transition-all outline-none italic placeholder:font-normal placeholder:not-italic"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black italic text-muted-foreground uppercase tracking-[0.2em] ml-2">Secret Code</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Your secret key..."
                      className="w-full h-12 bg-accent/20 border-2 border-border rounded-2xl px-5 pr-12 text-sm font-bold focus:border-primary transition-all outline-none italic placeholder:font-normal placeholder:not-italic"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-primary to-purple-500 text-primary-foreground rounded-2xl font-black italic text-sm uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
              >
                Summon Account
                <Sparkles size={18} />
              </button>
           </form>

           <div className="relative flex items-center">
             <div className="flex-grow border-t border-border"></div>
             <span className="mx-4 text-[9px] font-black italic text-muted-foreground uppercase tracking-[0.4em]">Or flow with</span>
             <div className="flex-grow border-t border-border"></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-2xl border-2 border-border bg-card hover:bg-accent transition-all active:scale-[0.98] group">
                <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-2xl border-2 border-border bg-card hover:bg-accent transition-all active:scale-[0.98] group">
                <Github size={20} className="group-hover:-rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
