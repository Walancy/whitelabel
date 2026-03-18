import { lazy, Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';
import { getDefaultConfig } from '@/components/ui/authBgControls';

const DarkVeil       = lazy(() => import('@/components/ui/DarkVeil'));
const SoftAurora     = lazy(() => import('@/components/ui/SoftAurora'));
const Aurora         = lazy(() => import('@/components/ui/Aurora'));
const Iridescence    = lazy(() => import('@/components/ui/Iridescence'));
const Silk           = lazy(() => import('@/components/ui/Silk'));
const ColorBends     = lazy(() => import('@/components/ui/ColorBends'));
const PixelBlast     = lazy(() => import('@/components/ui/pixel-blast/PixelBlast'));
const Beams          = lazy(() => import('@/components/ui/Beams'));
const GradientBlinds = lazy(() => import('@/components/ui/GradientBlinds'));
const LiquidEther    = lazy(() => import('@/components/ui/liquid-ether/LiquidEther'));
const Plasma         = lazy(() => import('@/components/ui/Plasma'));
const LineWaves      = lazy(() => import('@/components/ui/LineWaves'));
const LightRays      = lazy(() => import('@/components/ui/LightRays'));
const LightPillar    = lazy(() => import('@/components/ui/LightPillar'));
const Orb            = lazy(() => import('@/components/ui/Orb'));
const DotGrid        = lazy(() => import('@/components/ui/DotGrid'));
const Prism          = lazy(() => import('@/components/ui/Prism'));
const PrismaticBurst = lazy(() => import('@/components/ui/PrismaticBurst'));
const ShapeGrid      = lazy(() => import('@/components/ui/ShapeGrid'));

export type AuthBgKey =
  | 'none' | 'dark-veil' | 'soft-aurora' | 'aurora' | 'iridescence' | 'silk'
  | 'color-bends' | 'pixel-blast' | 'beams' | 'gradient-blinds' | 'liquid-ether'
  | 'plasma' | 'line-waves' | 'light-rays' | 'light-pillar' | 'orb'
  | 'dot-grid' | 'prism' | 'prismatic-burst' | 'shape-grid';

export const AUTH_BG_OPTIONS: { value: AuthBgKey; label: string }[] = [
  { value: 'none', label: 'Nenhum' }, { value: 'liquid-ether', label: 'Liquid Ether' },
  { value: 'prism', label: 'Prism' }, { value: 'dark-veil', label: 'Dark Veil' },
  { value: 'light-pillar', label: 'Light Pillar' }, { value: 'silk', label: 'Silk' },
  { value: 'light-rays', label: 'Light Rays' }, { value: 'pixel-blast', label: 'Pixel Blast' },
  { value: 'color-bends', label: 'Color Bends' }, { value: 'line-waves', label: 'Line Waves' },
  { value: 'soft-aurora', label: 'Soft Aurora' }, { value: 'aurora', label: 'Aurora' },
  { value: 'plasma', label: 'Plasma' }, { value: 'gradient-blinds', label: 'Gradient Blinds' },
  { value: 'beams', label: 'Beams' }, { value: 'prismatic-burst', label: 'Prismatic Burst' },
  { value: 'dot-grid', label: 'Dot Grid' }, { value: 'iridescence', label: 'Iridescence' },
  { value: 'orb', label: 'Orb' }, { value: 'shape-grid', label: 'Shape Grid' },
];

const shiftHue = (hsl: string, deg: number) =>
  hsl.replace(/^(\d+)/, (_, h) => String((Number(h) + deg) % 360));

export function AuthBackground({ override }: { override?: AuthBgKey }) {
  const { authBg, activeAccentColor, authBgConfigs, theme } = useTheme();
  const active = override ?? authBg;
  if (active === 'none') return null;

  const hex  = hslToHex(activeAccentColor);
  const hex2 = hslToHex(shiftHue(activeAccentColor, 120));
  const hex3 = hslToHex(shiftHue(activeAccentColor, 240));

  const defaults = getDefaultConfig(active);
  const cfg = { ...defaults, ...(authBgConfigs[active] ?? {}) };
  const n = (k: string) => Number(cfg[k] ?? defaults[k]);
  const s = (k: string) => String(cfg[k] ?? defaults[k]);
  const b = (k: string) => Boolean(cfg[k] ?? defaults[k]);

  const rawBgColor = s('bgColor');
  const autoBgColor = theme === 'dark' ? '#000000' : '#ffffff';
  const bgColor = (!rawBgColor || rawBgColor === 'auto') ? autoBgColor : rawBgColor;

  return (
    <div className="absolute inset-0 z-0" style={{ backgroundColor: bgColor }}>
      <Suspense fallback={null}>
        {active === 'dark-veil'       && <DarkVeil hueShift={n('hueShift')} noiseIntensity={n('noiseIntensity')} scanlineIntensity={n('scanlineIntensity')} speed={n('speed')} scanlineFrequency={n('scanlineFrequency')} warpAmount={n('warpAmount')} resolutionScale={n('resolutionScale')} />}
        {active === 'soft-aurora'     && <SoftAurora speed={n('speed')} scale={1.5} brightness={n('brightness')} color1={hex} color2={hex2} noiseFrequency={n('noiseFrequency')} noiseAmplitude={n('noiseAmplitude')} bandSpread={n('bandSpread')} enableMouseInteraction mouseInfluence={0.25} />}
        {active === 'aurora'          && <Aurora colorStops={[hex, hex2, hex3]} amplitude={n('amplitude')} blend={n('blend')} speed={n('speed')} />}
        {active === 'iridescence'     && <Iridescence color={[1,1,1]} speed={n('speed')} amplitude={n('amplitude')} />}
        {active === 'silk'            && <Silk color={hex} speed={n('speed')} scale={n('scale')} noiseIntensity={n('noiseIntensity')} rotation={n('rotation')} />}
        {active === 'color-bends'     && <ColorBends colors={[hex, hex2, hex3]} rotation={n('rotation')} speed={n('speed')} scale={n('scale')} frequency={n('frequency')} warpStrength={n('warpStrength')} mouseInfluence={n('mouseInfluence')} parallax={n('parallax')} noise={n('noise')} transparent autoRotate={0} />}
        {active === 'pixel-blast'     && <PixelBlast variant={s('variant') as 'square'|'circle'} pixelSize={n('pixelSize')} color={hex} patternScale={n('patternScale')} patternDensity={n('patternDensity')} enableRipples={b('enableRipples')} rippleSpeed={n('rippleSpeed')} rippleThickness={n('rippleThickness')} rippleIntensityScale={n('rippleIntensityScale')} speed={n('speed')} edgeFade={n('edgeFade')} transparent />}
        {active === 'beams'           && <Beams lightColor={hex} beamWidth={n('beamWidth')} beamHeight={n('beamHeight')} beamNumber={n('beamNumber')} speed={n('speed')} noiseIntensity={n('noiseIntensity')} scale={n('scale')} rotation={n('rotation')} bgColor={bgColor} rippleShadow={n('rippleShadow')} colorIntensity={n('colorIntensity')} vignette={n('vignette')} />}
        {active === 'gradient-blinds' && <GradientBlinds gradientColors={[hex, hex2]} blindCount={n('blindCount')} angle={n('angle')} noise={n('noise')} spotlightRadius={n('spotlightRadius')} spotlightSoftness={n('spotlightSoftness')} spotlightOpacity={n('spotlightOpacity')} mouseDampening={n('mouseDampening')} />}
        {active === 'liquid-ether'    && <LiquidEther colors={[hex3, hex2, hex]} mouseForce={n('mouseForce')} cursorSize={n('cursorSize')} autoDemo autoSpeed={n('autoSpeed')} autoIntensity={n('autoIntensity')} resolution={n('resolution')} autoResumeDelay={0} />}
        {active === 'plasma'          && <Plasma color={hex} speed={n('speed')} scale={n('scale')} opacity={n('opacity')} />}
        {active === 'line-waves'      && <LineWaves color1={hex} color2={hex2} color3={hex3} speed={n('speed')} innerLineCount={n('innerLineCount')} outerLineCount={n('outerLineCount')} warpIntensity={n('warpIntensity')} rotation={n('rotation')} edgeFadeWidth={n('edgeFadeWidth')} colorCycleSpeed={n('colorCycleSpeed')} brightness={n('brightness')} enableMouseInteraction mouseInfluence={n('mouseInfluence')} />}
        {active === 'light-rays'      && <LightRays raysOrigin={s('raysOrigin') as 'top-center'} raysColor={hex} raysSpeed={n('raysSpeed')} lightSpread={n('lightSpread')} rayLength={n('rayLength')} pulsating={b('pulsating')} fadeDistance={n('fadeDistance')} saturation={n('saturation')} followMouse mouseInfluence={n('mouseInfluence')} noiseAmount={n('noiseAmount')} distortion={n('distortion')} />}
        {active === 'light-pillar'    && <LightPillar topColor={hex} bottomColor={hex2} intensity={n('intensity')} rotationSpeed={n('rotationSpeed')} pillarWidth={n('pillarWidth')} pillarHeight={n('pillarHeight')} glowAmount={n('glowAmount')} noiseIntensity={n('noiseIntensity')} />}
        {active === 'orb'             && <Orb hue={n('hue')} hoverIntensity={n('hoverIntensity')} rotateOnHover forceHoverState={false} />}
        {active === 'dot-grid'        && <DotGrid dotSize={n('dotSize')} gap={n('gap')} baseColor={hex} activeColor={hex2} proximity={n('proximity')} speedTrigger={n('speedTrigger')} shockRadius={n('shockRadius')} shockStrength={n('shockStrength')} maxSpeed={n('maxSpeed')} resistance={n('resistance')} returnDuration={n('returnDuration')} />}
        {active === 'prism'           && <Prism height={n('height')} baseWidth={n('baseWidth')} animationType={s('animationType') as 'rotate'|'hover'|'3drotate'} glow={n('glow')} noise={n('noise')} transparent scale={n('scale')} hueShift={n('hueShift')} colorFrequency={n('colorFrequency')} hoverStrength={n('hoverStrength')} inertia={n('inertia')} bloom={n('bloom')} timeScale={n('timeScale')} />}
        {active === 'prismatic-burst' && <PrismaticBurst intensity={n('intensity')} speed={n('speed')} animationType={s('animationType') as 'rotate'|'rotate3d'|'hover'} colors={[hex, hex2, hex3]} distort={n('distort')} hoverDampness={n('hoverDampness')} rayCount={n('rayCount')} />}
        {active === 'shape-grid'      && <ShapeGrid speed={n('speed')} squareSize={n('squareSize')} direction={s('direction') as 'right'} borderColor={hex + '60'} hoverFillColor={hex} shape={s('shape') as 'square'} hoverTrailAmount={n('hoverTrailAmount')} />}
      </Suspense>
    </div>
  );
}
