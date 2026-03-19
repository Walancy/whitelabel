import { useState } from 'react';
import { Mail, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { GoogleIcon, AppleIcon, FacebookIcon } from '@/components/ui/social-icons';
import { AuthBackground } from '@/components/ui/AuthBackground';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { RecuperarSenhaForm } from '@/components/auth/shared/RecuperarSenhaForm';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS = 'h-11 w-full rounded-[var(--radius)] border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all';
const BTN_PRIMARY = 'w-full h-11 bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all rounded-[var(--radius)]';
const LABEL_CLASS = 'text-xs font-medium text-muted-foreground';
const LINK_CLASS = 'text-primary font-semibold hover:underline underline-offset-2 cursor-pointer';

type Mode = 'signin' | 'signup';

function SignInForm({ flow, onLogin }: { flow: ReturnType<typeof useAuthFlow>; onLogin: () => void }) {
  const isEmailValid = flow.email.length > 0 && EMAIL_REGEX.test(flow.email);
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
      <div className="space-y-2">
        <label className={LABEL_CLASS} htmlFor="projectli-email">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="projectli-email" type="email"
            value={flow.email} onChange={(e) => flow.setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            className={INPUT_CLASS + ' pl-10 pr-10'}
          />
          {isEmailValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="size-3 text-white" />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Senha</label>
        <div className="relative">
          <PasswordInput />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={flow.goToRecuperarSenha} className="text-xs text-primary font-semibold hover:underline underline-offset-2">
          Esqueceu a senha?
        </button>
      </div>
      <button type="submit" className={BTN_PRIMARY}>Entrar</button>
    </form>
  );
}

function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <>
      <input
        type={show ? 'text' : 'password'}
        placeholder="Sua senha"
        className={INPUT_CLASS + ' pr-10'}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </>
  );
}

function SignUpForm({ flow, onLogin }: { flow: ReturnType<typeof useAuthFlow>; onLogin: () => void }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const senhaOk = senha.length >= 8;
  const combinam = senha === confirmar && confirmar.length > 0;

  return (
    <form className="space-y-3.5" onSubmit={(e) => { e.preventDefault(); if (nome && flow.email && senhaOk && combinam) onLogin(); }}>
      <div className="space-y-1.5">
        <label className={LABEL_CLASS}>Nome completo</label>
        <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className={INPUT_CLASS} required />
      </div>
      <div className="space-y-1.5">
        <label className={LABEL_CLASS}>E-mail</label>
        <input type="email" placeholder="voce@empresa.com" value={flow.email} onChange={(e) => flow.setEmail(e.target.value)} className={INPUT_CLASS} required />
      </div>
      <div className="space-y-1.5">
        <label className={LABEL_CLASS}>Senha</label>
        <div className="relative">
          <input type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className={INPUT_CLASS + ' pr-10'} required />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPass ? 'Ocultar' : 'Mostrar'}>
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {senha.length > 0 && !senhaOk && <p className="text-xs text-red-500">Mínimo 8 caracteres</p>}
      </div>
      <div className="space-y-1.5">
        <label className={LABEL_CLASS}>Confirmar senha</label>
        <div className="relative">
          <input type={showConf ? 'text' : 'password'} placeholder="Repita a senha" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={INPUT_CLASS + ' pr-10'} required />
          <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showConf ? 'Ocultar' : 'Mostrar'}>
            {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {confirmar.length > 0 && !combinam && <p className="text-xs text-red-500">As senhas não coincidem</p>}
      </div>
      <button type="submit" className={BTN_PRIMARY + ' mt-1'}>Criar conta</button>
    </form>
  );
}

export const ProjectliAuth = ({ onLogin }: { onLogin: () => void }) => {
  const { theme, authFormSide } = useTheme();
  const [mode, setMode] = useState<Mode>('signin');
  const logoSrc = theme === 'dark' ? '/logo branca.svg' : '/logo preta.svg';
  const flow = useAuthFlow();
  const isRight = authFormSide === 'right';

  const isRecovery = flow.step === 'recuperar-senha' || flow.step === 'recuperar-nova-senha' || flow.step === 'recuperar-sucesso';

  return (
    <div className={cn("min-h-screen w-full flex bg-background text-foreground font-sans overflow-hidden", isRight ? "lg:flex-row-reverse" : "lg:flex-row")}>
      <div className="w-full lg:w-[calc(var(--auth-form-width)*1%)] lg:min-w-0 flex flex-col min-h-screen bg-card text-foreground shrink-0">
        <div className="p-8 lg:p-12 shrink-0">
          <img src={logoSrc} alt="Projectli" className="h-7 w-auto object-contain" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 pb-12">
          <div className="w-full space-y-5 animate-in fade-in duration-500" style={{ maxWidth: 'min(100%, 22rem)' }}>

            {isRecovery ? (
              <RecuperarSenhaForm flow={flow} inputClass={INPUT_CLASS} btnPrimaryClass={BTN_PRIMARY} labelClass={LABEL_CLASS} linkClass={LINK_CLASS} />
            ) : (
              <>
                <div className="space-y-1 text-center lg:text-left">
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    {mode === 'signin' ? 'Bem-vindo de volta' : 'Criar conta'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'signin' ? 'Informe seus dados para continuar.' : 'Preencha seus dados para começar.'}
                  </p>
                </div>

                <div className="flex rounded-[var(--radius)] bg-muted/50 p-1">
                  {(['signin', 'signup'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn('flex-1 py-2.5 text-sm font-medium transition-all rounded-[var(--radius)]',
                        mode === m ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {m === 'signin' ? 'Entrar' : 'Cadastro'}
                    </button>
                  ))}
                </div>

                {mode === 'signin' ? (
                  <SignInForm flow={flow} onLogin={onLogin} />
                ) : (
                  <SignUpForm flow={flow} onLogin={onLogin} />
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">Ou continue com</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button type="button" className="h-11 border border-border bg-card rounded-[var(--radius)] flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-sm font-medium" aria-label="Continuar com Google">
                    <GoogleIcon size={18} /> <span className="hidden sm:inline">Google</span>
                  </button>
                  <button type="button" className="h-11 border border-border bg-card rounded-[var(--radius)] flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-sm font-medium" aria-label="Continuar com Apple">
                    <AppleIcon size={18} /> <span className="hidden sm:inline">Apple</span>
                  </button>
                  <button type="button" className="h-11 border border-[#1877F2] bg-[#1877F2] rounded-[var(--radius)] flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm font-medium text-white" aria-label="Continuar com Facebook">
                    <FacebookIcon size={16} /> <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground pb-4">
          © 2026 Projectli. Todos os direitos reservados.
        </p>
      </div>

      <div className="hidden lg:flex flex-col lg:w-[calc((100-var(--auth-form-width))*1%)] lg:min-w-0 relative overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 bg-[#0d0f14]" />
        <AuthBackground />
      </div>
    </div>
  );
};
