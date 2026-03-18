import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon, FacebookIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ProjectliAuth = ({ onLogin }: { onLogin: () => void }) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const emailValid = email.length > 0 && EMAIL_REGEX.test(email);
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      {/* Left Panel - Form (largura pelo Visual Layout) */}
      <div className="w-full lg:w-[calc(var(--auth-form-width)*1%)] lg:min-w-0 flex flex-col min-h-screen bg-card text-foreground shrink-0">
        <div className="p-8 lg:p-12 shrink-0">
          <img
            src={logoSrc}
            alt="Projectli"
            className="h-7 w-auto object-contain"
          />
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 pb-12"
          style={{ maxWidth: '100%' }}
        >
          <div
            className="w-full space-y-6 animate-in fade-in duration-500"
            style={{ maxWidth: 'min(100%, 22rem)' }}
          >
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Welcome Back, Please enter your details.</p>
            </div>

            <div className="flex rounded-[var(--radius)] bg-muted/50 p-1 gap-0">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-all',
                  mode === 'signin'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ borderRadius: 'var(--radius)' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-all',
                  mode === 'signup'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ borderRadius: 'var(--radius)' }}
              >
                Signup
              </button>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="projectli-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="projectli-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 pl-10 pr-10 bg-transparent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                  {emailValid && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="size-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all"
                style={{ borderRadius: 'var(--radius)' }}
              >
                Continue
              </button>
            </form>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Or Continue With</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="h-11 border border-border bg-card rounded-[var(--radius)] flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                aria-label="Continuar com Google"
              >
                <GoogleIcon size={20} />
                <span className="hidden sm:inline">Google</span>
              </button>
              <button
                type="button"
                className="h-11 border border-border bg-card rounded-[var(--radius)] flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                aria-label="Continuar com Apple"
              >
                <AppleIcon size={20} />
                <span className="hidden sm:inline">Apple</span>
              </button>
              <button
                type="button"
                className="h-11 border border-[#1877F2] bg-[#1877F2] rounded-[var(--radius)] flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm font-medium text-white"
                aria-label="Continuar com Facebook"
              >
                <FacebookIcon size={18} />
                <span className="hidden sm:inline">Facebook</span>
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-4 text-center lg:text-left">
              Join the millions of smart teams who trust us to manage their projects. Log in to access your dashboard, track progress, and make better decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col lg:w-[calc((100-var(--auth-form-width))*1%)] lg:min-w-0 relative overflow-hidden min-h-[30vh] lg:min-h-screen">
        <div className="absolute inset-0 bg-[#0d0f14]" />
        <AuthBackground />
      </div>
    </div>
  );
};
