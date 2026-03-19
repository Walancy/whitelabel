/**
 * Targets ONLY primary submit buttons.
 * Excludes: type="button" (UI controls), hyperlinks, social buttons, icon buttons.
 */
const BTN = `html[data-btn-model] button[type="submit"]`;
const M = (m: string) => `html[data-btn-model="${m}"] button[type="submit"]`;

export type ButtonModel =
  | 'default' | 'glass' | 'retro' | 'dark-neu' | 'workly' | 'workly-sidebar';

export interface ButtonStyleConfig {
  model: ButtonModel;
  bgColor: string;       // hex | 'auto'
  bgColor2: string;      // hex for gradient end
  useGradient: boolean;
  textColor: string;     // hex | 'auto'
  borderEnabled: boolean;
  borderWidth: number;   // 1-6
  borderColor: string;   // hex | 'auto'
}

export const DEFAULT_BTN_CONFIG: ButtonStyleConfig = {
  model: 'default',
  bgColor: 'auto',
  bgColor2: 'auto',
  useGradient: false,
  textColor: 'auto',
  borderEnabled: false,
  borderWidth: 1,
  borderColor: 'auto',
};

export const BUTTON_MODELS: { value: ButtonModel; label: string }[] = [
  { value: 'default', label: 'Padrão' },
  { value: 'glass', label: 'Glass' },
  { value: 'retro', label: 'Retro' },
  { value: 'dark-neu', label: 'Dark Neu' },
  { value: 'workly', label: 'Workly' },
  { value: 'workly-sidebar', label: 'Sidebar Glow' },
];

/* ── Model base CSS ─────────────────────────────────────────────────────────── */
// NOTE: No border-radius overrides — global --radius controls that.

const MODEL_CSS: Record<ButtonModel, string> = {

  default: '',

  // ── Glassmorphism ────────────────────────────────────────────────────────────
  glass: `
${M('glass')} {
  background: rgba(255,255,255,0.08) !important;
  color: hsl(var(--primary)) !important;
  border: 1px solid rgba(255,255,255,0.22) !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.18) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  filter: none !important;
  transition: background 0.25s, box-shadow 0.25s !important;
}
${M('glass')}:hover {
  background: rgba(255,255,255,0.15) !important;
  box-shadow: 0 8px 36px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.28) !important;
  filter: none !important;
}
${M('glass')}:active { transform: scale(0.98) !important; }`,

  // ── Retro (yellow + hard black shadow) ───────────────────────────────────────
  retro: `
${M('retro')} {
  background: #fbca1f !important;
  color: #000 !important;
  border: 3px solid #000 !important;
  box-shadow: 4px 4px 0 0 #000 !important;
  font-weight: 900 !important;
  filter: none !important;
  transition: transform 0.1s, box-shadow 0.1s !important;
}
${M('retro')}:hover {
  transform: translate(-2px, -2px) !important;
  box-shadow: 6px 6px 0 0 #000 !important;
  filter: none !important;
}
${M('retro')}:active {
  transform: translate(2px, 2px) !important;
  box-shadow: 2px 2px 0 0 #000 !important;
}`,

  // ── Dark Neumorphic ───────────────────────────────────────────────────────────
  'dark-neu': `
${M('dark-neu')} {
  background: #1e1e1e !important;
  color: #fff !important;
  border: 1px solid #2e2e2e !important;
  box-shadow:
    inset 3px 3px 8px #141414,
    inset -3px -3px 8px #282828,
    0 4px 12px rgba(0,0,0,0.4) !important;
  filter: none !important;
  transition: box-shadow 0.2s !important;
}
${M('dark-neu')}:hover {
  box-shadow:
    inset 2px 2px 5px #141414,
    inset -2px -2px 5px #282828,
    0 6px 18px rgba(0,0,0,0.5) !important;
  filter: none !important;
}
${M('dark-neu')}:active {
  box-shadow:
    inset 5px 5px 12px #111,
    inset -5px -5px 12px #2a2a2a !important;
  transform: scale(0.99) !important;
}`,

  // ── Workly btn-primary: bi-directional edge glow ─────────────────────────────
  // Mirrors the .workly-btn-primary class from globals.css
  workly: `
${M('workly')} {
  background:
    linear-gradient(to left,  hsl(var(--primary) / 0.42) 0%, hsl(var(--primary) / 0.18) 15%, hsl(var(--primary) / 0.04) 40%, transparent 100%),
    linear-gradient(to right, hsl(var(--primary) / 0.42) 0%, hsl(var(--primary) / 0.18) 15%, hsl(var(--primary) / 0.04) 40%, transparent 100%),
    hsl(var(--input)) !important;
  color: hsl(var(--foreground)) !important;
  border: 1px solid hsl(0 0% 100% / 0.06) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  filter: none !important;
  transition: background 0.2s !important;
}
:not(.dark) ${M('workly')} {
  border-color: hsl(0 0% 0% / 0.08) !important;
}
${M('workly')}:hover {
  background:
    linear-gradient(to left,  hsl(var(--primary) / 0.52) 0%, hsl(var(--primary) / 0.24) 15%, hsl(var(--primary) / 0.06) 40%, transparent 100%),
    linear-gradient(to right, hsl(var(--primary) / 0.52) 0%, hsl(var(--primary) / 0.24) 15%, hsl(var(--primary) / 0.06) 40%, transparent 100%),
    hsl(var(--input)) !important;
  filter: none !important;
}
${M('workly')}:active { transform: scale(0.98) !important; }`,

  // ── Workly sidebar neon-active: right-edge glow ───────────────────────────────
  // Mirrors the .workly-neon-active class from globals.css
  'workly-sidebar': `
${M('workly-sidebar')} {
  background: linear-gradient(
    to left,
    hsl(var(--primary) / 0.72) 0%,
    hsl(var(--primary) / 0.28) 15%,
    hsl(var(--primary) / 0.06) 40%,
    hsl(var(--input)) 100%
  ) !important;
  color: hsl(var(--primary-foreground)) !important;
  border-top:    1px solid hsl(0 0% 100% / 0.05) !important;
  border-bottom: 1px solid hsl(0 0% 100% / 0.05) !important;
  border-right:  2px solid hsl(var(--primary)) !important;
  border-left:   none !important;
  box-shadow: 3px 0 16px 2px hsl(var(--primary) / 0.4) !important;
  filter: none !important;
  transition: background 0.2s, box-shadow 0.2s !important;
}
${M('workly-sidebar')}:hover {
  background: linear-gradient(
    to left,
    hsl(var(--primary) / 0.85) 0%,
    hsl(var(--primary) / 0.35) 15%,
    hsl(var(--primary) / 0.08) 40%,
    hsl(var(--input)) 100%
  ) !important;
  box-shadow: 4px 0 22px 4px hsl(var(--primary) / 0.5) !important;
  filter: none !important;
}
${M('workly-sidebar')}:active { transform: scale(0.98) !important; }`,
};

/* ── Custom overrides (appended after model CSS) ────────────────────────────── */

function hasCustom(cfg: ButtonStyleConfig): boolean {
  return cfg.bgColor !== 'auto' || cfg.textColor !== 'auto'
    || cfg.useGradient || cfg.borderEnabled;
}

function buildCustomCSS(cfg: ButtonStyleConfig): string {
  if (!hasCustom(cfg)) return '';
  const lines: string[] = [];

  if (cfg.bgColor !== 'auto') {
    if (cfg.useGradient && cfg.bgColor2 !== 'auto') {
      lines.push(`background: linear-gradient(135deg, ${cfg.bgColor}, ${cfg.bgColor2}) !important;`);
    } else {
      lines.push(`background: ${cfg.bgColor} !important;`);
    }
  }
  if (cfg.textColor !== 'auto') lines.push(`color: ${cfg.textColor} !important;`);
  if (cfg.borderEnabled) {
    const bColor = cfg.borderColor !== 'auto' ? cfg.borderColor : 'currentColor';
    lines.push(`border: ${cfg.borderWidth}px solid ${bColor} !important;`);
  }

  if (!lines.length) return '';
  return `${BTN} {\n  ${lines.join('\n  ')}\n}`;
}

/* ── Public builder ─────────────────────────────────────────────────────────── */

export function buildButtonCSS(cfg: ButtonStyleConfig): string {
  const base = MODEL_CSS[cfg.model] || '';
  const custom = buildCustomCSS(cfg);
  return [base, custom].filter(Boolean).join('\n\n');
}
