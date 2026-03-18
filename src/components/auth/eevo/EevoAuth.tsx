import { useState } from 'react';
import { Eye, EyeOff, Github } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useTheme } from '@/context/ThemeContext';

export const EevoAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { activeAccentColor } = useTheme();
  const accent = `hsl(${activeAccentColor})`;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#050505]">
      {/* Full-screen background effect */}
      <AuthBackground />
      <div className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" />

      {/* Layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* Left — headline */}
        <div className="flex-1 flex flex-col justify-between p-8 lg:p-14">
          <div /> {/* top spacer */}
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] uppercase max-w-lg tracking-tight">
            Convert your ideas<br />
            into successful<br />
            <span style={{ color: accent }}>business.</span>
          </h1>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hidden lg:block">
            EEVO — Next Generation Platform
          </div>
        </div>

        {/* Right — floating card */}
        <div className="flex items-center justify-center p-6 lg:py-8 lg:pr-12 w-full lg:w-auto">
          <div className="w-full max-w-[400px] bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
            {/* Logo */}
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `hsl(${activeAccentColor} / 0.2)` }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18 6.5V13.5L10 18L2 13.5V6.5L10 2Z" stroke={accent} strokeWidth="1.5" fill="none" />
                <path d="M10 6L14 8.25V12.75L10 15L6 12.75V8.25L10 6Z" fill={accent} />
              </svg>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white">Get Started</h2>
              <p className="text-white/40 text-xs">Welcome to Eevo — Let's get started</p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ds1s23@#f2ds"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 pr-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setRemember(!remember)}
                  className="w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0"
                  style={{ backgroundColor: remember ? accent : 'transparent', borderColor: remember ? accent : 'rgba(255,255,255,0.2)' }}
                >
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors select-none">Remember me</span>
              </label>

              <button
                type="submit"
                className="w-full h-11 rounded-lg font-bold text-sm text-black transition-all hover:brightness-110 active:scale-[0.99] mt-2"
                style={{ backgroundColor: accent }}
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                <GoogleIcon size={15} /><span className="text-[11px] font-semibold text-white/60">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]">
                <Github size={15} className="text-white/60" /><span className="text-[11px] font-semibold text-white/60">Github</span>
              </button>
            </div>

            <p className="text-xs text-white/30 text-center">
              Don't have an account?{' '}
              <span className="font-bold cursor-pointer hover:underline" style={{ color: accent }}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
