import { useState, useEffect } from 'react';
import { Twitter, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const AUTOFILL_DELAY = 100_000_000;

const INPUT_CLASS = 'w-full h-11 bg-muted/80 border border-transparent rounded-lg px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground text-foreground';
const BTN_PRIMARY = 'w-full h-11 bg-foreground text-background rounded-lg font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center';
const LABEL_CLASS = 'text-xs font-semibold text-muted-foreground';
const LINK_CLASS = 'text-primary font-semibold cursor-pointer hover:underline underline-offset-4';

export const ShopeersAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [allowAutocomplete, setAllowAutocomplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, authFormSide } = useTheme();
  const flow = useAuthFlow();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  const isRight = authFormSide === 'right';

  useEffect(() => {
    const t = setTimeout(() => setAllowAutocomplete(true), AUTOFILL_DELAY * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden">
      <div className={`w-full flex flex-col relative min-h-screen ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        <div className="absolute inset-0 z-0 bg-black">
          <AuthBackground />
        </div>

        <div className="w-full lg:min-w-0 min-h-[70vh] lg:min-h-screen bg-card/95 backdrop-blur-xl flex flex-col p-6 sm:p-8 lg:p-12 relative z-10 border-border/50 lg:w-[calc(var(--auth-form-width)*1%)]">
          <div className="flex items-center gap-2 mb-10 lg:mb-14">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain" />
          </div>

          <div className="flex-1 flex flex-col justify-center w-full max-w-[340px] mx-auto">
            {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
              <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
              <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Login</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px]">
                    Insira suas credenciais para acessar sua conta.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                  <div className="space-y-1">
                    <label htmlFor="shopeers-email" className={LABEL_CLASS}>E-mail</label>
                    <input
                      id="shopeers-email" type="email" placeholder="Digite seu e-mail"
                      value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                      autoComplete={allowAutocomplete ? 'email' : 'off'}
                      className={INPUT_CLASS} aria-label="E-mail"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="shopeers-password" className={LABEL_CLASS}>Senha</label>
                      <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-primary font-semibold hover:underline underline-offset-2">
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="shopeers-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        autoComplete={allowAutocomplete ? 'current-password' : 'off'}
                        className={INPUT_CLASS + ' pr-10'}
                        aria-label="Senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className={BTN_PRIMARY + ' mt-2'}>
                    Entrar
                  </button>
                </form>

                <div className="relative flex items-center py-6" aria-hidden>
                  <div className="flex-grow border-t border-border" />
                  <span className="mx-3 text-xs text-muted-foreground lowercase">ou entrar via</span>
                  <div className="flex-grow border-t border-border" />
                </div>

                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Login com redes sociais">
                  {[
                    { icon: <GoogleIcon size={14} />, label: 'Google', ariaLabel: 'Entrar com Google' },
                    { icon: <AppleIcon size={14} />, label: 'Apple', ariaLabel: 'Entrar com Apple' },
                    { icon: <Twitter size={14} className="text-foreground/80" />, label: 'Twitter', ariaLabel: 'Entrar com Twitter' },
                  ].map(({ icon, label, ariaLabel }) => (
                    <button
                      key={label} type="button" aria-label={ariaLabel}
                      className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-muted/80 hover:bg-muted border border-transparent hover:border-border/50 transition-all active:scale-[0.98]"
                    >
                      {icon}
                      <span className="text-xs font-medium text-foreground/90">{label}</span>
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <button type="button" onClick={flow.goToCadastro} className={LINK_CLASS}>
                    Cadastre-se
                  </button>
                </p>
              </>
            )}
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-6">
            © 2026 Shopeers. Todos os direitos reservados.
          </p>
        </div>

        <div className="hidden lg:flex lg:w-[calc((100-var(--auth-form-width))*1%)] lg:min-w-0 relative z-10 overflow-hidden min-h-[30vh] lg:min-h-screen" aria-hidden />
      </div>
    </div>
  );
};
