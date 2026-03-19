import { useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import {
    BUTTON_MODELS, DEFAULT_BTN_CONFIG,
    type ButtonStyleConfig, type ButtonModel,
} from '@/components/ui/buttonStyleModels';

interface Props { onBack: () => void; }

/* ── Color Picker row ────────────────────────────────────────────────────────── */
function ColorRow({
    label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
    const isAuto = value === 'auto';
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            <div className="flex items-center gap-1.5">
                {isAuto ? (
                    <>
                        <span className="text-[10px] text-muted-foreground">Auto</span>
                        <input
                            type="color" defaultValue="#6366f1"
                            onChange={(e) => onChange(e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border-none outline-none p-0"
                            title="Personalizar"
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="color" value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border-none outline-none p-0"
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{value}</span>
                        <button
                            type="button" onClick={() => onChange('auto')}
                            className="text-[10px] text-primary hover:opacity-70 transition-opacity px-1"
                        >auto</button>
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Toggle row ──────────────────────────────────────────────────────────────── */
function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            <button
                type="button" onClick={() => onChange(!value)}
                className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                    value ? 'bg-primary' : 'bg-muted'
                )}
            >
                <span className={cn(
                    'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white ring-0 transition-transform',
                    value ? 'translate-x-5' : 'translate-x-1'
                )} />
            </button>
        </div>
    );
}

/* ── Range row ───────────────────────────────────────────────────────────────── */
function RangeRow({
    label, value, min, max, step, unit = '', onChange,
}: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void; }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
                <span className="text-[10px] font-semibold text-foreground bg-accent/40 px-1.5 py-0.5 rounded tabular-nums">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-accent/40 rounded-full appearance-none cursor-pointer accent-primary"
            />
        </div>
    );
}

/* ── Main Panel ──────────────────────────────────────────────────────────────── */
export function ButtonStylePanel({ onBack }: Props) {
    const { buttonStyleConfig, setButtonStyleConfig } = useTheme();
    const cfg = buttonStyleConfig;
    const [modelDropOpen, setModelDropOpen] = useState(false);

    const set = (patch: Partial<ButtonStyleConfig>) =>
        setButtonStyleConfig({ ...cfg, ...patch });

    const currentModel = BUTTON_MODELS.find(m => m.value === cfg.model) ?? BUTTON_MODELS[0];

    return (
        <div className="flex flex-col gap-0 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <button
                    type="button" onClick={onBack}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={14} />
                </button>
                <span className="text-xs font-semibold text-foreground flex-1">Button Style</span>
                <button
                    type="button" onClick={() => setButtonStyleConfig({ ...DEFAULT_BTN_CONFIG })}
                    title="Restaurar padrões"
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw size={12} />
                </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide flex-1">

                {/* Model Dropdown */}
                <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Modelo</p>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setModelDropOpen(p => !p)}
                            className="w-full h-9 px-3 text-xs bg-accent/20 border border-border rounded-[var(--radius)] text-foreground flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors"
                        >
                            <span>{currentModel.label}</span>
                            <ChevronDown size={12} className={cn('transition-transform duration-150 text-muted-foreground', modelDropOpen && 'rotate-180')} />
                        </button>
                        {modelDropOpen && (
                            <ul
                                role="listbox"
                                className="absolute top-full mt-1 left-0 w-full bg-card border border-border rounded-[var(--radius)] py-1 z-[70] overflow-y-auto scrollbar-hide shadow-lg max-h-48"
                            >
                                {BUTTON_MODELS.map((m) => (
                                    <li
                                        key={m.value}
                                        role="option"
                                        aria-selected={cfg.model === m.value}
                                        onClick={() => { set({ model: m.value as ButtonModel }); setModelDropOpen(false); }}
                                        className={cn(
                                            'flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer transition-colors',
                                            cfg.model === m.value
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'text-foreground hover:bg-accent/40'
                                        )}
                                    >
                                        {m.label}
                                        {cfg.model === m.value && <CheckCircle2 size={12} />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Background */}
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mb-1">Cor de Fundo</p>
                <ColorRow label="Cor principal" value={cfg.bgColor} onChange={(v) => set({ bgColor: v })} />
                <ToggleRow label="Gradiente" value={cfg.useGradient} onChange={(v) => set({ useGradient: v })} />
                {cfg.useGradient && (
                    <ColorRow label="Cor final" value={cfg.bgColor2} onChange={(v) => set({ bgColor2: v })} />
                )}

                <div className="h-px bg-border" />

                {/* Text */}
                <ColorRow label="Cor do texto" value={cfg.textColor} onChange={(v) => set({ textColor: v })} />

                <div className="h-px bg-border" />

                {/* Border */}
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mb-1">Borda</p>
                <ToggleRow label="Borda" value={cfg.borderEnabled} onChange={(v) => set({ borderEnabled: v })} />
                {cfg.borderEnabled && (
                    <>
                        <RangeRow label="Espessura" value={cfg.borderWidth} min={1} max={6} step={1} unit="px"
                            onChange={(v) => set({ borderWidth: v })} />
                        <ColorRow label="Cor" value={cfg.borderColor} onChange={(v) => set({ borderColor: v })} />
                    </>
                )}

            </div>
        </div>
    );
}
