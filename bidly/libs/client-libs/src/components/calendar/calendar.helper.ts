// Hex -> RGB 변환
const hexToRgb = (hex: string) => {
  const parsedHex = hex.replace('#', '');
  const bigint = parseInt(parsedHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// RGB -> HSL 변환
const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
};

// HSL -> RGB 변환
const hslToRgb = ({ h, s, l }: { h: number; s: number; l: number }) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let [r, g, b] = [0, 0, 0];

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

// RGB -> Hex 변환
const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

// 500 색상인지 판단하고, 100으로 변환
const convertToShade = (hex: string): string | null => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  // 밝기 기준 500 정도의 범위 (대략 30% ~ 70% 밝기)
  if (hsl.l >= 0.3 && hsl.l <= 0.7) {
    hsl.l = 0.9; // 100 정도의 밝기 (약 90%)
    const newRgb = hslToRgb(hsl);
    return rgbToHex(newRgb);
  }
  return hex;
};

/**
 * @description 밝기에 따라 글자 색상을 결정합니다.
 * @param hexColor
 * @returns
 */
const getContrastColor = (hexColor: string): string => {
  // Hex 코드 전처리
  hexColor = hexColor.replace('#', '');

  // 짧은 형식 (#fff)일 경우 확장 (#ffffff)
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // RGB 값 추출
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Luminance 계산
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 밝기에 따라 글자 색상 결정
  return luminance > 0.7 ? 'text-gray-800' : 'text-white';
};

/**
 * @description 헥사코드 색상인지 확인합니다.
 */
const isHexColor = (color: string): boolean => /^#[0-9A-F]{6}$/i.test(color);

export const CalendarHelper = {
  getContrastColor,
  isHexColor,
  convertToShade,
};
