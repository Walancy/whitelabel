/** Ícones SVG locais para botões de login social */

interface IconProps {
  className?: string;
  size?: number;
}

export const GoogleIcon = ({ className, size = 18 }: IconProps) => (
  <img
    src="/icons8-google-logo.svg"
    alt=""
    aria-hidden
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', flexShrink: 0 }}
  />
);

/**
 * AppleIcon — preto no light mode, branco no dark mode via `dark:invert`.
 * O SVG original é preto (#000), então invertemos apenas no dark.
 */
export const AppleIcon = ({ className, size = 18 }: IconProps) => (
  <img
    src="/icons8-apple-logo.svg"
    alt=""
    aria-hidden
    width={size}
    height={size}
    className={['dark:invert', className].filter(Boolean).join(' ')}
    style={{ display: 'inline-block', flexShrink: 0 }}
  />
);

/**
 * FacebookIcon — sempre branco via `brightness(0) invert(1)`.
 * Funciona independente da cor original do SVG.
 */
export const FacebookIcon = ({ className, size = 18 }: IconProps) => (
  <img
    src="/facebook-svgrepo-com.svg"
    alt=""
    aria-hidden
    width={size}
    height={size}
    className={className}
    style={{
      display: 'inline-block',
      flexShrink: 0,
      filter: 'brightness(0) invert(1)',
    }}
  />
);
