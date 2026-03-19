/** Converte HSL string "h s% l%" para hex — utilitário compartilhado */
export const hslToHex = (hsl: string | undefined): string => {
  if (!hsl || !hsl.includes(' ')) return '#000000';
  const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v));
  if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000';
  const ll = l / 100;
  const a = (s / 100) * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/** Gera paleta triádica (+120°, +240°) a partir de um HSL string */
export const getTriadicPalette = (hsl: string): string[] => {
  const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v));
  return [
    hslToHex(hsl),
    hslToHex(`${(h + 120) % 360} ${s}% ${l}%`),
    hslToHex(`${(h + 240) % 360} ${s}% ${l}%`),
  ];
};
