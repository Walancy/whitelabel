import { useState, useRef, useEffect } from 'react';
import { Palette, CheckCircle2, Sliders, CornerUpRight, Moon, Sun, PanelLeft, Layers, Settings2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { AUTH_BG_OPTIONS } from '@/components/ui/AuthBackground';
import { AuthBgSettingsPanel } from '@/components/ui/AuthBgSettingsPanel';

interface LayoutSwitcherProps {
  showFormWidthOption?: boolean;
}

export const LayoutSwitcher = ({ showFormWidthOption = false }: LayoutSwitcherProps) => {
  const { 
    theme,
    toggleTheme,
    visualPattern, 
    setVisualPattern, 
    accentColor, 
    setAccentColor, 
    useCustomAccent, 
    setUseCustomAccent,
    borderRadius,
    setBorderRadius,
    showShadows,
    setShowShadows,
    authFormWidth,
    setAuthFormWidth,
    authBg,
    setAuthBg,
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [bgDropOpen, setBgDropOpen] = useState(false);
  const [layoutDropOpen, setLayoutDropOpen] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bgDropRef = useRef<HTMLDivElement>(null);
  const layoutDropRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (bgDropRef.current && !bgDropRef.current.contains(event.target as Node)) {
        setBgDropOpen(false);
      }
      if (layoutDropRef.current && !layoutDropRef.current.contains(event.target as Node)) {
        setLayoutDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const patterns = [
    { id: 'nexus', name: 'Nexus' },
    { id: 'shopeers', name: 'Shopeers' },
    { id: 'projectli', name: 'Projectli' },
    { id: 'magika', name: 'Magika' },
    { id: 'workly', name: 'Workly' },
    { id: 'taskplus', name: 'Taskplus' },
    { id: 'eevo', name: 'Eevo' },
    { id: 'quantum', name: 'Quantum' },
    { id: 'resync', name: 'ReSync' }
  ] as const;

  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const hslToHex = (hsl: string) => {
    const parts = hsl.split(' ');
    const h = parseInt(parts[0]) / 360;
    const s = parseInt(parts[1].replace('%', '')) / 100;
    const l = parseInt(parts[2].replace('%', '')) / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      r = hue2rgb(h + 1 / 3);
      g = hue2rgb(h);
      b = hue2rgb(h - 1 / 3);
    }
    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const presetColors = [
    { name: 'Nexus (Default)', value: '240 5.9% 10%' },
    { name: 'Lime', value: '84 100% 59%' },
    { name: 'Blue', value: '221 83% 53%' },
    { name: 'Green', value: '142 71% 45%' },
    { name: 'Red', value: '0 84.2% 60.2%' },
    { name: 'Purple', value: '262 83% 58%' },
    { name: 'Orange', value: '24.6 95% 53%' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 group bg-foreground text-background"
      >
        <Palette size={20} className="group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="absolute bottom-16 right-0 bg-card border border-border shadow-2xl rounded-2xl p-4 w-72 z-50 animate-in slide-in-from-bottom-2 max-h-[85vh]">

          {/* === SETTINGS MODE === */}
          {settingsMode ? (
            <AuthBgSettingsPanel onBack={() => setSettingsMode(false)} />
          ) : (
          <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(85vh-2rem)] scrollbar-hide">

          {/* Layout Selection */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Palette size={14} className="text-muted-foreground" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Visual Layout</p>
            </div>
            <div ref={layoutDropRef} className="relative">
              <button
                type="button"
                onClick={() => setLayoutDropOpen(p => !p)}
                className="w-full h-9 px-3 text-xs bg-accent/20 border border-border rounded-[var(--radius)] text-foreground flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={layoutDropOpen}
                aria-label="Selecionar estilo visual"
              >
                <span className="capitalize">{patterns.find(p => p.id === visualPattern)?.name ?? visualPattern}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={cn('transition-transform duration-150 text-muted-foreground', layoutDropOpen && 'rotate-180')}>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {layoutDropOpen && (
                <ul
                  role="listbox"
                  className="absolute top-full mt-1 left-0 w-full bg-card border border-border rounded-[var(--radius)] py-1 z-[60] overflow-y-auto scrollbar-hide shadow-lg"
                >
                  {patterns.map((pattern) => (
                    <li
                      key={pattern.id}
                      role="option"
                      aria-selected={visualPattern === pattern.id}
                      onClick={() => setVisualPattern(pattern.id)}
                      className={cn(
                        'flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer transition-colors capitalize',
                        visualPattern === pattern.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-accent/40'
                      )}
                    >
                      {pattern.name}
                      {visualPattern === pattern.id && <CheckCircle2 size={12} />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Dark/Light mode - sempre visível */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon size={14} className="text-muted-foreground" /> : <Sun size={14} className="text-muted-foreground" />}
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Dark / Light</p>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                theme === 'dark' ? 'bg-primary' : 'bg-muted'
              )}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              <span className={cn(
                'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white ring-0 transition-transform',
                theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
              )} />
            </button>
          </div>

          {/* Largura do formulário (apenas na tela de login) */}
          {showFormWidthOption && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <PanelLeft size={14} className="text-muted-foreground" />
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Largura do formulário</p>
                <span className="ml-auto text-[10px] font-semibold text-foreground bg-accent/40 px-1.5 py-0.5 rounded">{authFormWidth}%</span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  min={35}
                  max={60}
                  value={authFormWidth}
                  onChange={(e) => setAuthFormWidth(Number(e.target.value))}
                  className="w-full h-1.5 bg-accent rounded-full appearance-none cursor-pointer accent-primary"
                  aria-label="Largura do painel do formulário"
                />
              </div>
            </div>
          )}

          {/* Auth Background */}
          {showFormWidthOption && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <Layers size={14} className="text-muted-foreground" />
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Auth Background</p>
                {authBg !== 'none' && (
                  <button
                    type="button"
                    onClick={() => setSettingsMode(true)}
                    title="Ajustar efeito"
                    aria-label="Ajustar parâmetros do efeito"
                    className="ml-auto w-6 h-6 flex items-center justify-center rounded-md hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Settings2 size={12} />
                  </button>
                )}
              </div>

              <div ref={bgDropRef} className="relative">
                <button
                  type="button"
                  onClick={() => setBgDropOpen(p => !p)}
                  className="w-full h-9 px-3 text-xs bg-accent/20 border border-border rounded-[var(--radius)] text-foreground flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors"
                  aria-haspopup="listbox"
                  aria-expanded={bgDropOpen}
                  aria-label="Estilo de fundo da tela de login"
                >
                  <span>{AUTH_BG_OPTIONS.find(o => o.value === authBg)?.label ?? 'Nenhum'}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={cn('transition-transform duration-150 text-muted-foreground', bgDropOpen && 'rotate-180')}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {bgDropOpen && (
                  <ul
                    role="listbox"
                    className="absolute bottom-full mb-1 left-0 w-full bg-card border border-border rounded-[var(--radius)] py-1 z-[60] max-h-52 overflow-y-auto scrollbar-hide"
                  >
                    {AUTH_BG_OPTIONS.map((opt) => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={authBg === opt.value}
                        onClick={() => setAuthBg(opt.value)}
                        className={cn(
                          'flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer transition-colors',
                          authBg === opt.value
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground hover:bg-accent/40'
                        )}
                      >
                        {opt.label}
                        {authBg === opt.value && <CheckCircle2 size={12} />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-border" />

          {/* Controls Section (Radius & Shadows) */}
          <div className="flex flex-col gap-4">
            {/* Border Radius Control */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                 <CornerUpRight size={14} className="text-muted-foreground" />
                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Corner Radius</p>
                 <span className="ml-auto text-[10px] font-bold text-foreground bg-accent/40 px-1.5 py-0.5 rounded">{borderRadius}%</span>
              </div>
              <div className="px-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-accent rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Shadows Toggle */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <Moon size={14} className="text-muted-foreground" />
                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Enable Shadows</p>
              </div>
              <button 
                onClick={() => setShowShadows(!showShadows)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none",
                  showShadows ? "bg-primary" : "bg-muted"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition-transform",
                  showShadows ? "translate-x-5" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Accent Color Section */}
          <div>
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                   <Sliders size={14} className="text-muted-foreground" />
                   <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Accent Colors</p>
                </div>
                <button 
                  onClick={() => setUseCustomAccent(!useCustomAccent)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none",
                    useCustomAccent ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition-transform",
                    useCustomAccent ? "translate-x-5" : "translate-x-1"
                  )} />
                </button>
             </div>
             
             {useCustomAccent && (
               <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-7 gap-1.5 px-0.5 mb-3">
                    {presetColors.map((color) => (
                      <button 
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        title={color.name}
                        className={cn(
                          "w-8 h-8 rounded-lg border transition-all active:scale-90",
                          accentColor === color.value ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: `hsl(${color.value})` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 bg-accent/20 rounded-lg border border-border">
                    <input 
                       type="color" 
                       value={hslToHex(accentColor)}
                       onChange={(e) => setAccentColor(hexToHsl(e.target.value))}
                       className="w-10 h-6 rounded-md border border-border cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                    />
                    <span className="text-[10px] font-semibold text-muted-foreground truncate">Pick Custom Color</span>
                  </div>
               </div>
             )}
             
             {!useCustomAccent && (
               <div className="px-3 py-4 rounded-xl border border-border border-dashed text-center bg-accent/10">
                  <p className="text-[10px] text-muted-foreground font-medium">Using native layout colors</p>
               </div>
             )}
          </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

