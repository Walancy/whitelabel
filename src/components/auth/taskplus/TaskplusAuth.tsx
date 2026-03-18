import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';

export const TaskplusAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden text-foreground">

      {/* Auth Background */}
      <AuthBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain mb-2" />

        {/* Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold leading-snug tracking-tight">
            Sign in to unlock the<br />full potential of Taskplus.
          </h1>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
              privacy policy
            </span>
            .
          </p>
        </div>

        {/* Social Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 bg-card border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-accent/20 active:scale-[0.98] transition-all"
            aria-label="Continuar com Apple"
          >
            <AppleIcon size={17} />
            Continue with Apple
          </button>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 bg-card border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-accent/20 active:scale-[0.98] transition-all"
            aria-label="Continuar com Google"
          >
            <GoogleIcon size={17} />
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email Form */}
        <form
          className="w-full flex flex-col gap-2.5"
          onSubmit={(e) => { e.preventDefault(); onLogin(); }}
        >
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="taskplus-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your mail"
              className="w-full h-11 bg-muted/50 border border-border rounded-[var(--radius)] pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              aria-label="Email"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground rounded-[var(--radius)] text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Continue with email
          </button>
        </form>

        {/* Footer */}
        <button
          type="button"
          onClick={onLogin}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
