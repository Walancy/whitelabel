import { useState, useEffect } from 'react';
import { Twitter } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';

const AUTOFILL_DELAY = 100_000_000;

export const ShopeersAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [allowAutocomplete, setAllowAutocomplete] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setAllowAutocomplete(true), AUTOFILL_DELAY * 1000);
    return () => clearTimeout(t);
  }, []);

  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row relative min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <AuthBackground />
        </div>

        {/* Painel esquerdo - Formulário */}
        <div
          className="w-full lg:min-w-0 min-h-[70vh] lg:min-h-screen bg-card/95 backdrop-blur-xl flex flex-col p-6 sm:p-8 lg:p-12 relative z-10 border-border/50 lg:w-[calc(var(--auth-form-width)*1%)]"
        >
          <div className="flex items-center gap-2 mb-12 lg:mb-16">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain" />
          </div>

          <div className="flex-1 flex flex-col justify-center w-full max-w-[340px] mx-auto">
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Login</h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px]">
                Enter your credentials to access your account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-1">
                <label htmlFor="shopeers-email" className="sr-only">Email</label>
                <input
                  id="shopeers-email" type="email" placeholder="Enter Email"
                  autoComplete={allowAutocomplete ? 'email' : 'off'}
                  className="w-full h-11 bg-muted/80 border border-transparent rounded-lg px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground text-foreground"
                  aria-label="Email"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="shopeers-password" className="sr-only">Senha</label>
                <input
                  id="shopeers-password" type="password" placeholder="Password"
                  autoComplete={allowAutocomplete ? 'current-password' : 'off'}
                  className="w-full h-11 bg-muted/80 border border-transparent rounded-lg px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground text-foreground"
                  aria-label="Senha"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-foreground text-background rounded-lg font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Login
              </button>
            </form>

            <div className="relative flex items-center py-6" aria-hidden>
              <div className="flex-grow border-t border-border" />
              <span className="mx-3 text-xs text-muted-foreground lowercase">or log in via</span>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Login com redes sociais">
              {[
                { icon: <GoogleIcon size={14} aria-hidden />, label: 'Google', ariaLabel: 'Entrar com Google' },
                { icon: <AppleIcon size={14} aria-hidden />, label: 'Apple', ariaLabel: 'Entrar com Apple' },
                { icon: <Twitter size={14} className="text-foreground/80" aria-hidden />, label: 'Twitter', ariaLabel: 'Entrar com Twitter' },
              ].map(({ icon, label, ariaLabel }) => (
                <button
                  key={label} type="button" aria-label={ariaLabel}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-muted/80 hover:bg-muted border border-transparent hover:border-border/50 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  {icon}
                  <span className="text-xs font-medium text-foreground/90">{label}</span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-primary font-semibold cursor-pointer hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Painel direito — sem imagem, apenas AuthBackground */}
        <div
          className="hidden lg:flex lg:w-[calc((100-var(--auth-form-width))*1%)] lg:min-w-0 relative z-10 overflow-hidden min-h-[30vh] lg:min-h-screen"
          aria-hidden
        >
          {/* fundo escuro neutro — efeito vem do AuthBackground global */}
        </div>
      </div>
    </div>
  );
};
