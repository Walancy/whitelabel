import { useState } from 'react';
import { Github, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { useTheme } from '@/context/ThemeContext';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'w-full h-11 bg-muted/50 border border-border rounded-[var(--radius)] px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none';
const BTN_PRIMARY = 'w-full h-11 rounded-[var(--radius)] font-semibold text-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 workly-btn-primary !text-black dark:!text-white';
const LABEL_CLASS = 'text-xs font-semibold text-foreground uppercase tracking-widest';
const LINK_CLASS = 'text-primary font-semibold hover:underline underline-offset-2 cursor-pointer';

export const WorklyAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const isRight = authFormSide === 'right';
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className={`min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden ${!isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      <div className="hidden lg:flex flex-col lg:min-w-0 bg-muted dark:bg-[#050505] relative p-12 justify-between lg:w-[calc((100-var(--auth-form-width))*1%)]">
        <AuthBackground />
        <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
          <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain mb-16" />
          <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-foreground dark:text-white">
            Trabalhando juntos, <br /> melhor do que nunca.
          </h1>
          <p className="mt-6 text-muted-foreground dark:text-white/50 text-base leading-relaxed max-w-sm">
            O workspace mais amigável para seu time se manter organizado e inspirado todos os dias.
          </p>

        </div>
      </div>

      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-8 lg:p-16 lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[360px] space-y-6 animate-in fade-in slide-in-from-right duration-700">

          {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
            <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
            <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Bem-vindo de volta</h2>
                <p className="text-muted-foreground text-sm">Vamos configurar o workspace do seu time.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div className="space-y-1.5">
                  <label htmlFor="workly-email" className={LABEL_CLASS}>E-mail do time</label>
                  <input
                    id="workly-email" type="email" placeholder="ola@empresa.com"
                    value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="workly-password" className={LABEL_CLASS}>Senha</label>
                    <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-primary font-semibold hover:underline underline-offset-2">
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="workly-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Use uma senha forte"
                      className={INPUT_CLASS + ' pr-11'}
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

                <button type="submit" className={BTN_PRIMARY + ' mt-2'}>
                  Começar a trabalhar
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">Ou entre com</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 transition-all active:scale-[0.98] text-sm font-semibold" aria-label="Continuar com Google">
                  <GoogleIcon size={18} /> <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 transition-all active:scale-[0.98] text-sm font-semibold" aria-label="Continuar com Github">
                  <Github size={18} /> <span>Github</span>
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>Cadastre-se</button>
              </p>

              <p className="text-center text-[10px] text-muted-foreground">
                © 2026 Workly. Todos os direitos reservados.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
