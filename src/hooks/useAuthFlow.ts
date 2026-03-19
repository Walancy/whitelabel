import { useState } from 'react';

export type AuthStep =
  | 'login'
  | 'cadastro'
  | 'cadastro-confirmar-email'
  | 'recuperar-senha'
  | 'recuperar-nova-senha'
  | 'recuperar-sucesso';

export interface AuthFlowState {
  step: AuthStep;
  email: string;
  setStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
  goToLogin: () => void;
  goToCadastro: () => void;
  goToRecuperarSenha: () => void;
}

export function useAuthFlow(): AuthFlowState {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');

  return {
    step,
    email,
    setStep,
    setEmail,
    goToLogin: () => setStep('login'),
    goToCadastro: () => setStep('cadastro'),
    goToRecuperarSenha: () => setStep('recuperar-senha'),
  };
}
