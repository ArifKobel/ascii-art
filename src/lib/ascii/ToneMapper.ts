import type { Rgba, ToneSettings } from "#/lib/ascii/types";

export class ToneMapper {
  private readonly settings: ToneSettings;

  constructor(settings: ToneSettings) {
    this.settings = settings;
  }

  map(color: Rgba): number | null {
    const { brightness, contrast, gamma, invert, cutoff } = this.settings;
    const luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    const adjusted = this.clamp((luminance - 0.5) * contrast + 0.5 + brightness);
    const curved = Math.pow(adjusted, 1 / gamma);
    const value = invert ? 1 - curved : curved;

    if (value < cutoff) return null;
    return cutoff >= 1 ? 1 : (value - cutoff) / (1 - cutoff);
  }

  private clamp(value: number) {
    return Math.min(1, Math.max(0, value));
  }
}
