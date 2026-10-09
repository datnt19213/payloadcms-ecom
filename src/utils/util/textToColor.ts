export const GetBgColorFromFirstVowel = (text: string): string => {
  if (text) {
    const hash = Array.from(text).reduce((acc, char) => {
      const code = char.charCodeAt(0);
      return (acc << 5) - acc + code;
    }, 0);

    const colorCode = (hash >>> 0).toString(16).padStart(6, "0").slice(0, 6);

    let r = parseInt(colorCode.slice(0, 2), 16);
    let g = parseInt(colorCode.slice(2, 4), 16);
    let b = parseInt(colorCode.slice(4, 6), 16);

    let pastelR = Math.min(255, Math.max(150, r + 55));
    let pastelG = Math.min(255, Math.max(150, g + 55));
    let pastelB = Math.min(255, Math.max(150, b + 55));

    const adjustToDesiredHue = (
      r: number,
      g: number,
      b: number
    ): [number, number, number] => {
      if (r > g && r > b) {
        return [0, Math.min(g, b), Math.max(g, b)]; // Green or purple
      } else if (g > r && g > b) {
        return [0, Math.max(0, g - 50), Math.min(b, g)]; // Green or blue
      } else if (b > r && b > g) {
        return [0, Math.min(r, g), Math.max(r, g)]; // Blue or purple
      } else {
        return [0, 0, Math.max(r, g, b)]; // Indigo
      }
    };

    // Function to avoid cyan
    const avoidCyan = (r: number, g: number, b: number): boolean => {
      return g > 150 && b > 150 && r < 100; // Check if it's cyan
    };

    let adjustedR = pastelR;
    let adjustedG = pastelG;
    let adjustedB = pastelB;

    while (avoidCyan(adjustedR, adjustedG, adjustedB)) {
      adjustedG = Math.max(0, adjustedG - 10);
      adjustedB = Math.max(0, adjustedB - 10);
    }

    const [finalR, finalG, finalB] = adjustToDesiredHue(
      adjustedR,
      adjustedG,
      adjustedB
    );

    const adjustedColor = `#${[finalR, finalG, finalB].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

    return adjustedColor;
  }
};

export const AdjustColorBrightness = (
  color: string,
  factor: number
): string => {
  if (color) {
    const hexToRgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
      return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
    };

    const luminance = (r: number, g: number, b: number): number => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const [r, g, b] = hexToRgb(color);
    const lum = luminance(r, g, b);
    const adjust = (value: number, factor: number): number => {
      return Math.min(255, Math.max(0, value + factor * 255));
    };

    const adjustmentFactor = lum > 0.5 ? -factor : factor;

    const newR = adjust(r, adjustmentFactor);
    const newG = adjust(g, adjustmentFactor);
    const newB = adjust(b, adjustmentFactor);

    return rgbToHex(newR, newG, newB);
  }
};
