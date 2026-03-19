import { useState } from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'w-full h-11 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-[var(--radius)] pl-4 pr-4 text-sm placeholder:text-foreground/40 text-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/40 outline-none transition-all';
const BTN_PRIMARY = 'w-full h-11 bg-primary text-primary-foreground rounded-[var(--radius)] text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all';
const LABEL_CLASS = 'text-xs font-semibold text-muted-foreground';
const LINK_CLASS = 'text-primary font-semibold hover:underline underline-offset-2 cursor-pointer';

export const TaskplusAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col justify-center relative overflow-hidden text-foreground",
      authFormSide === 'left' ? "items-start px-8 lg:px-32" : authFormSide === 'right' ? "items-end px-8 lg:px-32" : "items-center px-4"
    )}>
      <AuthBackground />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain mb-2" />

        {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
          <div className="w-full">
            <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          </div>
        ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
          <div className="w-full">
            <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold leading-snug tracking-tight">
                Entre para aproveitar todo o<br />potencial do Taskplus.
              </h1>
              <p className="text-xs text-muted-foreground">
                Ao continuar, você concorda com nossa{' '}
                <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                  política de privacidade
                </span>.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <button type="button" className="w-full h-11 flex items-center justify-center gap-3 bg-card border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-accent/20 active:scale-[0.98] transition-all" aria-label="Continuar com Apple">
                <AppleIcon size={17} /> Continuar com Apple
              </button>
              <button type="button" className="w-full h-11 flex items-center justify-center gap-3 bg-card border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-accent/20 active:scale-[0.98] transition-all" aria-label="Continuar com Google">
                <GoogleIcon size={17} /> Continuar com Google
              </button>
            </div>

            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form className="w-full flex flex-col gap-2.5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="relative">
                <input
                  id="taskplus-email" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="digite seu e-mail"
                  className={INPUT_CLASS + ' pl-9'}
                  aria-label="E-mail"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <button type="submit" className={BTN_PRIMARY}>
                Continuar com e-mail
              </button>
            </form>

            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Esqueceu a senha?
              </button>
              <p className="text-xs text-muted-foreground">
                Não tem uma conta?{' '}
                <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>Cadastre-se</button>
              </p>
            </div>
          </>
        )}

        <p className="text-[10px] text-muted-foreground">
          © 2026 Taskplus. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
