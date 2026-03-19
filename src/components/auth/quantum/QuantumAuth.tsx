import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useTheme } from '@/context/ThemeContext';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'h-11 w-full rounded-[var(--radius)] border border-border bg-muted/50 px-4 text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all';
const LABEL_CLASS = 'text-sm font-medium';
const LINK_CLASS = 'font-semibold cursor-pointer hover:underline underline-offset-2';

export const QuantumAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { activeAccentColor, theme, authFormSide } = useTheme();
  const accent = `hsl(${activeAccentColor})`;
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  const flow = useAuthFlow();
  const isRight = authFormSide === 'right';

  const BTN_PRIMARY = `h-11 w-full rounded-[var(--radius)] font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all mt-1`;

  return (
    <div className={`min-h-screen w-full flex items-stretch bg-black p-3 gap-3 font-sans ${!isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      <div className="hidden lg:flex flex-col relative rounded-2xl overflow-hidden lg:min-w-0 lg:w-[calc((100-var(--auth-form-width))*1%)] bg-[#0d0d0d]">
        <AuthBackground />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 50% at 42% 52%, ${accent}28 0%, transparent 68%), radial-gradient(ellipse 40% 35% at 20% 80%, ${accent}12 0%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
      </div>

      <div className="w-full lg:min-w-0 flex flex-col bg-background rounded-2xl overflow-hidden lg:w-[calc(var(--auth-form-width)*1%)] animate-in fade-in duration-700 text-foreground">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border/50">
          <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain" draggable={false} />
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button type="button" onClick={flow.goToCadastro} className="font-semibold cursor-pointer hover:underline underline-offset-2" style={{ color: accent }}>
              Cadastre-se
            </button>
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-[380px] flex flex-col gap-6">

            {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
              <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY + ' bg-primary text-primary-foreground'} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
              <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY + ' bg-primary text-primary-foreground'} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : (
              <>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo ao Quantum!</h2>
                  <p className="text-sm text-muted-foreground">Insira seus dados para entrar na sua conta</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button type="button" className="w-full h-11 flex items-center justify-center gap-2.5 rounded-[var(--radius)] border border-border bg-background hover:bg-accent/20 active:scale-[0.99] transition-all text-sm font-medium">
                    <GoogleIcon size={18} /> <span>Continuar com Google</span>
                  </button>
                  <button type="button" className="w-full h-11 flex items-center justify-center gap-2.5 rounded-[var(--radius)] border border-border bg-background hover:bg-accent/20 active:scale-[0.99] transition-all text-sm font-medium">
                    <img src="/icons8-apple-logo.svg" alt="Apple" className="w-[18px] h-[18px] dark:invert" />
                    <span>Continuar com Apple</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">Ou entre com</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>E-mail</label>
                    <input
                      type="email" placeholder="joao@email.com"
                      value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Senha</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="mínimo 8 caracteres" className={INPUT_CLASS + ' pr-11'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={BTN_PRIMARY} style={{ background: accent, color: 'hsl(var(--primary-foreground))' }}>
                    Entrar <ArrowRight size={16} />
                  </button>
                </form>

                <button type="button" onClick={flow.goToRecuperarSenha} className="text-center text-sm font-semibold cursor-pointer hover:opacity-70 transition-opacity underline underline-offset-2 text-foreground">
                  Esqueceu a senha?
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 py-4 border-t border-border/50 text-xs text-muted-foreground">
          <span>© 2026 Quantum</span>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-foreground transition-colors">Política de Privacidade</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Suporte</span>
          </div>
        </div>
      </div>
    </div>
  );
};
