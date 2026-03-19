import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { CadastroForm } from '@/components/auth/shared/CadastroForm';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

type Tab = 'login' | 'signup';

const SOCIALS = [
  { id: 'google', Icon: GoogleIcon, label: 'Google' },
  { id: 'apple', Icon: AppleIcon, label: 'Apple' },
] as const;

const INPUT_CLASS = 'w-full h-10 bg-background border border-border rounded-[--radius] px-4 text-sm focus:border-primary outline-none transition-colors';
const BTN_PRIMARY = 'w-full h-10 bg-primary text-primary-foreground rounded-[--radius] text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all';
const LABEL_CLASS = 'text-xs font-semibold';
const LINK_CLASS = 'text-primary font-semibold hover:opacity-80 transition-opacity cursor-pointer';

export const MagikaAuth = ({ onLogin }: { onLogin: () => void }) => {
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { authFormWidth, theme } = useTheme();
  const flow = useAuthFlow();
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">
      <div className="flex flex-col items-center p-8 lg:p-14 shrink-0" style={{ width: `${authFormWidth}%`, minWidth: '320px' }}>
        <div className="mb-10 w-full max-w-[360px]">
          <img src={logoSrc} alt="Logo" className="h-7 w-auto object-contain" />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-[360px] space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">

            {flow.step === 'cadastro' || flow.step === 'cadastro-confirmar-email' ? (
              <CadastroForm flow={flow} onLogin={onLogin} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso' ? (
              <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : (
              <>
                <div className="flex gap-5">
                  {(['login', 'signup'] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        'flex items-center gap-1.5 text-sm font-semibold pb-1 transition-colors',
                        tab === t ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {t === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                      {t === 'login' ? 'Login' : 'Cadastro'}
                    </button>
                  ))}
                </div>

                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Bem-vindo!</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Insira seus dados para {tab === 'login' ? 'entrar' : 'criar uma conta'}.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); tab === 'login' ? onLogin() : flow.goToCadastro(); }}>
                  <div className="space-y-1.5">
                    <label htmlFor="magika-email" className={LABEL_CLASS}>Endereço de e-mail</label>
                    <input
                      id="magika-email" type="email" placeholder="Digite seu endereço de e-mail"
                      value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="magika-password" className={LABEL_CLASS}>Senha</label>
                      {tab === 'login' && (
                        <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-primary font-semibold hover:opacity-80 transition-opacity">
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="magika-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        className={INPUT_CLASS + ' pr-10'}
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

                  <button type="submit" className={BTN_PRIMARY + ' mt-1'}>
                    {tab === 'login' ? 'Entrar' : 'Criar Conta'}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-muted-foreground">OU</span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <div className="space-y-2.5">
                  {SOCIALS.map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      className="w-full h-10 flex items-center justify-center gap-3 border border-border rounded-[--radius] text-sm font-semibold hover:bg-accent/10 active:scale-[0.98] transition-all"
                    >
                      <Icon />
                      Continuar com {label}
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  {tab === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                  <button onClick={() => tab === 'login' ? flow.goToCadastro() : setTab('login')} className={LINK_CLASS}>
                    {tab === 'login' ? 'Cadastre-se' : 'Login'}
                  </button>
                </p>
              </>
            )}

            <p className="text-center text-[10px] text-muted-foreground">
              © 2026 Magika. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <AuthBackground />
      </div>
    </div>
  );
};
