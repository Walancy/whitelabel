import { useState } from 'react';
import { Github, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useTheme } from '@/context/ThemeContext';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const INPUT_CLASS = 'w-full h-11 bg-muted/50 border border-border rounded-lg px-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none';
const BTN_PRIMARY = 'w-full h-11 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all';
const LABEL_CLASS = 'text-xs font-semibold text-foreground ml-1';
const LINK_CLASS = 'text-primary font-bold hover:underline cursor-pointer';

export const NexusAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const isRight = authFormSide === 'right';

  return (
    <div className={`min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden ${!isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      {/* Decorative panel */}
      <div className="hidden lg:flex flex-col lg:min-w-0 bg-muted dark:bg-[#0A0A0A] relative p-12 justify-between lg:w-[calc((100-var(--auth-form-width))*1%)]">        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[130px] rounded-full pointer-events-none z-[1]" />
        <AuthBackground />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/40 to-background/80 dark:from-black/70 dark:via-black/40 dark:to-black/70 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20 animate-in fade-in slide-in-from-left duration-700">
            <img src={theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg'} alt="Nexus" className="h-8 w-auto" />
          </div>
          <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-foreground dark:text-white">
              Bem-vindo <br /> ao Nexus
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Faça login com segurança e continue gerenciando seu workspace.
            </p>
          </div>
        </div>

      </div>

      <div className="w-full lg:min-w-0 flex flex-col items-center justify-center p-6 lg:p-12 animate-in fade-in duration-1000 bg-background relative z-10 lg:w-[calc(var(--auth-form-width)*1%)]">
        <div className="w-full max-w-[360px] space-y-6">

          {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
            <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
            <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
          ) : (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Entrar</h2>
                <p className="text-muted-foreground text-sm mt-1">Insira suas credenciais para acessar sua conta.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-card border border-border hover:bg-accent text-foreground transition-all active:scale-[0.98]">
                  <GoogleIcon size={18} />
                  <span className="text-xs font-semibold">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-card border border-border hover:bg-accent text-foreground transition-all active:scale-[0.98]">
                  <Github size={18} />
                  <span className="text-xs font-semibold">Github</span>
                </button>
              </div>

              <div className="relative flex items-center gap-2 justify-center py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-background px-2">Ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div className="space-y-1.5">
                  <label className={LABEL_CLASS}>E-mail</label>
                  <input
                    type="email"
                    placeholder="ex: usuario@empresa.com"
                    value={flow.email}
                    onChange={(e) => flow.setEmail(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className={LABEL_CLASS}>Senha</label>
                    <button
                      type="button"
                      onClick={flow.goToRecuperarSenha}
                      className="text-[10px] font-semibold text-primary cursor-pointer hover:underline"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Insira sua senha"
                      className={INPUT_CLASS + ' pr-12'}
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

                <button type="submit" className={BTN_PRIMARY + ' flex items-center justify-center gap-2 group mt-2'}>
                  Entrar
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                Não tem uma conta?{' '}
                <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>
                  Cadastre-se
                </button>
              </p>
            </>
          )}

          <p className="text-center text-[10px] text-muted-foreground pt-2">
            © 2026 Nexus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
