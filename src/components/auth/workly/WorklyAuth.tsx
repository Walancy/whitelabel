import { useState } from 'react';
import { 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  Smile,
  ArrowRight,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const WorklyAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-poppins overflow-hidden">
      {/* Left Side - Neon / glass */}
      <div className="hidden lg:flex flex-col w-[45%] bg-card relative p-16 justify-between">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
           <div className="flex items-center gap-2 mb-16">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                 <ClipboardCheck className="text-primary-foreground" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">Workly</span>
           </div>

           <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground underline decoration-primary/50 decoration-4 underline-offset-8">
              Work together, <br /> better than ever.
           </h1>
           <p className="mt-8 text-muted-foreground text-lg font-medium leading-relaxed max-w-sm">
             The most friendly workspace for your team to stay organized and inspired every single day.
           </p>

           <div className="mt-12 flex items-center gap-3 p-4 rounded-2xl bg-background/50 backdrop-blur-md w-fit">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                 <Smile className="text-primary" size={20} />
              </div>
              <p className="text-xs font-bold text-foreground mr-4">Happy teams work here.</p>
           </div>
        </div>

        <div className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
           <div className="h-0.5 w-12 bg-primary" />
           <span>Your daily companion</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-right duration-700">
           <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome home</h2>
              <p className="text-muted-foreground text-sm font-medium">Let's set up your team's beautiful workspace.</p>
           </div>

           <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Team Email</label>
                 <input 
                   type="email" 
                   placeholder="hello@company.com"
                   className="w-full h-12 bg-accent/20 rounded-xl px-5 text-sm font-medium focus:ring-1 focus:ring-primary transition-all outline-none"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Secure Password</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Make it strong"
                      className="w-full h-12 bg-accent/20 rounded-xl px-5 pr-12 text-sm font-medium focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit"
                className="workly-btn-primary w-full h-12 rounded-xl font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
              >
                Start Working
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>

           <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-muted-foreground/20" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Or join with</span>
              <div className="h-px flex-1 bg-muted-foreground/20" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-card hover:bg-accent transition-all active:scale-[0.98]">
                <Chrome size={18} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-card hover:bg-accent transition-all active:scale-[0.98]">
                <Github size={18} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Github</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
