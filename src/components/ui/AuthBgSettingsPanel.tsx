import { ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import type { AuthBgConfig } from '@/context/ThemeContext';
import { EFFECT_CONTROLS, getDefaultConfig } from '@/components/ui/authBgControls';
import type { ControlDef } from '@/components/ui/authBgControls';
import { AUTH_BG_OPTIONS } from '@/components/ui/AuthBackground';

interface AuthBgSettingsPanelProps { onBack: () => void; }

function ControlRow({ control, value, onChange }: {
  control: ControlDef;
  value: number | string | boolean;
  onChange: (val: number | string | boolean) => void;
}) {
  const { theme } = useTheme();
  if (control.type === 'range') {
    const num = Number(value);
    const displayVal = num % 1 === 0 ? num.toFixed(0) : num.toFixed(num < 1 ? 2 : 1);
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground font-medium">{control.label}</span>
          <span className="text-[10px] font-semibold text-foreground bg-accent/40 px-1.5 py-0.5 rounded tabular-nums">{displayVal}</span>
        </div>
        <input
          type="range" min={control.min} max={control.max} step={control.step} value={num}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-accent/40 rounded-full appearance-none cursor-pointer accent-primary"
        />
      </div>
    );
  }
  if (control.type === 'select') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-medium">{control.label}</span>
        <div className="flex gap-1">
          {control.options.map(opt => (
            <button
              key={opt.value} type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'px-2 py-1 text-[10px] rounded-md transition-colors font-medium',
                value === opt.value ? 'bg-primary text-primary-foreground' : 'bg-accent/30 text-muted-foreground hover:bg-accent/60'
              )}
            >{opt.label}</button>
          ))}
        </div>
      </div>
    );
  }
  if (control.type === 'toggle') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-medium">{control.label}</span>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
            value ? 'bg-primary' : 'bg-muted'
          )}
        >
          <span className={cn('pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white ring-0 transition-transform', value ? 'translate-x-5' : 'translate-x-1')} />
        </button>
      </div>
    );
  }
  if (control.type === 'color') {
    const isAuto = String(value) === 'auto' || !String(value).startsWith('#');
    const computedColor = isAuto ? (theme === 'dark' ? '#000000' : '#ffffff') : String(value);
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground font-medium">{control.label}</span>
        <div className="flex items-center gap-1.5">
          {isAuto ? (
            <>
              <div className="w-5 h-5 rounded" style={{ backgroundColor: computedColor, border: '1px solid hsl(var(--border))' }} />
              <span className="text-[10px] text-muted-foreground">Auto</span>
              <input
                type="color"
                value={computedColor}
                onChange={(e) => onChange(e.target.value)}
                title="Personalizar cor"
                className="w-5 h-5 rounded cursor-pointer opacity-0 absolute"
                style={{ position: 'relative', opacity: 1, padding: 0, border: 'none', width: 14, height: 14 }}
              />
            </>
          ) : (
            <>
              <input
                type="color"
                value={computedColor}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer"
                style={{ border: 'none', outline: 'none', padding: 0 }}
              />
              <span className="text-[10px] font-mono text-muted-foreground">{computedColor}</span>
              <button
                type="button"
                onClick={() => onChange('auto')}
                className="text-[10px] text-primary hover:opacity-70 transition-opacity px-1"
                title="Voltar para automático"
              >
                auto
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function AuthBgSettingsPanel({ onBack }: AuthBgSettingsPanelProps) {
  const { authBg, authBgConfigs, setAuthBgConfig } = useTheme();
  if (authBg === 'none') return null;

  const controls = EFFECT_CONTROLS[authBg] ?? [];
  const defaults = getDefaultConfig(authBg) as AuthBgConfig;
  const stored = (authBgConfigs[authBg] ?? {}) as AuthBgConfig;
  const cfg: AuthBgConfig = { ...defaults, ...stored };

  const handleChange = (key: string, val: number | string | boolean) =>
    setAuthBgConfig(authBg, { ...cfg, [key]: val });

  const handleReset = () => setAuthBgConfig(authBg, { ...defaults });

  const label = AUTH_BG_OPTIONS.find(o => o.value === authBg)?.label ?? authBg;

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
        <button
          type="button" onClick={onBack}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-semibold text-foreground flex-1">{label}</span>
        <button
          type="button" onClick={handleReset} title="Restaurar padrões"
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Restaurar padrões"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide flex-1">
        {controls.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">Sem configurações disponíveis.</p>
        )}
        {(() => {
          const bgColorControl = controls.find(c => c.key === 'bgColor');
          const restControls = controls.filter(c => c.key !== 'bgColor');
          return (
            <>
              {bgColorControl && (
                <>
                  <ControlRow
                    key={bgColorControl.key}
                    control={bgColorControl}
                    value={cfg[bgColorControl.key] ?? bgColorControl.default}
                    onChange={(val) => handleChange(bgColorControl.key, val)}
                  />
                  {restControls.length > 0 && <div className="h-px bg-border" />}
                </>
              )}
              {restControls.map((control) => (
                <ControlRow
                  key={control.key}
                  control={control}
                  value={cfg[control.key] ?? control.default}
                  onChange={(val) => handleChange(control.key, val)}
                />
              ))}
            </>
          );
        })()}
      </div>
    </div>
  );
}
