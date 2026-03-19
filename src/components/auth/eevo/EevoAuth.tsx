import { useState } from 'react';
import { Eye, EyeOff, Github } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';

export const EevoAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────────────────────────
          bg-background IS the "white border" — in light mode it's white, in
          dark mode it's the dark surface. The inner dark image gets rounded
          corners inside that padding, creating the immersion frame effect.   */}
      <div
        className="hidden lg:flex relative bg-background p-4 lg:min-w-0 lg:w-[calc((100-var(--auth-form-width))*1%)]"
      >
        {/* Inner dark image — rounded corners create the framed look */}
        <div className="flex-1 rounded-2xl overflow-hidden relative bg-[#070707]">

          {/* AuthBackground effect */}
          <div className="absolute inset-0 z-0">
            <AuthBackground />
          </div>

          {/* Layered depth overlay */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/92 via-black/35 to-black/15 pointer-events-none" />


          {/* Panel content */}
          <div className="absolute inset-0 z-[2] flex flex-col justify-between p-8 animate-in fade-in duration-700">
            {/* Logo */}
            <img
              src="/logo branca.svg"
              alt="Logo"
              className="h-[22px] w-auto object-contain object-left"
              draggable={false}
            />

            {/* Bottom headline */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-4xl font-semibold text-white leading-[1.15] tracking-tight">
                Build something<br />amazing today.
              </h1>
              <p className="text-sm text-white/50 leading-relaxed max-w-[260px]">
                Bring your ideas to life with powerful tools and seamless collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────────── */}
      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-8 lg:p-14 animate-in fade-in duration-700 bg-background lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[340px] flex flex-col gap-7">

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">Welcome back! Enter your details below.</p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); onLogin(); }}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="h-11 w-full rounded-[var(--radius)] border border-border bg-accent/20 px-4 text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-[var(--radius)] border border-border bg-accent/20 px-4 pr-11 text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Keep me logged in */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">Keep me logged in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="h-11 w-full rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-semibold hover:brightness-105 active:scale-[0.99] transition-all mt-1"
            >
              Sign in
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 active:scale-[0.98] transition-all text-sm font-semibold"
            >
              <Github size={16} />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 active:scale-[0.98] transition-all text-sm font-semibold"
            >
              <GoogleIcon size={16} />
              <span>Google</span>
            </button>
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <span className="font-semibold text-foreground cursor-pointer hover:underline underline-offset-2">
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};
