import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import type { AuthFlowState } from '@/hooks/useAuthFlow';

interface CadastroFormProps {
  flow: AuthFlowState;
  onLogin?: () => void;
  inputClass: string;
  btnPrimaryClass: string;
  labelClass: string;
  linkClass: string;
}

function ConfirmarEmailStep({ email, goToLogin }: { email: string; goToLogin: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
        <Mail size={28} className="text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Confirme seu e-mail</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Enviamos um link de confirmação para{' '}
          <span className="font-semibold text-foreground">{email}</span>.
          Verifique sua caixa de entrada.
        </p>
      </div>
      <div className="w-full space-y-2 pt-2">
        <p className="text-xs text-muted-foreground">Não recebeu o e-mail?</p>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity underline underline-offset-2"
        >
          Reenviar link de confirmação
        </button>
      </div>
      <button
        type="button"
        onClick={goToLogin}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
      >
        <ArrowLeft size={12} /> Voltar para o login
      </button>
    </div>
  );
}

export function CadastroForm({ flow, inputClass, btnPrimaryClass, labelClass, linkClass }: CadastroFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const senhaOk = senha.length >= 8;
  const combinam = senha === confirmar && confirmar.length > 0;

  if (flow.step === 'cadastro-confirmar-email') {
    return <ConfirmarEmailStep email={flow.email} goToLogin={flow.goToLogin} />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome || !flow.email || !senhaOk || !combinam) return;
    flow.setStep('cadastro-confirmar-email');
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        type="button"
        onClick={flow.goToLogin}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={12} /> Voltar para o login
      </button>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Criar conta</h2>
        <p className="text-sm text-muted-foreground">Preencha seus dados para começar.</p>
      </div>

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className={labelClass}>Nome completo</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={flow.email}
            onChange={(e) => flow.setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={inputClass + ' pr-10'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {senha.length > 0 && !senhaOk && (
            <p className="text-xs text-red-500 mt-0.5">Mínimo 8 caracteres</p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Confirmar senha</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className={inputClass + ' pr-10'}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmar.length > 0 && !combinam && (
            <p className="text-xs text-red-500 mt-0.5">As senhas não coincidem</p>
          )}
          {combinam && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={11} /> Senhas coincidem
            </p>
          )}
        </div>

        <button type="submit" className={btnPrimaryClass + ' flex items-center justify-center gap-2 mt-1'}>
          <UserPlus size={15} /> Criar conta
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Já tem uma conta?{' '}
        <button type="button" onClick={flow.goToLogin} className={linkClass}>
          Entrar
        </button>
      </p>
    </div>
  );
}
