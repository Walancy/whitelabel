import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import type { AuthFlowState } from '@/hooks/useAuthFlow';

interface RecuperarSenhaFormProps {
  flow: AuthFlowState;
  inputClass: string;
  btnPrimaryClass: string;
  labelClass: string;
  linkClass: string;
}


function NovaSenhaStep({ goToLogin }: { goToLogin: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const combinam = senha === confirmar && confirmar.length > 0;

  if (sucesso) {
    return (
      <div className="flex flex-col items-center gap-5 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Senha redefinida!</h2>
          <p className="text-sm text-muted-foreground">Sua senha foi alterada com sucesso.</p>
        </div>
        <button
          type="button"
          onClick={goToLogin}
          className="w-full h-10 bg-primary text-primary-foreground rounded-[var(--radius)] text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Lock size={14} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Nova senha</h2>
          <p className="text-xs text-muted-foreground">Defina uma nova senha segura.</p>
        </div>
      </div>
      <form
        className="space-y-3.5"
        onSubmit={(e) => { e.preventDefault(); if (combinam && senha.length >= 8) setSucesso(true); }}
      >
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nova senha</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full h-11 bg-muted/50 border border-border rounded-[var(--radius)] px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirmar senha</label>
          <div className="relative">
            <input
              type={showConf ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full h-11 bg-muted/50 border border-border rounded-[var(--radius)] px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConf(!showConf)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConf ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmar.length > 0 && !combinam && (
            <p className="text-xs text-red-500">As senhas não coincidem</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full h-11 bg-primary text-primary-foreground rounded-[var(--radius)] text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all mt-1"
        >
          Redefinir senha
        </button>
      </form>
    </div>
  );
}

export function RecuperarSenhaForm({ flow, inputClass, btnPrimaryClass, labelClass, linkClass }: RecuperarSenhaFormProps) {
  if (flow.step === 'recuperar-nova-senha') {
    return <NovaSenhaStep goToLogin={flow.goToLogin} />;
  }

  if (flow.step === 'recuperar-sucesso') {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold">Senha redefinida!</h2>
        <button type="button" onClick={flow.goToLogin} className={btnPrimaryClass}>
          Ir para login
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flow.email) return;
    flow.setStep('recuperar-nova-senha');
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        type="button"
        onClick={flow.goToLogin}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={12} /> Voltar para login
      </button>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Recuperar senha</h2>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form className="space-y-3.5" onSubmit={handleSubmit}>
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
        <button type="submit" className={btnPrimaryClass}>
          Enviar link de recuperação
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Lembrou a senha?{' '}
        <button type="button" onClick={flow.goToLogin} className={linkClass}>
          Entrar
        </button>
      </p>
    </div>
  );
}
