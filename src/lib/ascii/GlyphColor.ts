import type { Rgba } from "#/lib/ascii/types";

export class GlyphColor {
  static fromCell(cell: Rgba, saturation: number) {
    const luma = 0.2126 * cell.r + 0.7152 * cell.g + 0.0722 * cell.b;
    const channel = (value: number) =>
      Math.round(Math.min(255, Math.max(0, luma + (value - luma) * saturation)));
    return `rgb(${channel(cell.r)} ${channel(cell.g)} ${channel(cell.b)})`;
  }
}
