import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Palette, CheckCircle2, Sliders, Moon, Sun, 
  PanelLeft, PanelRight, Layers, Settings2, ChevronDown, 
  Wand2, MousePointer2, ImageIcon, Copy, Check as CheckIcon
} from 'lucide-react';
import { useTheme, type DashboardBgEffect, type SidebarActiveStyle } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { AUTH_BG_OPTIONS } from '@/components/ui/AuthBackground';
import { AuthBgSettingsPanel } from '@/components/ui/AuthBgSettingsPanel';

interface LayoutSwitcherProps {
  showFormWidthOption?: boolean;
}

const Popover = ({ title, children, isWide = false, className }: { title?: string, children: React.ReactNode, isWide?: boolean, className?: string }) => (
  <div className={cn(
    "absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 bg-[#2c2c2c] border border-white/10 shadow-2xl rounded-xl p-3 origin-bottom animate-in fade-in zoom-in-95 duration-200 z-50 text-white",
    isWide ? "w-[300px]" : "w-[240px]",
    className
  )}>
    {title && <h3 className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-3 px-1">{title}</h3>}
    {children}
    <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#2c2c2c] border-r border-b border-white/10 rotate-45" />
  </div>
);

export const LayoutSwitcher = ({ showFormWidthOption = false }: LayoutSwitcherProps) => {
  const {
    theme, toggleTheme, visualPattern, setVisualPattern,
    accentColor, setAccentColor, useCustomAccent, setUseCustomAccent,
    activeAccentColor, borderRadius, setBorderRadius, showShadows, setShowShadows,
    authFormWidth, setAuthFormWidth, authFormSide, setAuthFormSide,
    authBg, setAuthBg, dashboardConfig, setDashboardConfig
  } = useTheme();

  const [activeMenu, setActiveMenu] = useState<'visual' | 'color' | 'layout' | 'radius' | 'authbg' | 'form' | 'buttons' | 'dashbg' | null>(null);
  const [settingsMode, setSettingsMode] = useState<'none' | 'authbg'>('none');
  const [copied, setCopied] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setSettingsMode('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu: typeof activeMenu) => {
    if (activeMenu === menu && settingsMode === 'none') {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
      setSettingsMode('none');
    }
  };

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
    if (!hsl || hsl.indexOf(' ') === -1) return '#000000';
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
    { name: 'Zinc', value: '240 5% 26%' },
    { name: 'Slate', value: '215.4 16.3% 46.9%' },
    { name: 'Red', value: '0 84.2% 60.2%' },
    { name: 'Rose', value: '346.8 77.2% 49.8%' },
    { name: 'Orange', value: '24.6 95% 53%' },
    { name: 'Amber', value: '37.7 92.1% 50.2%' },
    { name: 'Yellow', value: '47.9 95.8% 53.1%' },
    { name: 'Lime', value: '84 100% 59%' },
    { name: 'Green', value: '142 71% 45%' },
    { name: 'Emerald', value: '158.1 64.4% 39.4%' },
    { name: 'Teal', value: '173.4 80.4% 40%' },
    { name: 'Cyan', value: '189 94% 43%' },
    { name: 'Sky', value: '198.6 88.7% 48.4%' },
    { name: 'Blue', value: '221 83% 53%' },
    { name: 'Indigo', value: '239 84% 67%' },
    { name: 'Violet', value: '262 83% 58%' },
    { name: 'Purple', value: '271.5 81.3% 55.9%' },
    { name: 'Fuchsia', value: '292 84% 61%' },
    { name: 'Pink', value: '330 81% 60%' }
  ];

  const patternNames: Record<string, string> = {
    nexus: 'Nexus', shopeers: 'Shopeers', projectli: 'Projectli',
    magika: 'Magika', workly: 'Workly', taskplus: 'Taskplus',
    eevo: 'Eevo', quantum: 'Quantum', resync: 'ReSync',
  };

  const accentColorName = presetColors.find(c => c.value === accentColor)?.name ?? 'Custom';

  const buildConfigPrompt = useCallback((): string => {
    const dc = dashboardConfig;
    const accentHsl = `hsl(${activeAccentColor})`;
    const lines: string[] = [
      '# Configuração Atual do Sistema Whitelabel',
      '',
      '## Visão Geral',
      `- Layout Visual: **${patternNames[visualPattern] ?? visualPattern}**`,
      `- Tema: **${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}**`,
      `- Cor Accent: **${accentColorName}** (${accentHsl})`,
      `- Usar Cor Destaque Personalizada: **${useCustomAccent ? 'Sim' : 'Não'}**`,
      `- Border Radius Global: **${borderRadius}%**`,
      `- Sombras Globais: **${showShadows ? 'Ativadas' : 'Desativadas'}**`,
      '',
      '## Sidebar / Navegação',
      `- Estilo do Botão Ativo: **${dc.sidebarActiveStyle}**`,
      `- Tamanho do Botão: **${dc.sidebarBtnSize}px**`,
      `- Espaçamento (Gap): **${dc.sidebarBtnGap}px**`,
      `- Cor dos Ícones Inativos: **${dc.sidebarIconColor}**`,
      `- Cor do Texto Ativo: **${dc.sidebarActiveTextColor}**`,
      `- Opacidade da Borda: **${dc.sidebarBorderOpacity}%**`,
      '',
      '## Background do Dashboard',
      `- Efeito Animado: **${dc.bgEffect === 'none' ? 'Nenhum' : dc.bgEffect}**`,
      `- Degradê Radial: **${dc.bgGradientEnabled ? 'Ativado' : 'Desativado'}**`,
      ...(dc.bgGradientEnabled ? [
        `  - Cor: hsl(${dc.bgGradientColor})`,
        `  - Opacidade: ${dc.bgGradientOpacity}%`,
        `  - Tamanho: ${dc.bgGradientSize}%`,
        `  - Posição: X=${dc.bgGradientX}% Y=${dc.bgGradientY}%`,
      ] : []),
      '',
      '## Header & Sidebar Chrome',
      `- Opacidade: **${dc.chromeOpacity}%**`,
      `- Backdrop Blur: **${dc.chromeBlur ? `${dc.chromeBlurIntensity}px` : 'Desativado'}**`,
      '',
      '## Cards do Dashboard',
      `- Opacidade: **${dc.cardOpacity}%**`,
      `- Backdrop Blur: **${dc.cardBlur ? `${dc.cardBlurIntensity}px` : 'Desativado'}**`,
      `- Degradê nos Cards: **${dc.cardGradientEnabled ? 'Ativado' : 'Desativado'}**`,
      ...(dc.cardGradientEnabled ? [
        `  - Usar Accent: ${dc.cardGradientUseAccent ? 'Sim' : 'Não'}`,
        `  - Cor: hsl(${dc.cardGradientColor})`,
        `  - Opacidade: ${dc.cardGradientOpacity}%`,
      ] : []),
      '',
      '---',
      '',
      '## Instrução para a IA',
      '',
      `Você é um assistente de desenvolvimento trabalhando no projeto Whitelabel.`,
      `O sistema possui múltiplos layouts visuais (Nexus, Shopeers, Projectli, Magika, Workly, Taskplus, Eevo, Quantum, ReSync).`,
      `**O usuário selecionou o layout: ${patternNames[visualPattern] ?? visualPattern}.**`,
      ``,
      `Com base na configuração acima, ao gerar código ou fazer alterações:`,
      `1. Utilize o layout **${patternNames[visualPattern] ?? visualPattern}** como referência principal.`,
      `2. A cor accent ativa é ${accentHsl} — use-a em elementos de destaque.`,
      `3. O tema ativo é **${theme}** — garanta contraste adequado.`,
      `4. Respeite as configurações de sidebar, cards e background descritas acima.`,
      `5. Não hardcode cores — use as variáveis CSS (--primary, --accent, --foreground, etc.).`,
    ];
    return lines.join('\n');
  }, [visualPattern, theme, accentColor, activeAccentColor, accentColorName, useCustomAccent,
      borderRadius, showShadows, dashboardConfig, patternNames]);

  const handleCopyPrompt = useCallback(async () => {
    const prompt = buildConfigPrompt();
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [buildConfigPrompt]);

  return (
    <div ref={dockRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center select-none font-sans">
      
      {/* ===================== POPOVERS ===================== */}
      
      {activeMenu === 'visual' && (
        <Popover title="Visual Layout">
          <ul className="flex flex-col gap-0.5 max-h-[250px] overflow-y-auto scrollbar-stylized pr-1">
            {patterns.map((pattern) => (
              <li
                key={pattern.id}
                onClick={() => setVisualPattern(pattern.id)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-xs rounded-md cursor-pointer transition-colors',
                  visualPattern === pattern.id ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <span>{pattern.name}</span>
                {visualPattern === pattern.id && <CheckCircle2 size={12} />}
              </li>
            ))}
          </ul>
        </Popover>
      )}

      {activeMenu === 'color' && (
        <Popover title="Cor Principal" isWide>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-5 gap-2.5 px-1 place-items-center">
              {presetColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border overflow-hidden",
                    useCustomAccent && accentColor === color.value ? "ring-2 ring-blue-500 scale-110 border-white/20" : "border-transparent opacity-90 hover:opacity-100 hover:scale-110"
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  title={color.name}
                >
                  {useCustomAccent && accentColor === color.value && <CheckCircle2 size={12} className="text-white mix-blend-difference" />}
                </button>
              ))}
              
              {/* Custom Color Wheel Picker */}
              <div className="relative w-8 h-8 rounded-full group cursor-pointer" title="Cor personalizada">
                <input
                  type="color"
                  value={hslToHex(useCustomAccent ? accentColor : '0 0% 0%')}
                  onChange={(e) => setAccentColor(hexToHsl(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                  "absolute inset-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-transform overflow-hidden",
                  !presetColors.some(c => c.value === accentColor) && useCustomAccent ? "ring-2 ring-blue-500 scale-110" : "group-hover:scale-110"
                )} style={{
                  background: 'conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)'
                }}>
                  {!presetColors.some(c => c.value === accentColor) && useCustomAccent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 shadow-sm" style={{ backgroundColor: `hsl(${accentColor})`, borderStyle: 'solid', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.4)' }} />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2c2c2c] flex items-center justify-center border border-white/10 group-hover:scale-90 transition-transform">
                      <Sliders size={10} className="text-white/80" />
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg px-3">
              <span className="text-xs text-white/70">Usar Destaque?</span>
              <button
                type="button"
                onClick={() => setUseCustomAccent(!useCustomAccent)}
                className={cn('relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors', useCustomAccent ? 'bg-blue-500' : 'bg-white/20')}
              >
                <span className={cn('pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white ring-0 transition-transform', useCustomAccent ? 'translate-x-5' : 'translate-x-1')} />
              </button>
            </div>
          </div>
        </Popover>
      )}

      {activeMenu === 'radius' && (
        <Popover title="Curvas e Sombras">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center mb-2 px-1 text-xs">
                <span className="text-white/70">Arredondamento</span>
                <span className="text-white font-mono bg-white/10 px-1 rounded">{borderRadius}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-500 bg-transparent h-1"
                style={{ appearance: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-white/70">Sombras Globais</span>
              <button
                type="button"
                onClick={() => setShowShadows(!showShadows)}
                className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', showShadows ? 'bg-blue-500' : 'bg-white/20')}
              >
                <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', showShadows ? 'translate-x-4' : 'translate-x-1')} />
              </button>
            </div>
          </div>
        </Popover>
      )}
      {activeMenu === 'dashbg' && !showFormWidthOption && (
        <Popover title="Fundo & Chrome" isWide className="max-h-[500px] overflow-y-auto scrollbar-stylized">
          <div className="flex flex-col gap-4">

            {/* ── Degradê Radial ── */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-white/70 font-semibold">Degradê Radial</span>
                <button onClick={() => setDashboardConfig(p => ({ ...p, bgGradientEnabled: !p.bgGradientEnabled }))}
                  className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', dashboardConfig.bgGradientEnabled ? 'bg-blue-500' : 'bg-white/20')}>
                  <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', dashboardConfig.bgGradientEnabled ? 'translate-x-4' : 'translate-x-1')} />
                </button>
              </div>
              {dashboardConfig.bgGradientEnabled && (
                <div className="flex flex-col gap-2.5 bg-white/5 p-2 rounded-lg">
                  {/* Color picker + presets */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-full flex-shrink-0 overflow-hidden border border-white/20 cursor-pointer group">
                      <input type="color" value={hslToHex(dashboardConfig.bgGradientColor)}
                        onChange={(e) => setDashboardConfig(p => ({ ...p, bgGradientColor: hexToHsl(e.target.value) }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: `hsl(${dashboardConfig.bgGradientColor})` }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {['142 71% 45%','221 83% 53%','262 83% 58%','0 84.2% 60.2%','37.7 92.1% 50.2%','173.4 80.4% 40%','330 81% 60%','84 100% 59%'].map(c => (
                        <button key={c} onClick={() => setDashboardConfig(p => ({ ...p, bgGradientColor: c }))}
                          className={cn('w-5 h-5 rounded-full border transition-all', dashboardConfig.bgGradientColor === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:scale-110')}
                          style={{ backgroundColor: `hsl(${c})` }} />
                      ))}
                    </div>
                  </div>
                  {/* Opacity */}
                  <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5"><span>Opacidade</span><span className="font-mono">{dashboardConfig.bgGradientOpacity}%</span></div>
                    <input type="range" min={5} max={100} step={5} value={dashboardConfig.bgGradientOpacity}
                      onChange={(e) => setDashboardConfig(p => ({ ...p, bgGradientOpacity: Number(e.target.value) }))}
                      className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
                  {/* Size */}
                  <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5"><span>Tamanho</span><span className="font-mono">{dashboardConfig.bgGradientSize}%</span></div>
                    <input type="range" min={20} max={200} step={10} value={dashboardConfig.bgGradientSize}
                      onChange={(e) => setDashboardConfig(p => ({ ...p, bgGradientSize: Number(e.target.value) }))}
                      className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
                  {/* Position XY */}
                  <div className="grid grid-cols-2 gap-2">
                    <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5"><span>Pos X</span><span className="font-mono">{dashboardConfig.bgGradientX}%</span></div>
                      <input type="range" min={0} max={100} step={5} value={dashboardConfig.bgGradientX}
                        onChange={(e) => setDashboardConfig(p => ({ ...p, bgGradientX: Number(e.target.value) }))}
                        className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
                    <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5"><span>Pos Y</span><span className="font-mono">{dashboardConfig.bgGradientY}%</span></div>
                      <input type="range" min={0} max={100} step={5} value={dashboardConfig.bgGradientY}
                        onChange={(e) => setDashboardConfig(p => ({ ...p, bgGradientY: Number(e.target.value) }))}
                        className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* ── Efeito Animado ── */}
            <div>
              <span className="text-xs text-white/70 font-semibold mb-2 block px-1">Efeito Animado</span>
              <div className="relative">
                <select
                  value={dashboardConfig.bgEffect}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, bgEffect: e.target.value as DashboardBgEffect }))}
                  className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-2 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {AUTH_BG_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#2c2c2c] text-white">{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              </div>
              {dashboardConfig.bgEffect !== 'none' && (
                <button onClick={() => setSettingsMode('authbg')}
                  className="w-full mt-2 h-8 flex items-center justify-center gap-2 text-xs bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors">
                  <Settings2 size={12} /> Configurar Efeito
                </button>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* ── Header & Sidebar Chrome (unificado) ── */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-white/50 uppercase font-semibold px-1">Header & Sidebar</span>
              <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5 px-1"><span>Opacidade</span><span className="font-mono">{dashboardConfig.chromeOpacity}%</span></div>
                <input type="range" min={10} max={100} step={5} value={dashboardConfig.chromeOpacity}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, chromeOpacity: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-white/60">Backdrop Blur</span>
                <button onClick={() => setDashboardConfig(p => ({ ...p, chromeBlur: !p.chromeBlur }))}
                  className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', dashboardConfig.chromeBlur ? 'bg-blue-500' : 'bg-white/20')}>
                  <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', dashboardConfig.chromeBlur ? 'translate-x-4' : 'translate-x-1')} />
                </button>
              </div>
              {dashboardConfig.chromeBlur && (
                <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5 px-1"><span>Intensidade</span><span className="font-mono">{dashboardConfig.chromeBlurIntensity}px</span></div>
                  <input type="range" min={2} max={40} step={1} value={dashboardConfig.chromeBlurIntensity}
                    onChange={(e) => setDashboardConfig(p => ({ ...p, chromeBlurIntensity: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* ── Cards ── */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-white/50 uppercase font-semibold px-1">Cards do Dashboard</span>

              <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5 px-1"><span>Opacidade</span><span className="font-mono">{dashboardConfig.cardOpacity}%</span></div>
                <input type="range" min={10} max={100} step={5} value={dashboardConfig.cardOpacity}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, cardOpacity: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>

              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-white/60">Backdrop Blur</span>
                <button onClick={() => setDashboardConfig(p => ({ ...p, cardBlur: !p.cardBlur }))}
                  className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', dashboardConfig.cardBlur ? 'bg-blue-500' : 'bg-white/20')}>
                  <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', dashboardConfig.cardBlur ? 'translate-x-4' : 'translate-x-1')} />
                </button>
              </div>
              {dashboardConfig.cardBlur && (
                <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5 px-1"><span>Intensidade</span><span className="font-mono">{dashboardConfig.cardBlurIntensity}px</span></div>
                  <input type="range" min={2} max={40} step={1} value={dashboardConfig.cardBlurIntensity}
                    onChange={(e) => setDashboardConfig(p => ({ ...p, cardBlurIntensity: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
              )}

              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-white/60">Degradê Radial</span>
                <button onClick={() => setDashboardConfig(p => ({ ...p, cardGradientEnabled: !p.cardGradientEnabled }))}
                  className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', dashboardConfig.cardGradientEnabled ? 'bg-blue-500' : 'bg-white/20')}>
                  <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', dashboardConfig.cardGradientEnabled ? 'translate-x-4' : 'translate-x-1')} />
                </button>
              </div>
              {dashboardConfig.cardGradientEnabled && (
                <div className="bg-white/5 p-2 rounded-lg flex flex-col gap-2">
                  {/* Toggle: usar cor destaque */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-white/60">Usar cor destaque</span>
                    <button onClick={() => setDashboardConfig(p => ({ ...p, cardGradientUseAccent: !p.cardGradientUseAccent }))}
                      className={cn('relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors', dashboardConfig.cardGradientUseAccent ? 'bg-blue-500' : 'bg-white/20')}>
                      <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', dashboardConfig.cardGradientUseAccent ? 'translate-x-4' : 'translate-x-1')} />
                    </button>
                  </div>
                  {/* Picker de cor customizado (visível apenas quando não estiver usando destaque) */}
                  {!dashboardConfig.cardGradientUseAccent && (
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full flex-shrink-0 overflow-hidden border border-white/20 cursor-pointer">
                        <input type="color" value={hslToHex(dashboardConfig.cardGradientColor)}
                          onChange={(e) => setDashboardConfig(p => ({ ...p, cardGradientColor: hexToHsl(e.target.value) }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: `hsl(${dashboardConfig.cardGradientColor})` }} />
                      </div>
                      <div className="flex gap-1">
                        {['142 71% 45%','221 83% 53%','262 83% 58%','0 84.2% 60.2%','37.7 92.1% 50.2%','330 81% 60%','84 100% 59%'].map(c => (
                          <button key={c} onClick={() => setDashboardConfig(p => ({ ...p, cardGradientColor: c }))}
                            className={cn('w-4 h-4 rounded-full border transition-all', dashboardConfig.cardGradientColor === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:scale-110')}
                            style={{ backgroundColor: `hsl(${c})` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div><div className="flex justify-between text-[10px] text-white/50 mb-0.5"><span>Opacidade</span><span className="font-mono">{dashboardConfig.cardGradientOpacity}%</span></div>
                    <input type="range" min={5} max={60} step={5} value={dashboardConfig.cardGradientOpacity}
                      onChange={(e) => setDashboardConfig(p => ({ ...p, cardGradientOpacity: Number(e.target.value) }))}
                      className="w-full cursor-pointer accent-blue-500 h-1" style={{ appearance: 'auto' }} /></div>
                </div>
              )}
            </div>
          </div>
        </Popover>
      )}

      {/* Effect settings for dashboard bg (reuse AuthBgSettingsPanel) */}
      {activeMenu === 'dashbg' && settingsMode === 'authbg' && !showFormWidthOption && (
        <Popover title="Configurar Efeito" isWide>
          <div className="h-[350px] pr-1 [&_*]:text-foreground dark:[&_*]:text-foreground bg-background rounded-xl">
            <AuthBgSettingsPanel onBack={() => setSettingsMode('none')} />
          </div>
        </Popover>
      )}

      {activeMenu === 'layout' && !showFormWidthOption && (
        <Popover title="Dashboard Config" isWide>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs text-white/70 mb-2 block px-1">Estilo do Botão Ativo</span>
              <div className="grid grid-cols-2 gap-1.5 px-0.5">
                {([
                  { value: 'left-border', label: 'Workly (Left Border)' },
                  { value: 'gradient', label: 'Degradê Suave' },
                  { value: 'solid', label: 'Fundo Sólido' },
                  { value: 'soft', label: 'Fundo Suave' },
                  { value: 'glass', label: 'Morfismo (Glass)' },
                  { value: 'minimal', label: 'Minimalista' },
                  { value: 'workly-neon', label: 'Workly Neon Glow' },
                ] as { value: SidebarActiveStyle; label: string }[]).map(style => (
                  <button
                    key={style.value}
                    onClick={() => setDashboardConfig(p => ({ ...p, sidebarActiveStyle: style.value }))}
                    className={cn(
                      "text-[9px] py-2 px-1 rounded-md transition-all font-semibold border",
                      dashboardConfig.sidebarActiveStyle === style.value 
                        ? "bg-white/10 text-white border-white/20 shadow-sm" 
                        : "bg-transparent text-white/50 border-white/5 hover:bg-white/5 hover:text-white/80"
                    )}
                  >
                     {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-white/70 mb-1 block px-1">Cor do Texto (Botão Ativo)</span>
              <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                 {([
                   { value: 'foreground', label: 'Padrão' },
                   { value: 'white', label: 'Branco' },
                   { value: 'black', label: 'Preto' },
                   { value: 'primary', label: 'Destaque' }
                 ] as const).map(color => (
                    <button
                      key={color.value}
                      onClick={() => setDashboardConfig(p => ({ ...p, sidebarActiveTextColor: color.value as any }))}
                      className={cn("flex-1 px-1 py-1 rounded-md transition-all text-[9px] uppercase font-bold", dashboardConfig.sidebarActiveTextColor === color.value ? "bg-white/15 text-white" : "text-white/50 hover:bg-white/10 hover:text-white")}
                    >
                      {color.label}
                    </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-[10px] text-white/70 uppercase">Tamanho do Botão</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1 rounded uppercase">{dashboardConfig.sidebarBtnSize}px</span>
                </div>
                <input
                  type="range" min={30} max={60} step={1}
                  value={dashboardConfig.sidebarBtnSize}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, sidebarBtnSize: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue-500 bg-transparent h-1"
                  style={{ appearance: 'auto' }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-[10px] text-white/70 uppercase">Espaçamento (Gap)</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1 rounded uppercase">{dashboardConfig.sidebarBtnGap}px</span>
                </div>
                <input
                  type="range" min={0} max={32} step={1}
                  value={dashboardConfig.sidebarBtnGap}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, sidebarBtnGap: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue-500 bg-transparent h-1"
                  style={{ appearance: 'auto' }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-[10px] text-white/70 uppercase">Opacidade da Borda</span>
                  <span className="text-[10px] font-mono bg-white/10 px-1 rounded uppercase">{dashboardConfig.sidebarBorderOpacity}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5}
                  value={dashboardConfig.sidebarBorderOpacity}
                  onChange={(e) => setDashboardConfig(p => ({ ...p, sidebarBorderOpacity: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue-500 bg-transparent h-1"
                  style={{ appearance: 'auto' }}
                />
              </div>
            </div>
            
            <div>
               <span className="text-[10px] text-white/70 uppercase mb-1 block px-1">Cores dos Outros Ícones</span>
               <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                 {([
                   { value: 'foreground', label: 'Padrão' },
                   { value: 'background', label: 'Inverso' },
                   { value: 'primary', label: 'Destaque' }
                 ] as const).map(color => (
                    <button
                      key={color.value}
                      onClick={() => setDashboardConfig(p => ({ ...p, sidebarIconColor: color.value as any }))}
                      className={cn("flex-1 px-1 py-1 rounded-md transition-all text-[9px] capitalize flex items-center justify-center gap-1", dashboardConfig.sidebarIconColor === color.value ? "bg-white/15 text-white font-semibold" : "text-white/50")}
                    >
                      {color.label}
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </Popover>
      )}

      {activeMenu === 'authbg' && showFormWidthOption && (
        <Popover title="Auth Background" isWide={settingsMode === 'authbg'}>
          {settingsMode === 'authbg' ? (
             <div className="h-[350px] pr-1 [&_*]:text-foreground dark:[&_*]:text-foreground bg-background rounded-xl">
               <AuthBgSettingsPanel onBack={() => setSettingsMode('none')} />
             </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div>
                <button
                  className="w-full h-8 px-2 text-xs bg-white/5 rounded-md text-white flex items-center justify-between hover:bg-white/10 transition-colors cursor-default"
                >
                  <span className="truncate">{AUTH_BG_OPTIONS.find(o => o.value === authBg)?.label ?? 'Nenhum'}</span>
                </button>
              </div>
              
              <ul className="flex flex-col gap-0.5 max-h-48 overflow-y-auto scrollbar-stylized mt-2 border-t border-white/10 pt-2">
                {AUTH_BG_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => { setAuthBg(opt.value); }}
                    className={cn(
                      'flex items-center justify-between px-2 py-1.5 text-xs cursor-pointer transition-colors rounded-md',
                      authBg === opt.value ? 'bg-white/15 font-semibold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {opt.label}
                    {authBg === opt.value && <CheckCircle2 size={12} />}
                  </li>
                ))}
              </ul>
              
              {authBg !== 'none' && (
                <button
                  onClick={() => setSettingsMode('authbg')}
                  className="w-full mt-2 h-8 flex items-center justify-center gap-2 text-xs bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Settings2 size={12} /> Configurar Efeito
                </button>
              )}
            </div>
          )}
        </Popover>
      )}

      {activeMenu === 'form' && showFormWidthOption && (
        <Popover title="Formulário Auth">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-white/70">Largura</span>
                <span className="text-[10px] font-mono bg-white/10 px-1 rounded">{authFormWidth}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={60}
                value={authFormWidth}
                onChange={(e) => setAuthFormWidth(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-500 bg-transparent h-1"
                style={{ appearance: 'auto' }}
              />
            </div>

            {visualPattern === 'taskplus' ? (
              <div className="bg-white/5 p-1 rounded-lg flex gap-1 text-xs">
                {(['left', 'center', 'right'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setAuthFormSide(option)}
                    className={cn("flex-1 py-1.5 rounded-md transition-all font-semibold capitalize", authFormSide === option ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:bg-white/10 hover:text-white")}
                  >
                    {option === 'left' ? 'Esq' : option === 'right' ? 'Dir' : 'Centro'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-white/70">Form à {authFormSide === 'left' ? 'Esquerda' : 'Direita'}</span>
                <button
                  onClick={() => setAuthFormSide(authFormSide === 'left' ? 'right' : 'left')}
                  className="relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors bg-blue-500"
                >
                  <span className={cn('pointer-events-none inline-block h-2 w-2 transform rounded-full bg-white ring-0 transition-transform', authFormSide === 'right' ? 'translate-x-4' : 'translate-x-1')} />
                </button>
              </div>
            )}
          </div>
        </Popover>
      )}


      {/* ===================== DOCK BAR (FIGMA STYLE) ===================== */}
      
      <div className="h-[46px] bg-[#2c2c2c] dark:bg-[#2c2c2c] rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] flex items-center p-1.5 gap-1 text-white overflow-visible relative">
        
        {/* Cursor/Move (Decorative) */}
        <div className="w-8 h-8 flex items-center justify-center text-blue-400 hover:bg-white/5 rounded-lg border border-transparent transition-colors">
           <MousePointer2 size={16} className="fill-blue-400" />
        </div>
        
        <div className="w-px h-5 bg-white/10 mx-0.5" />

        <button 
          onClick={() => toggleMenu('visual')} 
          className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'visual' ? "bg-white/20" : "hover:bg-white/10")}
          title="Visual Theme"
        >
          <Layers size={16} className={cn("opacity-80 transition-transform", activeMenu === 'visual' && "opacity-100")} />
          <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'visual' ? "rotate-180 opacity-60" : "")} />
        </button>

        <button 
          onClick={() => toggleMenu('color')} 
          className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'color' ? "bg-white/20" : "hover:bg-white/10")}
          title="Accent Color"
        >
          <Palette size={16} className={cn("opacity-80 transition-transform", activeMenu === 'color' && "opacity-100")} />
          <div className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20 -mr-0.5" style={{ backgroundColor: `hsl(${activeAccentColor})` }} />
          <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'color' ? "rotate-180 opacity-60" : "")} />
        </button>

        <button 
          onClick={() => toggleMenu('radius')} 
          className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'radius' ? "bg-white/20" : "hover:bg-white/10")}
          title="Radius & Shadows"
        >
          <div className={cn("w-3.5 h-3.5 border border-white/80 transition-all", activeMenu === 'radius' && "bg-white/20")} style={{ borderRadius: `${(borderRadius / 100) * 8}px` }} />
          <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'radius' ? "rotate-180 opacity-60" : "")} />
        </button>

        {/* Type button removido */}

        {showFormWidthOption ? (
           <>
            <button 
              onClick={() => toggleMenu('authbg')} 
              className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'authbg' ? "bg-white/20" : "hover:bg-white/10")}
              title="Auth Background"
            >
              <Wand2 size={16} className={cn("opacity-80 transition-transform", activeMenu === 'authbg' && "opacity-100")} />
              <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'authbg' ? "rotate-180 opacity-60" : "")} />
            </button>
            
            <button 
              onClick={() => toggleMenu('form')} 
              className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'form' ? "bg-white/20" : "hover:bg-white/10")}
              title="Form Width & Side"
            >
              {authFormSide === 'left' ? <PanelLeft size={16} className="opacity-80" /> : <PanelRight size={16} className="opacity-80" />}
              <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'form' ? "rotate-180 opacity-60" : "")} />
            </button>
           </>
        ) : (
           <>
            <button 
              onClick={() => toggleMenu('layout')} 
              className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'layout' ? "bg-white/20" : "hover:bg-white/10")}
              title="Dashboard Layout"
            >
              <Settings2 size={16} className={cn("opacity-80 transition-transform", activeMenu === 'layout' && "opacity-100")} />
              <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'layout' ? "rotate-180 opacity-60" : "")} />
            </button>
            <button 
              onClick={() => toggleMenu('dashbg')} 
              className={cn("h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors", activeMenu === 'dashbg' ? "bg-white/20" : "hover:bg-white/10")}
              title="Background & Chrome"
            >
              <ImageIcon size={16} className={cn("opacity-80 transition-transform", activeMenu === 'dashbg' && "opacity-100")} />
              <ChevronDown size={10} className={cn("opacity-40 transition-transform", activeMenu === 'dashbg' ? "rotate-180 opacity-60" : "")} />
            </button>
           </>
        )}

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        {/* Copy Config Prompt */}
        <button
          onClick={handleCopyPrompt}
          className={cn(
            "h-8 px-2.5 flex items-center justify-center gap-1.5 rounded-lg transition-all text-[10px] font-semibold",
            copied
              ? "bg-green-500/20 text-green-400"
              : "hover:bg-white/10 text-white/60 hover:text-white"
          )}
          title="Copiar prompt com a configuração atual"
        >
          {copied ? <CheckIcon size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Prompt'}
        </button>

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors relative"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon size={16} className="fill-white/20" /> : <Sun size={16} className="fill-white/80" />}
        </button>

      </div>
    </div>
  );
};
