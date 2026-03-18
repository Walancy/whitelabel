import { useState } from 'react';
import {
  Github,
  Eye,
  EyeOff,
  Smile,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';

export const WorklyAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Side - Decorative */}
      <div
        className="hidden lg:flex flex-col lg:min-w-0 bg-background dark:bg-card relative p-12 justify-between lg:w-[calc((100-var(--auth-form-width))*1%)]"
      >
        <AuthBackground />

        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
          <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain mb-16" />

          <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
            Work together, <br /> better than ever.
          </h1>
          <p className="mt-6 text-muted-foreground text-base leading-relaxed max-w-sm">
            The most friendly workspace for your team to stay organized and inspired every single day.
          </p>

          <div className="mt-10 flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-md w-fit">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Smile className="text-primary" size={18} />
            </div>
            <p className="text-xs font-semibold text-foreground">Happy teams work here.</p>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
          <div className="h-0.5 w-10 bg-primary" />
          <span>Your daily companion</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-8 lg:p-16 lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[360px] space-y-8 animate-in fade-in slide-in-from-right duration-700">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome home</h2>
            <p className="text-muted-foreground text-sm">Let's set up your team's workspace.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-1.5">
              <label htmlFor="workly-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Team Email
              </label>
              <input
                id="workly-email"
                type="email"
                placeholder="hello@company.com"
                className="w-full h-11 bg-accent/20 border border-border rounded-[var(--radius)] px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="workly-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="workly-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Make it strong"
                  className="w-full h-11 bg-accent/20 border border-border rounded-[var(--radius)] px-4 pr-11 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="workly-btn-primary w-full h-11 rounded-[var(--radius)] font-semibold text-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              Start Working
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or join with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 transition-all active:scale-[0.98] text-sm font-semibold"
              aria-label="Continuar com Google"
            >
              <GoogleIcon size={18} />
              <span>Google</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 transition-all active:scale-[0.98] text-sm font-semibold"
              aria-label="Continuar com Github"
            >
              <Github size={18} />
              <span>Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
