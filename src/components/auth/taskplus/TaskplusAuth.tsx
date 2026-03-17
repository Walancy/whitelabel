import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Zap,
  TrendingUp,
  Layout as LayoutIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const TaskplusAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Side - High Performance Focus */}
      <div className="hidden lg:flex flex-col w-[42%] bg-[#1A0A0A] relative p-16 justify-between border-r border-[#E11D48]/10">
        {/* Intense Red Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E11D48]/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
           <div className="flex items-center gap-2 mb-16">
              <div className="w-10 h-10 bg-[#E11D48] rounded-xl flex items-center justify-center shadow-lg shadow-[#E11D48]/30">
                 <Zap className="text-white fill-white" size={24} />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">TASKPLUS</span>
           </div>

           <h1 className="text-6xl font-black italic tracking-tighter leading-[0.9] text-white space-y-2">
              <span className="block">MOVE</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#FB7185]">FASTER.</span>
              <span className="block">WIN BIG.</span>
           </h1>
           <p className="mt-8 text-white/40 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
             The high-velocity task management platform built for modern teams.
           </p>

           <div className="mt-16 flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Team Performance Analytics</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Instant Workflow Automation</span>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
           <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <TrendingUp size={20} className="text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white">+85% Productivity Growth</p>
           </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-right duration-700">
           <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Get Access</h2>
              <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Accelerate your team's workflow today.</p>
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Terminal Email</label>
                 <input 
                   type="email" 
                   placeholder="operator@taskplus.io"
                   className="w-full h-12 bg-accent/20 border-2 border-border rounded-lg px-5 text-sm font-bold focus:border-primary transition-all outline-none"
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Access Key</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Secure identity..."
                      className="w-full h-12 bg-accent/20 border-2 border-border rounded-lg px-5 pr-12 text-sm font-bold focus:border-primary transition-all outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-primary text-black rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-10"
              >
                Launch Workspace
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border-2 border-border bg-card hover:border-primary/50 transition-all active:scale-[0.98]">
                <Chrome size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-lg border-2 border-border bg-card hover:border-primary/50 transition-all active:scale-[0.98]">
                <Github size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
