import { useState } from 'react';
import { Github, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { cn } from '@/lib/utils';
import { AuthBackground } from '@/components/ui/AuthBackground';

export const NexusAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Access your account', desc: 'Secure login' },
    { id: 2, title: 'Manage your workspace', desc: 'Organize files' },
    { id: 3, title: 'Collaborate with team', desc: 'Real-time sync' }
  ];

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Side - Info & Features (largura = 100% - authFormWidth) */}
      <div
        className="hidden lg:flex flex-col lg:min-w-0 bg-[#0A0A0A] relative p-12 justify-between lg:w-[calc((100-var(--auth-form-width))*1%)]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[130px] rounded-full pointer-events-none z-[1]" />
        <AuthBackground />
        {/* Overlay para garantir legibilidade do texto em qualquer tema */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20 animate-in fade-in slide-in-from-left duration-700">
             <img src="/logo branca.svg" alt="Nexus" className="h-8 w-auto" />
          </div>

          <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-white">
              Welcome Back <br /> to Nexus
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Log in securely to continue managing your workspace seamlessly.
            </p>
          </div>
        </div>

        {/* Feature Blocks (Instead of Stepper) */}
        <div className="relative z-10 flex flex-col gap-3 max-w-[280px]">
          {steps.map((step) => (
            <div 
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer group",
                currentStep === step.id 
                  ? "bg-white border-white shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-[1.02]" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  currentStep === step.id ? "bg-black text-white" : "bg-white/20 text-white"
                )}>
                  {step.id}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className={cn(
                     "text-[12px] font-semibold truncate transition-colors",
                     currentStep === step.id ? "text-black" : "text-white"
                   )}>{step.title}</p>
                   <p className={cn(
                     "text-[10px] truncate transition-colors mt-0.5",
                     currentStep === step.id ? "text-black/60" : "text-muted-foreground"
                   )}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-primary" />
          <span>Next Generation Enterprise</span>
        </div>
      </div>

      {/* Right Side - Form (largura ajustável pelo menu) */}
      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-6 lg:p-12 animate-in fade-in duration-1000 bg-background relative z-10 shadow-2xl lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[360px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">Log In</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter your credentials to access your account.</p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-card border border-border hover:bg-accent transition-all active:scale-[0.98]">
              <GoogleIcon size={18} />
              <span className="text-xs font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-card border border-border hover:bg-accent transition-all active:scale-[0.98]">
              <Github size={18} />
              <span className="text-xs font-semibold">Github</span>
            </button>
          </div>

          <div className="relative flex items-center gap-2 justify-center py-2">
            <div className="h-px flex-1 bg-border" />
             <span className="text-[10px] uppercase font-bold text-muted-foreground bg-background px-2">Or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form Fields: Login */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" 
                placeholder="eg. user@company.com"
                className="w-full h-11 bg-accent/20 border border-border rounded-lg px-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <span className="text-[10px] font-semibold text-primary cursor-pointer hover:underline">Forgot?</span>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className="w-full h-11 bg-accent/20 border border-border rounded-lg px-4 pr-12 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-bold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              Log In
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};
