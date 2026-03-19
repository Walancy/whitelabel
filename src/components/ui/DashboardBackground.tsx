import { lazy, Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';
import { getDefaultConfig } from '@/components/ui/authBgControls';
import type { AuthBgKey } from '@/context/ThemeContext';

const DarkVeil = lazy(() => import('@/components/ui/DarkVeil'));
const SoftAurora = lazy(() => import('@/components/ui/SoftAurora'));
const Aurora = lazy(() => import('@/components/ui/Aurora'));
const Iridescence = lazy(() => import('@/components/ui/Iridescence'));
const Silk = lazy(() => import('@/components/ui/Silk'));
const ColorBends = lazy(() => import('@/components/ui/ColorBends'));
const PixelBlast = lazy(() => import('@/components/ui/pixel-blast/PixelBlast'));
const Beams = lazy(() => import('@/components/ui/Beams'));
const GradientBlinds = lazy(() => import('@/components/ui/GradientBlinds'));
const LiquidEther = lazy(() => import('@/components/ui/liquid-ether/LiquidEther'));
const LineWaves = lazy(() => import('@/components/ui/LineWaves'));
const LightRays = lazy(() => import('@/components/ui/LightRays'));
const DotGrid = lazy(() => import('@/components/ui/DotGrid'));
const ShapeGrid = lazy(() => import('@/components/ui/ShapeGrid'));
const Grainient = lazy(() => import('@/components/ui/Grainient'));
const GridDistortion = lazy(() => import('@/components/ui/GridDistortion'));

const shiftHue = (hsl: string, deg: number) =>
  hsl.replace(/^(\d+)/, (_, h) => String((Number(h) + deg) % 360));

export function DashboardBackground() {
  const { activeAccentColor, authBgConfigs, theme, dashboardConfig } = useTheme();
  const { bgEffect, bgGradientEnabled, bgGradientColor, bgGradientOpacity, bgGradientSize, bgGradientX, bgGradientY } = dashboardConfig;

  const hasBg = bgEffect !== 'none';
  const hasGradient = bgGradientEnabled;

  if (!hasBg && !hasGradient) return null;
  if (!activeAccentColor) return null;

  const hex = hslToHex(activeAccentColor);
  const hex2 = hslToHex(shiftHue(activeAccentColor, 120));
  const hex3 = hslToHex(shiftHue(activeAccentColor, 240));
  const autoBgColor = theme === 'dark' ? '#000000' : '#ffffff';

  const defaults = hasBg ? getDefaultConfig(bgEffect as AuthBgKey) : {};
  const cfg = hasBg ? { ...defaults, ...(authBgConfigs[bgEffect] ?? {}) } : {};
  const n = (k: string) => Number(cfg[k] ?? (defaults as Record<string, number>)[k]);
  const s = (k: string) => String(cfg[k] ?? (defaults as Record<string, string>)[k]);
  const b = (k: string) => Boolean(cfg[k] ?? (defaults as Record<string, boolean>)[k]);
  const bgColor = s('bgColor') && s('bgColor') !== 'auto' ? s('bgColor') : autoBgColor;

  const gradColorHex = bgGradientColor ? hslToHex(bgGradientColor) : '#22c55e';
  const gradOpacity = bgGradientOpacity / 100;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Radial gradient with configurable size and position */}
      {hasGradient && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `radial-gradient(ellipse ${bgGradientSize}% ${bgGradientSize}% at ${bgGradientX}% ${bgGradientY}%, ${gradColorHex}${Math.round(gradOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`
          }}
        />
      )}

      {/* Full BG Effect layer */}
      {hasBg && (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: bgColor }}>
          <Suspense fallback={null}>
            {bgEffect === 'dark-veil' && <DarkVeil hueShift={n('hueShift')} noiseIntensity={n('noiseIntensity')} scanlineIntensity={n('scanlineIntensity')} speed={n('speed')} scanlineFrequency={n('scanlineFrequency')} warpAmount={n('warpAmount')} resolutionScale={n('resolutionScale')} tintColor={hex} />}
            {bgEffect === 'soft-aurora' && <SoftAurora speed={n('speed')} scale={1.5} brightness={n('brightness')} color1={hex} color2={hex2} noiseFrequency={n('noiseFrequency')} noiseAmplitude={n('noiseAmplitude')} bandSpread={n('bandSpread')} enableMouseInteraction mouseInfluence={0.25} />}
            {bgEffect === 'aurora' && <Aurora colorStops={[hex, hex2, hex3]} amplitude={n('amplitude')} blend={n('blend')} speed={n('speed')} />}
            {bgEffect === 'iridescence' && <Iridescence color={[1, 1, 1]} speed={n('speed')} amplitude={n('amplitude')} />}
            {bgEffect === 'silk' && <Silk color={hex} speed={n('speed')} scale={n('scale')} noiseIntensity={n('noiseIntensity')} rotation={n('rotation')} />}
            {bgEffect === 'color-bends' && <ColorBends colors={[hex, hex2, hex3]} rotation={n('rotation')} speed={n('speed')} scale={n('scale')} frequency={n('frequency')} warpStrength={n('warpStrength')} mouseInfluence={n('mouseInfluence')} parallax={n('parallax')} noise={n('noise')} transparent autoRotate={0} />}
            {bgEffect === 'pixel-blast' && <PixelBlast variant={s('variant') as 'square' | 'circle'} pixelSize={n('pixelSize')} color={hex} patternScale={n('patternScale')} patternDensity={n('patternDensity')} enableRipples={b('enableRipples')} rippleSpeed={n('rippleSpeed')} rippleThickness={n('rippleThickness')} rippleIntensityScale={n('rippleIntensityScale')} speed={n('speed')} edgeFade={n('edgeFade')} transparent />}
            {bgEffect === 'beams' && <Beams lightColor={hex} beamWidth={n('beamWidth')} beamHeight={n('beamHeight')} beamNumber={n('beamNumber')} speed={n('speed')} noiseIntensity={n('noiseIntensity')} scale={n('scale')} rotation={n('rotation')} bgColor={bgColor} rippleShadow={n('rippleShadow')} colorIntensity={n('colorIntensity')} vignette={n('vignette')} />}
            {bgEffect === 'gradient-blinds' && <GradientBlinds gradientColors={[hex, hex2]} blindCount={n('blindCount')} angle={n('angle')} noise={n('noise')} spotlightRadius={n('spotlightRadius')} spotlightSoftness={n('spotlightSoftness')} spotlightOpacity={n('spotlightOpacity')} mouseDampening={n('mouseDampening')} />}
            {bgEffect === 'liquid-ether' && <LiquidEther colors={[hex3, hex2, hex]} mouseForce={n('mouseForce')} cursorSize={n('cursorSize')} autoDemo autoSpeed={n('autoSpeed')} autoIntensity={n('autoIntensity')} resolution={n('resolution')} autoResumeDelay={0} />}
            {bgEffect === 'line-waves' && <LineWaves color1={hex} color2={hex2} color3={hex3} speed={n('speed')} innerLineCount={n('innerLineCount')} outerLineCount={n('outerLineCount')} warpIntensity={n('warpIntensity')} rotation={n('rotation')} edgeFadeWidth={n('edgeFadeWidth')} colorCycleSpeed={n('colorCycleSpeed')} brightness={n('brightness')} enableMouseInteraction mouseInfluence={n('mouseInfluence')} />}
            {bgEffect === 'light-rays' && <LightRays raysOrigin={s('raysOrigin') as 'top-center'} raysColor={hex} raysSpeed={n('raysSpeed')} lightSpread={n('lightSpread')} rayLength={n('rayLength')} pulsating={b('pulsating')} fadeDistance={n('fadeDistance')} saturation={n('saturation')} followMouse mouseInfluence={n('mouseInfluence')} noiseAmount={n('noiseAmount')} distortion={n('distortion')} />}
            {bgEffect === 'dot-grid' && <DotGrid dotSize={n('dotSize')} gap={n('gap')} baseColor={hex} activeColor={hex2} proximity={n('proximity')} speedTrigger={100} shockRadius={250} shockStrength={5} maxSpeed={n('maxSpeed')} returnDuration={n('returnDuration')} />}
            {bgEffect === 'shape-grid' && <ShapeGrid speed={n('speed')} squareSize={n('squareSize')} direction={s('direction') as 'right'} borderColor={hex + '60'} hoverFillColor={hex} shape={s('shape') as 'square'} hoverTrailAmount={n('hoverTrailAmount')} />}
            {bgEffect === 'grainient' && <Grainient color1={hex} color2={hex2} color3={hex3} timeSpeed={n('timeSpeed')} colorBalance={n('colorBalance')} warpStrength={n('warpStrength')} warpFrequency={n('warpFrequency')} warpSpeed={n('warpSpeed')} warpAmplitude={n('warpAmplitude')} blendAngle={n('blendAngle')} blendSoftness={n('blendSoftness')} rotationAmount={n('rotationAmount')} noiseScale={n('noiseScale')} grainAmount={n('grainAmount')} grainScale={n('grainScale')} grainAnimated={b('grainAnimated')} contrast={n('contrast')} gamma={n('gamma')} saturation={n('saturation')} centerX={n('centerX')} centerY={n('centerY')} zoom={n('zoom')} />}
            {bgEffect === 'grid-distortion' && <GridDistortion color1={hex} color2={hex2} color3={hex3} grid={n('grid')} mouse={n('mouse')} strength={n('strength')} relaxation={n('relaxation')} />}
          </Suspense>
        </div>
      )}
    </div>
  );
}
