import { useState } from 'react';
import { Eye, EyeOff, Wallet, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';


type Tab = 'login' | 'signup';

const SOCIALS = [
  { id: 'google', Icon: GoogleIcon, label: 'Google' },
  { id: 'apple', Icon: AppleIcon, label: 'Apple' },
  { id: 'wallet', Icon: Wallet, label: 'Wallet' },
] as const;



export const MagikaAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { authFormWidth, theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Form Side */}
      <div
        className="flex flex-col items-center p-8 lg:p-14 shrink-0"
        style={{ width: `${authFormWidth}%`, minWidth: '320px' }}
      >
        {/* Logo */}
        <div className="mb-10 w-full max-w-[360px]">
          <img src={logoSrc} alt="Logo" className="h-7 w-auto object-contain" />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-[360px] space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">

            {/* Tabs */}
            <div className="flex gap-5">
              {(['login', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold pb-1 transition-colors capitalize',
                    tab === t
                      ? 'text-foreground border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Welcome!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Please enter your details to {tab === 'login' ? 'login' : 'create an account'}.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-1.5">
                <label htmlFor="magika-email" className="text-xs font-semibold">Email address</label>
                <input
                  id="magika-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-10 bg-background border border-border rounded-[--radius] px-4 text-sm focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="magika-password" className="text-xs font-semibold">Password</label>
                  {tab === 'login' && (
                    <button type="button" className="text-xs text-primary font-semibold hover:opacity-80 transition-opacity">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="magika-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full h-10 bg-background border border-border rounded-[--radius] px-4 pr-10 text-sm focus:border-primary outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-primary text-primary-foreground rounded-[--radius] text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-1"
              >
                {tab === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Social Buttons */}
            <div className="space-y-2.5">
              {SOCIALS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  className="w-full h-10 flex items-center justify-center gap-3 border border-border rounded-[--radius] text-sm font-semibold hover:bg-accent/10 active:scale-[0.98] transition-all"
                >
                  <Icon />
                  Continue with {label}
                </button>
              ))}
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              {tab === 'login' ? "Don't have an account yet? " : 'Already have an account? '}
              <button
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                className="text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                {tab === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Auth Background (reactive to LayoutSwitcher selection) */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <AuthBackground />
      </div>
    </div>
  );
};
