import { useState } from 'react';
import { Eye, EyeOff, Github } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { useTheme } from '@/context/ThemeContext';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'h-11 w-full rounded-[var(--radius)] border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all';
const BTN_PRIMARY = 'h-11 w-full rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-semibold hover:brightness-105 active:scale-[0.99] transition-all';
const LABEL_CLASS = 'text-xs font-semibold text-foreground uppercase tracking-wider';
const LINK_CLASS = 'font-semibold text-foreground cursor-pointer hover:underline underline-offset-2';

export const EevoAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const isRight = authFormSide === 'right';
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className={`min-h-screen w-full flex bg-background text-foreground overflow-hidden ${!isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      <div className="hidden lg:flex relative bg-background p-4 lg:min-w-0 lg:w-[calc((100-var(--auth-form-width))*1%)]">
        <div className="flex-1 rounded-2xl overflow-hidden relative bg-muted dark:bg-[#070707]">
          <div className="absolute inset-0 z-0">
            <AuthBackground />
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background/90 via-background/40 to-background/20 dark:from-black/92 dark:via-black/35 dark:to-black/15 pointer-events-none" />
          <div className="absolute inset-0 z-[2] flex flex-col justify-between p-8 animate-in fade-in duration-700">
            <img src={logoSrc} alt="Logo" className="h-[22px] w-auto object-contain object-left" draggable={false} />
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-4xl font-semibold text-foreground dark:text-white leading-[1.15] tracking-tight">
                Crie algo<br />incrível hoje.
              </h1>
              <p className="text-sm text-muted-foreground dark:text-white/50 leading-relaxed max-w-[260px]">
                Transforme suas ideias em realidade com ferramentas poderosas e colaboração integrada.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-8 lg:p-14 animate-in fade-in duration-700 bg-background lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[340px] flex flex-col gap-7">

          {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
            <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
            <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Entrar</h2>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta! Insira seus dados abaixo.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLASS}>Endereço de e-mail</label>
                  <input
                    type="email" placeholder="voce@empresa.com"
                    value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className={LABEL_CLASS}>Senha</label>
                    <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      className={INPUT_CLASS + ' pr-11'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <CustomCheckbox
                  id="eevo-remember"
                  checked={remember}
                  onChange={setRemember}
                  label="Manter conectado"
                />

                <button type="submit" className={BTN_PRIMARY + ' mt-1'}>Entrar</button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 active:scale-[0.98] transition-all text-sm font-semibold">
                  <Github size={16} /> <span>GitHub</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-[var(--radius)] bg-card border border-border hover:bg-accent/20 active:scale-[0.98] transition-all text-sm font-semibold">
                  <GoogleIcon size={16} /> <span>Google</span>
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>Cadastre-se</button>
              </p>
            </>
          )}

          <p className="text-center text-[10px] text-muted-foreground">
            © 2026 Eevo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
