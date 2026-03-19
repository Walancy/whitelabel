import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { useTheme } from '@/context/ThemeContext';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'h-10 w-full rounded-[var(--radius)] border border-border bg-muted/50 px-3.5 text-sm placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all';
const BTN_PRIMARY = 'h-11 w-full rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all';
const LABEL_CLASS = 'text-sm text-muted-foreground';
const LINK_CLASS = 'font-semibold text-foreground cursor-pointer hover:underline underline-offset-2';

export const ReSyncAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  const isRight = authFormSide === 'right';

  return (
    <div className={`min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      <div className="w-full lg:min-w-0 flex flex-col justify-center p-10 lg:p-14 lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[360px] mx-auto flex flex-col">
          <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain object-left mb-10" draggable={false} />

          {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
            <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
            <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : (
            <>
              <div className="space-y-1 mb-7">
                <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
                <p className="text-sm text-muted-foreground">Entre para acessar seu workspace</p>
              </div>

              <button type="button" className="w-full h-11 flex items-center justify-center gap-2.5 rounded-[var(--radius)] border border-border hover:bg-accent/20 active:scale-[0.99] transition-all text-sm font-medium mb-5">
                <GoogleIcon size={18} /> <span>Entrar com Google</span>
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OU</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLASS}>E-mail</label>
                  <input
                    type="email" placeholder="voce@exemplo.com"
                    value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className={LABEL_CLASS}>Senha</label>
                    <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-primary font-semibold hover:underline underline-offset-2">
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      className={INPUT_CLASS + ' pr-10'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <CustomCheckbox
                  id="resync-terms"
                  checked={remember}
                  onChange={setRemember}
                  label={
                    <span>
                      Concordo com os{' '}
                      <span className="text-foreground font-medium cursor-pointer hover:underline underline-offset-2">
                        Termos de Serviço e Políticas
                      </span>
                    </span>
                  }
                />

                <button type="submit" className={BTN_PRIMARY + ' mt-1'}>
                  Entrar <ArrowRight size={16} />
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Não tem uma conta?{' '}
                <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>Cadastre-se</button>
              </p>
            </>
          )}

          <p className="text-center text-[10px] text-muted-foreground mt-6">
            © 2026 ReSync. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col relative lg:min-w-0 flex-1 p-4 lg:py-4 lg:px-4">
        <div className="flex-1 rounded-2xl rounded-tl-none rounded-br-none overflow-hidden relative bg-muted dark:bg-[#111]">
          <AuthBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent dark:from-black/80 dark:via-black/30 dark:to-transparent pointer-events-none z-[1]" />
          <div className="absolute bottom-0 left-0 right-0 z-[2] p-10">
            <h2 className="text-2xl font-semibold text-foreground dark:text-white leading-tight mb-2">
              Feito Para a<br />Experiência Definitiva
            </h2>
            <p className="text-sm text-muted-foreground dark:text-white/50 max-w-xs leading-relaxed mb-5">
              Nossas ferramentas são construídas com precisão e materiais premium, projetadas para elevar cada fluxo de trabalho.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-foreground/70 dark:text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium">Totalmente Personalizável</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground/70 dark:text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium">Feito Sob Medida</span>
              </div>
            </div>
          </div>
        </div>

        <svg className="absolute top-4 left-0 z-[3] pointer-events-none" width="20" height="20" viewBox="0 0 20 20" style={{ fill: 'hsl(var(--background))' }}>
          <path d="M 20 0 A 20 20 0 0 0 0 20 L 0 0 Z" />
        </svg>
        <svg className="absolute bottom-4 right-4 z-[3] pointer-events-none" width="20" height="20" viewBox="0 0 20 20" style={{ fill: 'hsl(var(--background))' }}>
          <path d="M 0 20 A 20 20 0 0 0 20 0 L 20 20 Z" />
        </svg>
      </div>
    </div>
  );
};
