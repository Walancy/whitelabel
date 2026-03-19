import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useTheme } from '@/context/ThemeContext';

export const ReSyncAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">

      {/* ── Left: Form panel ─────────────────────────────────────────────── */}
      <div className="w-full lg:min-w-0 flex flex-col justify-center p-10 lg:p-14 lg:w-[calc(var(--auth-form-width)*1%)]">

        <div className="w-full max-w-[360px] mx-auto flex flex-col">

          {/* Logo */}
          <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain object-left mb-10" draggable={false} />

          {/* Heading */}
          <div className="space-y-1 mb-7">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your workspace</p>
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2.5 rounded-[var(--radius)] border border-border hover:bg-accent/20 active:scale-[0.99] transition-all text-sm font-medium mb-5"
          >
            <GoogleIcon size={18} />
            <span>Login With Google</span>
          </button>

          {/* OR */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="h-10 w-full rounded-[var(--radius)] border border-border bg-accent/10 px-3.5 text-sm placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-10 w-full rounded-[var(--radius)] border border-border bg-accent/10 px-3.5 pr-10 text-sm placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                I Agree to{' '}
                <span className="text-foreground font-medium cursor-pointer hover:underline underline-offset-2">
                  Terms of Service &amp; Policies
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="h-11 w-full rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all mt-1"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <span className="font-semibold text-foreground cursor-pointer hover:underline underline-offset-2">
              Create an account
            </span>
          </p>

        </div>
      </div>

      {/* ── Right: Image panel wrapper ───────────────────────────────────────
          The wrapper has padding on 3 sides (top, right, bottom) but NOT left.
          bg-background on the wrapper = same color as form → creates the
          white "frame" gap around the dark image on those 3 sides.
          The wrapper itself provides the white space; the dark image inside
          has rounded corners EXCEPT at top-left and bottom-right.
          Two tiny bg-background squares with an inner border-radius are placed
          at those two corners to create the concave/inverted corner illusion.  */}
      <div className="hidden lg:flex flex-col relative lg:min-w-0 flex-1 p-4 pl-0">

        {/* Dark image panel — rounded everywhere EXCEPT TL and BR */}
        <div className="flex-1 rounded-2xl rounded-tl-none rounded-br-none overflow-hidden relative bg-[#111]">
          <AuthBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />

          {/* Bottom overlay text */}
          <div className="absolute bottom-0 left-0 right-0 z-[2] p-10">
            <h2 className="text-2xl font-semibold text-white leading-tight mb-2">
              Crafted For The<br />Ultimate Experience
            </h2>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed mb-5">
              Our tools are engineered with precision and premium materials,
              built to elevate every workflow.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-xs font-medium">Fully Customizable</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-xs font-medium">Built To Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SVG concave corners ───────────────────────────────────────────
            Each SVG is placed directly on top of the image panel's flat corner.
            The quarter-circle path (filled with bg-background) "masks" the
            image's square corner, creating the concave/inverted radius illusion. */}

        {/* Top-left concave — at the image panel's TL corner (top-4, left-0) */}
        <svg
          className="absolute top-4 left-0 z-[3] pointer-events-none"
          width="20" height="20" viewBox="0 0 20 20"
          style={{ fill: 'hsl(var(--background))' }}
        >
          {/* Arc from top-right to bottom-left — fills the corner with bg color */}
          <path d="M 20 0 A 20 20 0 0 0 0 20 L 0 0 Z" />
        </svg>

        {/* Bottom-right concave — at the image panel's BR corner (bottom-4, right-4) */}
        <svg
          className="absolute bottom-4 right-4 z-[3] pointer-events-none"
          width="20" height="20" viewBox="0 0 20 20"
          style={{ fill: 'hsl(var(--background))' }}
        >
          {/* Arc from bottom-left to top-right — fills the corner with bg color */}
          <path d="M 0 20 A 20 20 0 0 0 20 0 L 20 20 Z" />
        </svg>
      </div>

    </div>
  );
};
