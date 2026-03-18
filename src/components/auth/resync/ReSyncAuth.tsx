import { useState } from 'react';
import { Github, Eye, EyeOff, ArrowRight, RefreshCcw, Cloud, Lock } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useTheme } from '@/context/ThemeContext';

export const ReSyncAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { activeAccentColor } = useTheme();
  const accentHsl = `hsl(${activeAccentColor})`;

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col lg:min-w-0 bg-[#050C0D] relative p-16 justify-between lg:w-[calc((100-var(--auth-form-width))*1%)]">
        <AuthBackground />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/40 to-black/75 pointer-events-none" />

        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(${activeAccentColor} / 0.2)`, borderColor: `hsl(${activeAccentColor} / 0.4)`, borderWidth: 1 }}>
              <RefreshCcw style={{ color: accentHsl }} size={18} />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] text-white">
              RE<span style={{ color: accentHsl }}>SYNC</span>
            </span>
          </div>

          <h1 className="text-6xl font-black tracking-tight leading-[0.9] text-white mb-8">
            UNIFIED <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentHsl}, hsl(${activeAccentColor} / 0.6))` }}>SYNC.</span>
          </h1>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
            Experience the most advanced file synchronization ecosystem. Seamlessly integrated across all nodes.
          </p>

          <div className="mt-20 flex flex-col gap-6">
            {[{ icon: <Cloud size={16} style={{ color: accentHsl }} />, label: 'Cloud Persistence' },
              { icon: <Lock size={16} style={{ color: accentHsl }} />, label: 'Zero-Knowledge Enc' }].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-4 group cursor-default">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">{icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentHsl }} />
          <span>Channel Secured</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-8 lg:p-20 bg-background relative z-10 shadow-2xl lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-right duration-700">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Connect</h2>
            <div className="h-0.5 w-16 opacity-60" style={{ backgroundColor: accentHsl }} />
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Terminal ID</label>
              <input type="email" placeholder="sync-node@resync.hub" className="w-full h-11 bg-accent/20 border border-border rounded-lg px-5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Keyphrase</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full h-11 bg-accent/20 border border-border rounded-lg px-5 pr-12 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-black text-xs uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-6">
              Sync Session <ArrowRight size={18} />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 h-11 rounded-lg border border-border bg-card hover:bg-accent transition-all active:scale-[0.98]">
              <GoogleIcon size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 h-11 rounded-lg border border-border bg-card hover:bg-accent transition-all active:scale-[0.98]">
              <Github size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
